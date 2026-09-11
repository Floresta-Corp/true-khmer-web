interface CertificateSheetProps {
  recipientName: string;
  courseTitle: string;
  completedOn: string;
  certificateNo?: string;
}

export function CertificateSheet({
  recipientName,
  courseTitle,
  completedOn,
  certificateNo,
}: CertificateSheetProps) {
  return (
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
        {recipientName}
      </p>
      <p className="mb-5 text-sm text-[#9A9AB0] print:mb-[6mm]! print:text-[12pt]!">
        has successfully completed
      </p>
      <p className="mb-5.5 text-xl font-bold text-[#1C5DD4] sm:text-2xl print:mb-[10mm]! print:text-[22pt]!">
        {courseTitle}
      </p>
      <p className="text-sm text-[#9A9AB0] print:text-[11pt]!">
        Completed {completedOn}
      </p>
      {certificateNo ? (
        <p className="mt-2.5 text-xs tracking-[0.12em] text-[#C2C2D1] print:mt-[6mm]! print:text-[9pt]!">
          {certificateNo}
        </p>
      ) : null}
    </div>
  );
}
