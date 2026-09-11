import { useState } from "react";
import { Award, Eye, X } from "lucide-react";
import { Card } from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CertificateSheet } from "~/features/education/components/certificate-sheet";
import type { ProfileCertificate } from "~/features/education/types";
import { formatDate } from "~/lib/time";

const PREVIEW_COUNT = 2;

interface ProfileCertificatesCardProps {
  certificates: ProfileCertificate[];
  isOwner?: boolean;
  recipientName?: string;
}

export function ProfileCertificatesCard({
  certificates,
  isOwner = false,
  recipientName = "",
}: ProfileCertificatesCardProps) {
  const preview = certificates.slice(0, PREVIEW_COUNT);
  const [selected, setSelected] = useState<ProfileCertificate | null>(null);

  return (
    <Dialog>
      <Card className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-none">
        <div className="mb-5 flex items-center justify-between gap-2 border-b pb-3">
          <div className="flex min-w-0 items-center gap-2">
            <Award className="size-4.5 shrink-0 text-indigo-400" />
            <span className="truncate text-base font-semibold tracking-tight text-[#0f172a]">
              {isOwner ? "My Certificates" : "Certificates"}
            </span>
          </div>

          {certificates.length > 0 && (
            <DialogTrigger asChild>
              <button
                type="button"
                className="shrink-0 cursor-pointer text-sm font-bold text-blue-500 transition-colors hover:text-blue-600"
              >
                View all
              </button>
            </DialogTrigger>
          )}
        </div>

        {certificates.length > 0 ? (
          <div className="space-y-3">
            {preview.map((certificate) => (
              <CertificateRow
                key={certificate.id}
                certificate={certificate}
                isOwner={isOwner}
                onSelect={setSelected}
              />
            ))}
          </div>
        ) : (
          <div className="relative flex min-h-30 flex-col items-center justify-center py-2 text-center">
            <Award className="mb-2 h-8 w-6 shrink-0 text-gray-400" />
            <p className="text-sm font-semibold text-gray-400">
              No certificates yet
            </p>
            <p className="pt-2 text-sm text-gray-400">
              {isOwner
                ? "Finish a course, then share its certificate to show it here."
                : "This member has not shared any certificates."}
            </p>
          </div>
        )}
      </Card>

      <DialogContent className="max-h-[86vh] overflow-hidden rounded-3xl border-none p-0 sm:max-w-125 [&>button]:top-6 [&>button]:right-6 [&>button]:text-[#94a3b8]">
        <div className="overflow-y-auto p-5 sm:p-7">
          <DialogHeader className="mb-5">
            <DialogTitle className="pr-10 text-left text-xl font-bold text-[#0f172a]">
              All Certificates
            </DialogTitle>
            <DialogDescription className="sr-only">
              Courses completed on True Khmer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {certificates.map((certificate) => (
              <CertificateRow
                key={certificate.id}
                certificate={certificate}
                isOwner={isOwner}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      </DialogContent>

      <CertificatePreviewDialog
        certificate={selected}
        recipientName={recipientName}
        onClose={() => setSelected(null)}
      />
    </Dialog>
  );
}

function CertificatePreviewDialog({
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

function CertificateRow({
  certificate,
  isOwner,
  onSelect,
}: {
  certificate: ProfileCertificate;
  isOwner: boolean;
  onSelect: (certificate: ProfileCertificate) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(certificate)}
      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-[#e6ebf2] bg-white px-4 py-3 text-left transition-colors hover:border-[#dbe6f7] hover:bg-[#f8fafc]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#eef2f7] bg-white text-[#94a3b8]">
        <Award className="size-5" aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-[#0f172a]">
          {certificate.courseTitle}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold text-[#8a99b5]">
          Completed {formatDate(certificate.completedAt)}
          {isOwner && !certificate.sharedToProfile ? (
            <span className="rounded-full bg-[#eef2f7] px-2 py-0.5 text-[11px] font-bold text-[#64748b]">
              Not on profile
            </span>
          ) : null}
        </span>
      </span>

      <Eye className="size-4 shrink-0 text-[#94a3b8]" aria-hidden />
    </button>
  );
}
