import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { cn, getSafeExternalUrl } from "~/lib/utils";
import type { ActiveLesson } from "~/features/education/types";
import { pdfEmbedUrl } from "~/features/education/lib/lesson-media";
import {
  MediaBar,
  mediaFrame,
  type LessonMediaProps,
} from "./lesson-media-frame";

export function PdfLesson({ lesson, overlay, flush }: LessonMediaProps) {
  const src = getSafeExternalUrl(lesson.sourceUrl);

  return (
    <div>
      {overlay && <MediaBar>{overlay}</MediaBar>}
      {src ? (
        <RealPdfLesson lesson={lesson} src={src} flush={flush} />
      ) : (
        <SimulatedPdfLesson flush={flush} />
      )}
    </div>
  );
}

function PdfFrame({
  children,
  flush,
}: {
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-115 overflow-hidden border border-gray-200 bg-[#E8E8E8]",
        mediaFrame(flush),
      )}
    >
      {children}
    </div>
  );
}

type PdfPreview =
  | { status: "checking" }
  | { status: "inline" }
  | { status: "blocked"; reason: string };

function isSameOrigin(src: string): boolean {
  try {
    return new URL(src).origin === window.location.origin;
  } catch {
    return true;
  }
}

function RealPdfLesson({
  lesson,
  src,
  flush,
}: {
  lesson: ActiveLesson;
  src: string;
  flush?: boolean;
}) {
  const [preview, setPreview] = useState<PdfPreview>({ status: "checking" });

  useEffect(() => {
    if (navigator.pdfViewerEnabled === false) {
      setPreview({
        status: "blocked",
        reason: "Your browser will not open PDFs inside a page.",
      });
      return;
    }

    if (isSameOrigin(src)) {
      setPreview({
        status: "blocked",
        reason: "This document is not served from the media host.",
      });
      return;
    }

    setPreview({ status: "inline" });
  }, [src]);

  return (
    <PdfFrame flush={flush}>
      {preview.status === "checking" ? (
        <p className="flex size-full items-center justify-center text-sm text-[#7A7A8C]">
          Opening document…
        </p>
      ) : preview.status === "blocked" ? (
        <PdfDownloadNotice
          src={src}
          title={lesson.title}
          reason={preview.reason}
        />
      ) : (
        <iframe
          key={src}
          src={pdfEmbedUrl(src)}
          title={lesson.title}
          referrerPolicy="no-referrer"
          onError={() =>
            setPreview({
              status: "blocked",
              reason: "This document could not be displayed here.",
            })
          }
          className="size-full border-0"
        />
      )}
    </PdfFrame>
  );
}

function PdfDownloadNotice({
  src,
  title,
  reason,
}: {
  src: string;
  title: string;
  reason: string;
}) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(26,26,46,0.08)]">
        <FileText className="size-6.5 text-[#1C5DD4]" aria-hidden />
      </div>

      <div className="max-w-90">
        <p className="text-[15px] font-bold text-[#1A1A2E]">
          This document cannot be previewed here
        </p>
        <p className="mt-1.5 text-sm leading-[1.6] text-[#5B5B70]">
          {reason} Download it to read the lesson.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <a
          href={src}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#1C5DD4] px-5.5 py-2.75 text-sm font-bold text-white transition-colors hover:bg-[#174FB4]"
        >
          <Download className="size-4" aria-hidden />
          Download PDF
        </a>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} in a new tab`}
          className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A2E] transition-colors hover:border-[#1C5DD4] hover:text-[#1C5DD4]"
        >
          <ExternalLink className="size-4" aria-hidden />
          Open in new tab
        </a>
      </div>
    </div>
  );
}

function SimulatedPdfLesson({ flush }: { flush?: boolean }) {
  const lines = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        id: index,
        width: index % 4 === 3 ? "62%" : index % 3 === 0 ? "94%" : "100%",
      })),
    [],
  );

  return (
    <PdfFrame flush={flush}>
      <div className="h-full overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]">
        <div className="flex justify-center p-8">
          <div className="flex aspect-[1/1.294] w-full max-w-130 shrink-0 flex-col gap-3.5 border border-gray-200 bg-white px-10 py-11 shadow-[0_4px_16px_rgba(26,26,46,0.08)]">
            <div className="h-px bg-gray-200" />
            {lines.map((line) => (
              <div
                key={line.id}
                className="h-2.5 rounded-sm bg-[#E8E8E8]"
                style={{ width: line.width }}
              />
            ))}
          </div>
        </div>
      </div>
    </PdfFrame>
  );
}
