import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
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
  const [pages, setPages] = useState<PDFPageProxy[] | null>(null);

  const handlers = useRef({ onReachedEnd, onUnavailable });
  useEffect(() => {
    handlers.current = { onReachedEnd, onUnavailable };
  });

  const reportUnavailable = useCallback(
    () => handlers.current.onUnavailable(),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    let task: PDFDocumentLoadingTask | null = null;

    setPages(null);

    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        task = pdfjs.getDocument({
          url: src,
          cMapUrl: `${PDFJS_ASSETS}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `${PDFJS_ASSETS}/standard_fonts/`,
          wasmUrl: `${PDFJS_ASSETS}/wasm/`,
          iccUrl: `${PDFJS_ASSETS}/iccs/`,
        });
        const doc = await task.promise;

        if (doc.numPages < 1) throw new Error("The document has no pages.");

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
      role="region"
      aria-label={`${title}, document viewer`}
      tabIndex={0}
      className="h-full overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1C5DD4]"
    >
      {!pages && (
        <p className="flex h-full items-center justify-center text-sm text-[#7A7A8C]">
          Opening document…
        </p>
      )}

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-6">
        {pages?.map((page) => (
          <PdfPage
            key={page.pageNumber}
            page={page}
            pageCount={pages.length}
            scrollerRef={scrollerRef}
            onUnavailable={reportUnavailable}
          />
        ))}
      </div>
    </div>
  );
}

function PdfPage({
  page,
  pageCount,
  scrollerRef,
  onUnavailable,
}: {
  page: PDFPageProxy;
  pageCount: number;
  scrollerRef: RefObject<HTMLDivElement | null>;
  onUnavailable: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isNearView, setIsNearView] = useState(false);
  const [text, setText] = useState("");
  const viewport = useMemo(() => pageViewport(page), [page]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scroller = scrollerRef.current;
    if (!canvas || !scroller) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearView(entry.isIntersecting),
      { root: scroller, rootMargin: `${DRAW_AHEAD_PX}px 0px` },
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [scrollerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!isNearView) {
      canvas.width = 0;
      canvas.height = 0;
      return;
    }

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const task = page.render({ canvas, viewport });
    void task.promise.catch((error: unknown) => {
      if (error instanceof Error && error.name === CANCELLED) return;
      onUnavailable();
    });

    return () => task.cancel();
  }, [isNearView, page, viewport, onUnavailable]);

  useEffect(() => {
    let cancelled = false;

    void page.getTextContent().then(
      (content) => {
        if (cancelled) return;

        setText(
          content.items
            .map((item) =>
              "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "",
            )
            .join(""),
        );
      },
      () => {},
    );

    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ aspectRatio: `${viewport.width} / ${viewport.height}` }}
        className="h-auto w-full bg-white shadow-[0_4px_16px_rgba(26,26,46,0.08)]"
      />
      <p className="sr-only">{`Page ${page.pageNumber} of ${pageCount}. ${text}`}</p>
    </div>
  );
}

const PAGE_RENDER_WIDTH_PX = 1024;

const BOTTOM_SLACK_PX = 24;

const PDFJS_ASSETS = "/pdfjs";

const DRAW_AHEAD_PX = 800;

const CANCELLED = "RenderingCancelledException";

function pageViewport(page: PDFPageProxy) {
  const natural = page.getViewport({ scale: 1 });
  return page.getViewport({ scale: PAGE_RENDER_WIDTH_PX / natural.width });
}
