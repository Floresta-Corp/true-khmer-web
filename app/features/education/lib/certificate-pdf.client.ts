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
import * as fontkit from "fontkit";
import { saveFile } from "~/lib/save-file.client";
import type { CourseCertificate } from "~/features/education/types";
import {
  CERTIFICATE_SIGNATORY,
  CERTIFICATE_SLOTS,
  CERTIFICATE_TEMPLATES,
  type RGB,
} from "./certificate-layout";

const KHMER_FONT_URL = "/fonts/NotoSansKhmer-Regular.ttf";

/** Latin runs use Helvetica, Khmer runs use the embedded Khmer font; any other script can't be drawn. */
export class UnsupportedCertificateTextError extends Error {
  constructor() {
    super("Certificate download doesn't support some characters in this name.");
    this.name = "UnsupportedCertificateTextError";
  }
}

type Face = { latin: PDFFont; khmer: PDFFont | null };
type Run = { text: string; font: PDFFont };

// Khmer, Khmer Symbols, and the zero-width joiners Khmer text relies on.
const KHMER = /[\u1780-\u17FF\u19E0-\u19FF\u200B-\u200D]/;
const KHMER_RUNS = /([\u1780-\u17FF\u19E0-\u19FF\u200B-\u200D]+)/;

/**
 * pdf-lib only writes widths and ToUnicode entries for glyphs reachable from
 * the font's cmap, but Khmer shaping swaps in GSUB-only glyphs (subscripts,
 * ligatures) that would then draw at a default 1000 width. Hand pdf-lib every
 * glyph instead — recovering unmapped ones' text from their `uniXXXX` names —
 * while shaping still runs on the real font.
 */
const fontkitWithAllGlyphs = {
  create(data: Uint8Array) {
    const font = fontkit.create(data);
    const codePoints = new Map<number, number[]>();
    for (const codePoint of font.characterSet) {
      const { id } = font.glyphForCodePoint(codePoint);
      if (!codePoints.has(id)) codePoints.set(id, [codePoint]);
    }
    const glyphs = Array.from({ length: font.numGlyphs }, (_, id) =>
      font.getGlyph(
        id,
        codePoints.get(id) ?? codePointsFromName(font.getGlyph(id).name),
      ),
    );
    return Object.create(font, {
      characterSet: { value: glyphs.map((_, index) => index) },
      glyphForCodePoint: { value: (index: number) => glyphs[index] },
      layout: { value: font.layout.bind(font) },
    });
  },
};

function codePointsFromName(name: string | undefined) {
  const hex = /^uni((?:[0-9A-F]{4})+)/.exec(name ?? "")?.[1] ?? "FFFD";
  return hex.match(/.{4}/g)!.map((unit) => parseInt(unit, 16));
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

  const name = certificate.recipientName.trim().toUpperCase();
  const course = certificate.courseTitle.trim().toUpperCase();
  const instructor = certificate.instructorName?.trim();

  const doc = await PDFDocument.load(templateBytes);
  const page = doc.getPage(0);
  const latin = await doc.embedFont(StandardFonts.Helvetica);

  // Only fetch the Khmer font when a field actually needs it. Embedded whole:
  // pdf-lib's subsetter relies on an API fontkit 2 no longer has.
  let khmer: PDFFont | null = null;
  if ([name, course, instructor].some((text) => text && KHMER.test(text))) {
    doc.registerFontkit(fontkitWithAllGlyphs);
    khmer = await doc.embedFont(await fetchBytes(KHMER_FONT_URL));
  }
  const regular: Face = { latin, khmer };
  assertEncodable(regular, [name, course, certificate.certificateNo]);

  const draw = (
    text: string,
    face: Face,
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
    let x = slot.x;
    for (const run of runs(text, face)) {
      page.drawText(run.text, {
        x,
        y,
        size,
        font: run.font,
        color: rgb(...slot.color),
      });
      x += run.font.widthOfTextAtSize(run.text, size);
    }
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

  // Optional, so an instructor name in an unsupported script is skipped rather
  // than failing the whole certificate.
  if (instructor && isEncodable(regular, instructor)) {
    const slot = CERTIFICATE_SLOTS.instructorName;
    const size = fitSize(instructor, regular, slot);
    draw(
      widthOf(instructor, regular, size) > slot.maxWidth
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

/** Splits text into Khmer and non-Khmer runs, each paired with the font that draws it. */
function runs(text: string, face: Face): Run[] {
  return text
    .split(KHMER_RUNS)
    .filter(Boolean)
    .map((part) => ({
      text: part,
      font: KHMER.test(part) && face.khmer ? face.khmer : face.latin,
    }));
}

function widthOf(text: string, face: Face, size: number) {
  return runs(text, face).reduce(
    (total, run) => total + run.font.widthOfTextAtSize(run.text, size),
    0,
  );
}

function assertEncodable(face: Face, texts: string[]) {
  if (!texts.every((text) => isEncodable(face, text))) {
    throw new UnsupportedCertificateTextError();
  }
}

function isEncodable(face: Face, text: string) {
  try {
    for (const run of runs(text, face)) run.font.encodeText(run.text);
    return true;
  } catch {
    return false;
  }
}

function fitSize(
  text: string,
  face: Face,
  slot: { size: number; minSize: number; maxWidth: number },
) {
  let size = slot.size;
  while (size > slot.minSize && widthOf(text, face, size) > slot.maxWidth) {
    size -= 0.5;
  }
  return size;
}

function wrapToFit(
  text: string,
  face: Face,
  slot: { size: number; minSize: number; maxWidth: number; maxLines: number },
) {
  for (let size = slot.size; size >= slot.minSize; size -= 0.5) {
    const lines = wrap(text, face, size, slot.maxWidth);
    if (lines.length <= slot.maxLines) return { size, lines };
  }

  const lines = wrap(text, face, slot.minSize, slot.maxWidth);
  const kept = lines.slice(0, slot.maxLines);
  kept[kept.length - 1] = ellipsize(
    `${kept[kept.length - 1]} ${lines.slice(slot.maxLines).join(" ")}`,
    face,
    slot.minSize,
    slot.maxWidth,
  );
  return { size: slot.minSize, lines: kept };
}

function wrap(text: string, face: Face, size: number, maxWidth: number) {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word;
    if (current && widthOf(next, face, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function ellipsize(text: string, face: Face, size: number, maxWidth: number) {
  let result = text;
  while (result && widthOf(`${result}…`, face, size) > maxWidth) {
    result = result.slice(0, -1);
  }
  return `${result.trimEnd()}…`;
}
