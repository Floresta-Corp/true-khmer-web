import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { CertificateSheet } from "~/features/education/components/certificate-sheet";
import type { ProfileCertificate } from "~/features/education/types";
import { formatDate } from "~/features/events/lib/event-formatters";

export default function CertificatePreviewDialog({
  certificate,
  recipientName,
  onClose,
}: {
  certificate: ProfileCertificate | null;
  recipientName: string;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={certificate !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="overflow-visible rounded-3xl border-none p-0 sm:max-w-175"
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
            Certificate of completion earned on True Khmer
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto rounded-3xl bg-background p-5 sm:p-8">
          {certificate ? (
            <CertificateSheet
              recipientName={recipientName}
              courseTitle={certificate.courseTitle}
              completedOn={formatDate(certificate.completedAt)}
              certificateNo={certificate.certificateNo}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
