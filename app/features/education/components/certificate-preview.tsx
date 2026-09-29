import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFJS_ASSETS } from "~/features/education/components/pdf-document-view";
import { CERTIFICATE_KIND_COPY } from "~/features/education/components/certificate-sheet";
import type { PrintedCertificate } from "~/features/education/lib/certificate-pdf.client";

const RENDER_WIDTH_PX = 1600;

type PreviewState = "loading" | "ready" | "failed";

export function CertificatePreview({
  certificate,
}: {
  certificate: PrintedCertificate;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<PreviewState>("loading");
  const [error, setError] = useState<string | null>(null);

  // Revalidation (e.g. after sharing) hands back a new object with the same
  // printed fields — only redraw when something on the sheet changes.
  const {
    certificateNo,
    recipientName,
    courseTitle,
    certificateKind,
    completedOn,
    instructorName,
  } = certificate;

  useEffect(() => {
    const printed = {
      certificateNo,
      recipientName,
      courseTitle,
      certificateKind,
      completedOn,
      instructorName,
    };
    let cancelled = false;
    let task: PDFDocumentLoadingTask | null = null;
    let render: RenderTask | null = null;

    setState("loading");

    void (async () => {
      try {
        const [{ buildCertificatePdf }, pdfjs] = await Promise.all([
          import("~/features/education/lib/certificate-pdf.client"),
          import("pdfjs-dist"),
        ]);
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        const bytes = await buildCertificatePdf(printed);
        if (cancelled) return;

        task = pdfjs.getDocument({
          data: bytes,
          standardFontDataUrl: `${PDFJS_ASSETS}/standard_fonts/`,
          wasmUrl: `${PDFJS_ASSETS}/wasm/`,
          iccUrl: `${PDFJS_ASSETS}/iccs/`,
        });
        const doc = await task.promise;
        const page = await doc.getPage(1);

        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;

        const natural = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({
          scale: RENDER_WIDTH_PX / natural.width,
        });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        render = page.render({ canvas, viewport });
        await render.promise;
        if (!cancelled) setState("ready");
      } catch (caught) {
        if (cancelled) return;
        if (
          caught instanceof Error &&
          caught.name === "RenderingCancelledException"
        )
          return;
        setError(
          caught instanceof Error &&
            caught.name === "UnsupportedCertificateTextError"
            ? caught.message
            : "We couldn't draw your certificate. Try reloading the page.",
        );
        setState("failed");
      }
    })();

    return () => {
      cancelled = true;
      render?.cancel();
      void task?.destroy();
    };
  }, [
    certificateNo,
    recipientName,
    courseTitle,
    certificateKind,
    completedOn,
    instructorName,
  ]);

  const copy = CERTIFICATE_KIND_COPY[certificateKind ?? "COMPLETION"];

  return (
    <div className="relative aspect-297/210 w-full overflow-hidden rounded-lg bg-[#F4F7FC] shadow-[0_4px_16px_rgba(26,26,46,0.08)]">
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`size-full transition-opacity duration-300 ${
          state === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      {state === "loading" && (
        <div
          className="absolute inset-0 animate-pulse bg-[#E8EEF7]"
          aria-hidden
        />
      )}

      {state === "failed" && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-semibold text-[#7A7A8C]">
          {error}
        </p>
      )}

      <p className="sr-only">
        {`${copy.heading}. Presented to ${recipientName}, ${copy.verb} ${courseTitle}. ${copy.dateLabel} ${completedOn}. Certificate number ${certificateNo}.`}
      </p>
    </div>
  );
}
