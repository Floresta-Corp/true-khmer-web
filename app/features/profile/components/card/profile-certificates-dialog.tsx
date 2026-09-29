import { useMemo } from "react";
import { Download, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { CertificatePreview } from "~/features/education/components/certificate-preview";
import { useCertificateDownload } from "~/features/education/hooks/use-certificate-download";
import type { ProfileCertificate } from "~/features/education/types";
import { formatDate } from "~/lib/time";

export default function CertificatePreviewDialog({
  certificate,
  recipientName,
  onClose,
}: {
  certificate: ProfileCertificate | null;
  recipientName: string;
  onClose: () => void;
}) {
  const printed = useMemo(
    () =>
      certificate
        ? {
            certificateNo: certificate.certificateNo,
            recipientName: certificate.recipientName || recipientName,
            courseTitle: certificate.courseTitle,
            certificateKind: certificate.certificateKind,
            completedOn: formatDate(certificate.completedAt),
            instructorName: certificate.instructorName,
          }
        : null,
    [certificate, recipientName],
  );

  const { download, isDownloading } = useCertificateDownload(printed);

  return (
    <Dialog
      open={certificate !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="overflow-visible rounded-3xl border-none p-0 sm:max-w-3xl"
      >
        <DialogClose
          aria-label="Close"
          className="absolute -top-12 -right-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#475569] shadow-sm transition-colors hover:bg-white hover:text-[#0f172a]"
        >
          <X className="size-4.5" aria-hidden />
        </DialogClose>

        <DialogHeader className="sr-only">
          <DialogTitle>
            {certificate?.courseTitle ?? "Certificate"} certificate
          </DialogTitle>
          <DialogDescription>
            Certificate earned on True Khmer
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[85vh] overflow-y-auto rounded-3xl bg-background p-4 sm:p-6">
          {printed ? (
            <>
              <CertificatePreview certificate={printed} />

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={download}
                  disabled={isDownloading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2.25 rounded-lg bg-[#1C5DD4] px-6.5 py-3.25 text-sm font-bold text-white transition-colors hover:bg-[#174FB4] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isDownloading ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Download className="size-4" aria-hidden />
                  )}
                  {isDownloading ? "Preparing PDF…" : "Download as PDF"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
