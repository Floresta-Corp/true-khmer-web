import { z } from "zod";

/** Same ids as the topic cards and the API's `ContactCategory`. */
export const CONTACT_CATEGORIES = [
  "support",
  "privacy",
  "partnerships",
  "moderation",
] as const;
export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export function isContactCategory(value: unknown): value is ContactCategory {
  return (
    typeof value === "string" &&
    (CONTACT_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Mirrors the API limits so people see problems before submitting. */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 5, max: 150 },
  message: { min: 20, max: 5000 },
} as const;

const singleLine = (label: string, min: number, max: number) =>
  z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(min, `${label} must be at least ${min} characters`)
        .max(max, `${label} must be at most ${max} characters`),
    );

export const contactFormSchema = z.object({
  category: z.enum(CONTACT_CATEGORIES, {
    error: "Choose what your message is about",
  }),
  name: singleLine("Name", CONTACT_LIMITS.name.min, CONTACT_LIMITS.name.max),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(CONTACT_LIMITS.email.max, "Email is too long")
    .pipe(z.email("Enter a valid email address")),
  subject: singleLine(
    "Subject",
    CONTACT_LIMITS.subject.min,
    CONTACT_LIMITS.subject.max,
  ),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.message.min,
      `Message must be at least ${CONTACT_LIMITS.message.min} characters`,
    )
    .max(
      CONTACT_LIMITS.message.max,
      `Message must be at most ${CONTACT_LIMITS.message.max} characters`,
    ),
  /** Honeypot — hidden from people, left empty. */
  website: z.string().optional(),
});

export type ContactFormValues = z.input<typeof contactFormSchema>;
export type ContactFormField = Exclude<keyof ContactFormValues, "website">;
export type ContactFieldErrors = Partial<Record<ContactFormField, string>>;

export function contactFieldErrors(error: z.ZodError): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactFormField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
