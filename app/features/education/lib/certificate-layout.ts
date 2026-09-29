import type { CourseCertificateKind } from "~/features/education/types";

const TEMPLATE_DIR = "/images/education/certificate";

export const CERTIFICATE_TEMPLATES = {
  COMPLETION: `${TEMPLATE_DIR}/completion.pdf`,
  PARTICIPATION: `${TEMPLATE_DIR}/participation.pdf`,
} satisfies Record<CourseCertificateKind, string>;

export const CERTIFICATE_SIGNATORY = {
  signatureUrl: `${TEMPLATE_DIR}/signature.png`,
};

export type RGB = readonly [number, number, number];

const hex = (value: string): RGB => [
  parseInt(value.slice(1, 3), 16) / 255,
  parseInt(value.slice(3, 5), 16) / 255,
  parseInt(value.slice(5, 7), 16) / 255,
];

export const CERTIFICATE_COLORS = {
  navy: hex("#233E8B"),
  cyan: hex("#1C95D3"),
  ink: hex("#1A1A1A"),
};

export const CERTIFICATE_SLOTS = {
  certificateNo: { x: 151, y: 535.3, size: 12, color: CERTIFICATE_COLORS.navy },
  recipientName: {
    x: 68.3,
    y: 322,
    size: 34,
    minSize: 18,
    maxWidth: 480,
    color: CERTIFICATE_COLORS.navy,
  },
  courseTitle: {
    x: 69.3,
    y: 250,
    size: 23,
    minSize: 14,
    maxWidth: 400,
    maxLines: 2,
    lineGap: 1.2,
    strokeRatio: 0.025,
    color: CERTIFICATE_COLORS.cyan,
  },
  completedOn: { x: 198, y: 196.7, size: 13, color: CERTIFICATE_COLORS.ink },
  signature: { x: 70, y: 92, width: 120, height: 72 },
  instructorName: {
    x: 71.1,
    y: 78.5,
    size: 11,
    minSize: 8,
    maxWidth: 170,
    color: CERTIFICATE_COLORS.navy,
  },
} as const;
