import { Download } from "lucide-react";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseCertificate } from "~/features/education/types";

interface CertificateCardProps {
  certificate: CourseCertificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <div className="mx-auto max-w-205">
      {/* `data-print-region` makes this card the entire printed page when the
          learner uses "Download as PDF" (browser print-to-PDF), and the
          "landscape" value forces the sheet's orientation — see the
          @media print block in app.css. */}
      <div
        data-print-region="landscape"
        className={`${CARD} mb-6 p-6 sm:p-10 print:rounded-none print:shadow-none`}
      >
        {/* On paper the frame becomes the sheet: it takes the page height left
            over after the region's 14mm margin (4mm short of it, so rounding
            can never spill onto a second page) and centres the wording, with
            type sized in points rather than the on-screen pixel scale. */}
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
