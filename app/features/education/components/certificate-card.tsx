import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Check, Download, Share2 } from "lucide-react";
import { CARD } from "~/features/education/lib/education-styles";
import { CertificateSheet } from "~/features/education/components/certificate-sheet";
import type { ShareCertificateActionResult } from "~/features/education/services/education-certificate.action";
import type { CourseCertificate } from "~/features/education/types";

interface CertificateCardProps {
  certificate: CourseCertificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const fetcher = useFetcher<ShareCertificateActionResult>();
  const settledRef = useRef<ShareCertificateActionResult | null>(null);

  const pendingIntent = fetcher.formData?.get("intent");
  const isSharing = fetcher.state !== "idle";

  const result =
    fetcher.data?.courseId === certificate.courseId ? fetcher.data : null;

  const isShared = pendingIntent
    ? pendingIntent === "share"
    : result?.ok === true
      ? result.sharedToProfile
      : certificate.sharedToProfile;

  useEffect(() => {
    if (fetcher.state !== "idle" || !result) return;
    if (settledRef.current === result) return;

    settledRef.current = result;
    if (result.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }, [fetcher.state, result]);

  return (
    <div
      data-print-region="landscape"
      className={`${CARD} mb-6 p-6 sm:p-10 print:rounded-none print:shadow-none`}
    >
      <CertificateSheet
        recipientName={certificate.recipientName}
        courseTitle={certificate.courseTitle}
        completedOn={certificate.completedOn}
        certificateNo={certificate.certificateNo}
      />

      <div className="mt-6.5 flex flex-col items-center justify-center gap-3 sm:flex-row print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex w-full cursor-pointer items-center justify-center gap-2.25 rounded-lg bg-[#1C5DD4] px-6.5 py-3.25 text-sm font-bold text-white transition-colors hover:bg-[#174FB4] sm:w-auto"
        >
          <Download className="size-4" aria-hidden />
          Download as PDF
        </button>

        <fetcher.Form method="post" className="w-full sm:w-auto">
          <input
            type="hidden"
            name="intent"
            value={isShared ? "unshare" : "share"}
          />
          <button
            type="submit"
            disabled={isSharing}
            title={
              isShared
                ? "Remove this certificate from your profile"
                : "Show this certificate on your profile"
            }
            className="flex w-full cursor-pointer items-center justify-center gap-2.25 rounded-lg border border-[#DDE3EC] px-6.5 py-3.25 text-sm font-bold text-[#1A1A2E] transition-colors hover:bg-[#F4F7FC] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isShared ? (
              <Check className="size-4 text-[#1C5DD4]" aria-hidden />
            ) : (
              <Share2 className="size-4" aria-hidden />
            )}
            {shareLabel({ isSharing, isShared })}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}

function shareLabel({
  isSharing,
  isShared,
}: {
  isSharing: boolean;
  isShared: boolean;
}) {
  if (isSharing) return isShared ? "Sharing…" : "Removing…";
  return isShared ? "On my profile" : "Share to my profile";
}
