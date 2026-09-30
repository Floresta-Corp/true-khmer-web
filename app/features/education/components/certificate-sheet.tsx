import type { CourseCertificateKind } from "~/features/education/types";

export const CERTIFICATE_KIND_COPY = {
  PARTICIPATION: {
    heading: "CERTIFICATE OF PARTICIPATION",
    verb: "has participated in",
    dateLabel: "Awarded",
  },
  COMPLETION: {
    heading: "CERTIFICATE OF COMPLETION",
    verb: "has successfully completed",
    dateLabel: "Completed",
  },
} satisfies Record<
  CourseCertificateKind,
  { heading: string; verb: string; dateLabel: string }
>;
