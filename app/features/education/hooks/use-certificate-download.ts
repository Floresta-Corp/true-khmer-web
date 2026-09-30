import { useState } from "react";
import { toast } from "sonner";
import type { PrintedCertificate } from "~/features/education/lib/certificate-pdf.client";

export function useCertificateDownload(certificate: PrintedCertificate | null) {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async () => {
    if (!certificate) return;
    setIsDownloading(true);
    try {
      const { downloadCertificatePdf } =
        await import("~/features/education/lib/certificate-pdf.client");
      await downloadCertificatePdf(certificate);
    } catch (error) {
      toast.error(
        error instanceof Error &&
          error.name === "UnsupportedCertificateTextError"
          ? error.message
          : "Couldn't download your certificate. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
}
