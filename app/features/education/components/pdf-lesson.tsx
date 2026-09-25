import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { cn, getSafeExternalUrl } from "~/lib/utils";
import type { ActiveLesson, LessonGateState } from "~/features/education/types";
import { pdfEmbedUrl } from "~/features/education/lib/lesson-media";
import { PdfDocumentView } from "./pdf-document-view";
import {
  documentLessonGate,
  unavailableLessonGate,
} from "~/features/education/lib/lesson-gate";
import { useReportLessonGate } from "~/features/education/hooks/use-report-lesson-gate";
import {
  MediaBar,
  mediaFrame,
  type LessonMediaProps,
} from "./lesson-media-frame";

export function PdfLesson({
  lesson,
  overlay,
  flush,
  onGateChange,
}: LessonMediaProps) {
  const src = getSafeExternalUrl(lesson.sourceUrl);

  return (
    <div>
      {overlay && <MediaBar>{overlay}</MediaBar>}
      {src ? (
        <RealPdfLesson
          key={src}
          lesson={lesson}
          src={src}
          flush={flush}
          onGateChange={onGateChange}
        />
      ) : (
        <UnavailablePdfLesson flush={flush} onGateChange={onGateChange} />
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
  | { status: "rendered" }
  | { status: "framed" }
  | { status: "blocked"; reason: string };

function isSameOrigin(src: string): boolean {
  try {
    return new URL(src).origin === window.location.origin;
  } catch {
    return true;
  }
}

function fallbackPreview(src: string): PdfPreview {
  if (navigator.pdfViewerEnabled === false) {
    return {
      status: "blocked",
      reason: "Your browser will not open PDFs inside a page.",
    };
  }

  if (isSameOrigin(src)) {
    return {
      status: "blocked",
      reason: "This document is not served from the media host.",
    };
  }

  return { status: "framed" };
}

function RealPdfLesson({
  lesson,
  src,
  flush,
  onGateChange,
}: {
  lesson: ActiveLesson;
  src: string;
  flush?: boolean;
  onGateChange?: (gate: LessonGateState) => void;
}) {
  const [preview, setPreview] = useState<PdfPreview>({ status: "rendered" });
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const onReachedEnd = useCallback(() => setHasReachedEnd(true), []);
  const onUnavailable = useCallback(
    () =>
      setPreview((current) =>
        current.status === "rendered" ? fallbackPreview(src) : current,
      ),
    [src],
  );

  const gate =
    preview.status === "rendered"
      ? documentLessonGate(hasReachedEnd)
      : unavailableLessonGate();

  useReportLessonGate(gate, onGateChange);

  return (
    <PdfFrame flush={flush}>
      {preview.status === "rendered" ? (
        <PdfDocumentView
          src={src}
          title={lesson.title}
          onReachedEnd={onReachedEnd}
          onUnavailable={onUnavailable}
        />
      ) : preview.status === "blocked" ? (
        <PdfDownloadNotice
          src={src}
          title={lesson.title}
          reason={preview.reason}
        />
      ) : (
        <iframe
          src={pdfEmbedUrl(src)}
          title={lesson.title}
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-popups allow-downloads allow-forms"
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
          {reason} Open it to read the lesson — you can continue to the next one
          whenever you are ready.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
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

function UnavailablePdfLesson({
  flush,
  onGateChange,
}: {
  flush?: boolean;
  onGateChange?: (gate: LessonGateState) => void;
}) {
  useReportLessonGate(unavailableLessonGate(), onGateChange);

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
