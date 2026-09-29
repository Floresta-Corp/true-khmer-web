import {
  PDFDocument,
  StandardFonts,
  TextRenderingMode,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setLineWidth,
  setStrokingColor,
  setTextRenderingMode,
  type PDFFont,
} from "pdf-lib";
import { saveFile } from "~/lib/save-file.client";
import type { CourseCertificate } from "~/features/education/types";
import {
  CERTIFICATE_SIGNATORY,
  CERTIFICATE_SLOTS,
  CERTIFICATE_TEMPLATES,
  type RGB,
} from "./certificate-layout";

/** The standard PDF fonts only cover WinAnsi (Latin) — Khmer script can't be drawn. */
export class UnsupportedCertificateTextError extends Error {
  constructor() {
    super("Certificate download doesn't support Khmer names yet.");
    this.name = "UnsupportedCertificateTextError";
  }
}

export type PrintedCertificate = Pick<
  CourseCertificate,
  | "certificateNo"
  | "recipientName"
  | "courseTitle"
  | "certificateKind"
  | "completedOn"
  | "instructorName"
>;

export async function buildCertificatePdf(
  certificate: PrintedCertificate,
): Promise<Uint8Array> {
  const templateUrl =
    CERTIFICATE_TEMPLATES[certificate.certificateKind ?? "COMPLETION"];

  const [templateBytes, signatureBytes] = await Promise.all([
    fetchBytes(templateUrl),
    fetchBytes(CERTIFICATE_SIGNATORY.signatureUrl).catch(() => null),
  ]);

  const doc = await PDFDocument.load(templateBytes);
  const page = doc.getPage(0);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const name = certificate.recipientName.trim().toUpperCase();
  const course = certificate.courseTitle.trim().toUpperCase();
  assertEncodable(regular, [name, course, certificate.certificateNo]);

  const draw = (
    text: string,
    font: PDFFont,
    slot: { x: number; y: number; size: number; color: RGB },
    size = slot.size,
    y = slot.y,
    strokeWidth = 0,
  ) => {
    if (strokeWidth > 0) {
      page.pushOperators(
        pushGraphicsState(),
        setTextRenderingMode(TextRenderingMode.FillAndOutline),
        setLineWidth(strokeWidth),
        setStrokingColor(rgb(...slot.color)),
      );
    }
    page.drawText(text, {
      x: slot.x,
      y,
      size,
      font,
      color: rgb(...slot.color),
    });
    if (strokeWidth > 0) page.pushOperators(popGraphicsState());
  };

  const { certificateNo, recipientName, courseTitle, completedOn } =
    CERTIFICATE_SLOTS;

  draw(certificate.certificateNo, regular, certificateNo);
  draw(certificate.completedOn, regular, completedOn);

  draw(name, regular, recipientName, fitSize(name, regular, recipientName));

  const title = wrapToFit(course, regular, courseTitle);

  title.lines.forEach((line, index) =>
    draw(
      line,
      regular,
      courseTitle,
      title.size,
      courseTitle.y - index * title.size * courseTitle.lineGap,
      title.size * courseTitle.strokeRatio,
    ),
  );

  if (signatureBytes) {
    const image = await doc.embedPng(signatureBytes);
    const box = CERTIFICATE_SLOTS.signature;
    const scaled = image.scaleToFit(box.width, box.height);
    page.drawImage(image, {
      x: box.x,
      y: box.y,
      width: scaled.width,
      height: scaled.height,
    });
  }

  // Optional, so a Khmer-script instructor name is skipped rather than
  // failing the whole certificate.
  const instructor = certificate.instructorName?.trim();
  if (instructor && isEncodable(regular, instructor)) {
    const slot = CERTIFICATE_SLOTS.instructorName;
    const size = fitSize(instructor, regular, slot);
    draw(
      regular.widthOfTextAtSize(instructor, size) > slot.maxWidth
        ? ellipsize(instructor, regular, size, slot.maxWidth)
        : instructor,
      regular,
      slot,
      size,
    );
  }

  doc.setTitle(`${certificate.courseTitle} — Certificate`);
  doc.setAuthor("True Khmer");
  doc.setSubject(`Certificate No. ${certificate.certificateNo}`);

  return doc.save();
}

export async function downloadCertificatePdf(certificate: PrintedCertificate) {
  const bytes = await buildCertificatePdf(certificate);
  saveFile(
    new Blob([bytes as BlobPart], { type: "application/pdf" }),
    `true-khmer-certificate-${certificate.certificateNo}.pdf`,
  );
}

async function fetchBytes(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return response.arrayBuffer();
}

function assertEncodable(font: PDFFont, texts: string[]) {
  if (!texts.every((text) => isEncodable(font, text))) {
    throw new UnsupportedCertificateTextError();
  }
}

function isEncodable(font: PDFFont, text: string) {
  try {
    font.encodeText(text);
    return true;
  } catch {
    return false;
  }
}

function fitSize(
  text: string,
  font: PDFFont,
  slot: { size: number; minSize: number; maxWidth: number },
) {
  let size = slot.size;
  while (
    size > slot.minSize &&
    font.widthOfTextAtSize(text, size) > slot.maxWidth
  ) {
    size -= 0.5;
  }
  return size;
}

function wrapToFit(
  text: string,
  font: PDFFont,
  slot: { size: number; minSize: number; maxWidth: number; maxLines: number },
) {
  for (let size = slot.size; size >= slot.minSize; size -= 0.5) {
    const lines = wrap(text, font, size, slot.maxWidth);
    if (lines.length <= slot.maxLines) return { size, lines };
  }

  const lines = wrap(text, font, slot.minSize, slot.maxWidth);
  const kept = lines.slice(0, slot.maxLines);
  kept[kept.length - 1] = ellipsize(
    `${kept[kept.length - 1]} ${lines.slice(slot.maxLines).join(" ")}`,
    font,
    slot.minSize,
    slot.maxWidth,
  );
  return { size: slot.minSize, lines: kept };
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word;
    if (current && font.widthOfTextAtSize(next, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function ellipsize(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
) {
  let result = text;
  while (result && font.widthOfTextAtSize(`${result}…`, size) > maxWidth) {
    result = result.slice(0, -1);
  }
  return `${result.trimEnd()}…`;
}
