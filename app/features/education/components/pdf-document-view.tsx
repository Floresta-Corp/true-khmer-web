import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFPageProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export function PdfDocumentView({
  src,
  title,
  onReachedEnd,
  onUnavailable,
}: {
  src: string;
  title: string;
  onReachedEnd: () => void;
  onUnavailable: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef<(HTMLCanvasElement | null)[]>([]);
  const [pages, setPages] = useState<PDFPageProxy[] | null>(null);
  const handlers = useRef({ onReachedEnd, onUnavailable });
  handlers.current = { onReachedEnd, onUnavailable };
  useEffect(() => {
    let cancelled = false;

    let task: PDFDocumentLoadingTask | null = null;

    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        task = pdfjs.getDocument({ url: src });
        const doc = await task.promise;
        const all = await Promise.all(
          Array.from({ length: doc.numPages }, (_, index) =>
            doc.getPage(index + 1),
          ),
        );

        if (!cancelled) setPages(all);
      } catch {
        if (!cancelled) handlers.current.onUnavailable();
      }
    })();

    return () => {
      cancelled = true;
      void task?.destroy();
    };
  }, [src]);

  useEffect(() => {
    if (!pages) return;
    let cancelled = false;

    void (async () => {
      try {
        for (const [index, page] of pages.entries()) {
          const canvas = canvasesRef.current[index];
          if (cancelled || !canvas) return;

          await page.render({ canvas, viewport: pageViewport(page) }).promise;
        }
      } catch {
        if (!cancelled) handlers.current.onUnavailable();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pages]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !pages) return;
    const isAtEnd = () =>
      scroller.clientHeight > 0 &&
      scroller.scrollTop + scroller.clientHeight >=
        scroller.scrollHeight - BOTTOM_SLACK_PX;
    if (isAtEnd()) {
      handlers.current.onReachedEnd();
      return;
    }

    const onScroll = () => {
      if (!isAtEnd()) return;
      scroller.removeEventListener("scroll", onScroll);
      handlers.current.onReachedEnd();
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [pages]);

  return (
    <div
      ref={scrollerRef}
      className="h-full overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]"
    >
      {!pages && (
        <p className="flex h-full items-center justify-center text-sm text-[#7A7A8C]">
          Opening document…
        </p>
      )}

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-6">
        {pages?.map((page, index) => {
          const viewport = pageViewport(page);

          return (
            <canvas
              key={page.pageNumber}
              ref={(element) => {
                canvasesRef.current[index] = element;
              }}
              width={Math.floor(viewport.width)}
              height={Math.floor(viewport.height)}
              role="img"
              aria-label={`${title}, page ${page.pageNumber} of ${pages.length}`}
              className="h-auto w-full bg-white shadow-[0_4px_16px_rgba(26,26,46,0.08)]"
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * The width a page is drawn at, which is not the width it is shown at.
 *
 * Pages are drawn once at this size and then scaled by CSS, so the frame
 * changing width — the course sidebar opening, say — costs a repaint rather
 * than redrawing the whole document. The column above is capped well below it,
 * so the picture is only ever shrunk, never stretched, which keeps the text
 * readable without measuring anything.
 */
const PAGE_RENDER_WIDTH_PX = 1024;

/** How close to the end still counts as the end. */
const BOTTOM_SLACK_PX = 24;

function pageViewport(page: PDFPageProxy) {
  const natural = page.getViewport({ scale: 1 });
  return page.getViewport({ scale: PAGE_RENDER_WIDTH_PX / natural.width });
}
