import { z } from "zod";

// Mirrors the backend partnerRegistrationSchema so we can give early per-step
// feedback. The API remains the source of truth on final submit.

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().url("Please enter a valid URL").optional(),
);

const optionalNoAt = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .refine((value) => !value.includes("@"), {
      message: "Remove @ symbol from your Telegram username",
    })
    .optional(),
);

const phoneSchema = z
  .string()
  .min(5, "Contact number is required")
  .max(30, "Contact number is too long")
  .refine(
    (value) => /^\+?[0-9\s\-()]+$/.test(value),
    "Please enter a valid phone number",
  );

export const packageSchema = z.enum([
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Government",
  "SME",
  "Video",
  "Free",
]);

export const companyStepSchema = z.object({
  companyName: z.string().min(2, "Company name is required").max(150),
  registrationNumber: z.preprocess(emptyToUndefined, z.string().optional()),
  companyEmail: z.string().email("Please enter a valid email").max(100),
  sectorOfActivity: z.string().min(2, "Sector of activity is required"),
  companyAddress: z.string().min(5, "Address is required").max(200),
  city: z.string().min(2, "City is required").max(100),
  zipCode: z.preprocess(emptyToUndefined, z.string().max(20).optional()),
  country: z.string().min(2, "Country is required"),
  companyContactNumber: phoneSchema,
  website: optionalUrl,
  companyTelegram: optionalNoAt,
  companyFacebookUrl: optionalUrl,
  companyLinkedinUrl: optionalUrl,
});

export const contactStepSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(50),
  lastName: z.string().min(2, "Last name is required").max(50),
  title: z.string().min(2, "Title is required").max(100),
  gender: z.string().min(2, "Gender is required").max(10),
  userEmail: z.string().email("Please enter a valid email").max(100),
  userIdentity: z.preprocess(emptyToUndefined, z.string().max(50).optional()),
  position: z.string().min(2, "Position is required"),
  userContactNumber: phoneSchema,
  userTelegram: optionalNoAt,
  userFacebookUrl: optionalUrl,
  userLinkedinUrl: optionalUrl,
});

// Flatten a ZodError into a field -> message map (first error per field).
export function fieldErrorsFromZod(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
