import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Check, Download, Share2 } from "lucide-react";
import { CARD } from "~/features/education/lib/education-styles";
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
      <div className="rounded-lg border-2 border-[#1C5DD4] px-6 py-10 text-center sm:px-10 sm:py-12 print:flex print:h-[calc(100vh-32mm)] print:flex-col print:items-center print:justify-center print:px-[16mm]! print:py-0!">
        <img
          src="/logofullcolor.svg"
          alt="True Khmer"
          className="mx-auto mb-6.5 h-8.5 w-auto print:mb-[12mm]! print:h-[15mm]!"
        />
        <p className="mb-5.5 text-[13px] font-bold tracking-[0.18em] text-[#9A9AB0] print:mb-[8mm]! print:text-[12pt]!">
          CERTIFICATE OF COMPLETION
        </p>
        <p className="mb-2.5 text-2xl font-extrabold text-[#1A1A2E] sm:text-[34px] print:mb-[5mm]! print:text-[36pt]!">
          {certificate.recipientName}
        </p>
        <p className="mb-5 text-sm text-[#9A9AB0] print:mb-[6mm]! print:text-[12pt]!">
          has successfully completed
        </p>
        <p className="mb-5.5 text-xl font-bold text-[#1C5DD4] sm:text-2xl print:mb-[10mm]! print:text-[22pt]!">
          {certificate.courseTitle}
        </p>
        <p className="text-sm text-[#9A9AB0] print:text-[11pt]!">
          Completed {certificate.completedOn}
        </p>
        {certificate.certificateNo ? (
          <p className="mt-2.5 text-xs tracking-[0.12em] text-[#C2C2D1] print:mt-[6mm]! print:text-[9pt]!">
            {certificate.certificateNo}
          </p>
        ) : null}
      </div>

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
