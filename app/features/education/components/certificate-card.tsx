import { Download } from "lucide-react";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseCertificate } from "~/features/education/types";

interface CertificateCardProps {
  certificate: CourseCertificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <div className="mx-auto max-w-[820px]">
      <div className={`${CARD} mb-6 p-6 sm:p-10`}>
        {/* `print-sheet` is what "Download as PDF" (browser print-to-PDF)
            prints: the framed panel alone, with the page around it — navbar,
            footer, card, button — dropped. See app.css. */}
        <div className="print-sheet rounded-lg border-2 border-[#1C5DD4] px-6 py-10 text-center sm:px-10 sm:py-12">
          <img
            src="/logofullcolor.svg"
            alt="True Khmer"
            className="mx-auto mb-6.5 h-8.5 w-auto"
          />
          <p className="mb-5.5 text-[13px] font-bold tracking-[0.18em] text-[#9A9AB0]">
            CERTIFICATE OF COMPLETION
          </p>
          <p className="mb-2.5 text-2xl font-extrabold text-[#1A1A2E] sm:text-[34px]">
            {certificate.recipientName}
          </p>
          <p className="mb-5 text-sm text-[#9A9AB0]">
            has successfully completed
          </p>
          <p className="mb-5.5 text-xl font-bold text-[#1C5DD4] sm:text-2xl">
            {certificate.courseTitle}
          </p>
          <p className="text-sm text-[#9A9AB0]">
            Completed {certificate.completedOn}
          </p>
        </div>

        <div className="mt-6.5 flex justify-center print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex cursor-pointer items-center gap-2.25 rounded-lg bg-[#1C5DD4] px-6.5 py-3.25 text-sm font-bold text-white transition-colors hover:bg-[#174FB4]"
          >
            <Download className="size-4" aria-hidden />
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
