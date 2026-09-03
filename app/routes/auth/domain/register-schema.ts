import { z } from "zod";
import { getPasswordValidationError } from "./password-validation";

export const REGISTER_GENDERS = ["male", "female", "other"] as const;

export const registerSchema = z
  .object({
    participation: z.enum(["member", "partner"]),
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Must be a valid email")),
    // Kept in one place with the server check so both reject the same passwords.
    password: z.string().superRefine((value, ctx) => {
      const message = getPasswordValidationError(value);
      if (message) ctx.addIssue({ code: "custom", message });
    }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phoneCountry: z.string().min(1, "Country calling code is required"),
    contactNumber: z.string().trim().min(1, "Phone number is required"),
    // A plain string rather than an enum so the empty initial value reports
    // "required" instead of an enum mismatch.
    gender: z.string().superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({ code: "custom", message: "Gender is required" });
        return;
      }

      if (!(REGISTER_GENDERS as readonly string[]).includes(value)) {
        ctx.addIssue({ code: "custom", message: "Gender is invalid" });
      }
    }),
    occupation: z.string().trim().min(1, "Occupation is required"),
    agreeToDirectory: z
      .boolean()
      .refine(
        (value) => value,
        "You must agree to appear on the member directory",
      ),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
