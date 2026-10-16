import { z } from "zod";
import { VISIBILITY_OPTIONS } from "~/features/myspace/components/visibility-setting-card";

export const EDIT_PROFILE_GENDERS = ["male", "female", "other"] as const;
export const BIO_MAX_LENGTH = 1000;
export const SKILL_MAX_LENGTH = 50;
export const SKILLS_MAX_COUNT = 30;

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function hostMatches(value: string, domains: readonly string[]) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return domains.some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

// Social links are optional, so an empty string is valid; anything typed has
// to be a full http(s) URL, and the network-specific ones on that network.
function optionalUrl(label: string, domains?: readonly string[]) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) return;

      if (!isHttpUrl(value)) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be a valid URL starting with https://`,
        });
        return;
      }

      if (domains && !hostMatches(value, domains)) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be a ${domains[0]} link`,
        });
      }
    });
}

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or fewer"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or fewer"),
  // A plain string rather than an enum so the empty value reports "required"
  // instead of an enum mismatch.
  gender: z.string().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: "custom", message: "Gender is required" });
      return;
    }

    if (!(EDIT_PROFILE_GENDERS as readonly string[]).includes(value)) {
      ctx.addIssue({ code: "custom", message: "Gender is invalid" });
    }
  }),
  dateOfBirth: z.string().superRefine((value, ctx) => {
    if (!value) return;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: "custom", message: "Date of birth is invalid" });
      return;
    }

    if (date > new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Date of birth cannot be in the future",
      });
      return;
    }

    if (date.getFullYear() < 1900) {
      ctx.addIssue({ code: "custom", message: "Date of birth is invalid" });
    }
  }),
  occupation: z
    .string()
    .trim()
    .max(100, "Occupation must be 100 characters or fewer"),
  phoneCountry: z.string().min(1, "Country calling code is required"),
  phoneNationalNumber: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) return;

      if (!/^[\d\s-]+$/.test(value)) {
        ctx.addIssue({
          code: "custom",
          message: "Phone number can only contain digits",
        });
        return;
      }

      const digits = value.replace(/\D/g, "").length;
      if (digits < 6 || digits > 15) {
        ctx.addIssue({
          code: "custom",
          message: "Phone number must be 6 to 15 digits",
        });
      }
    }),
  // Telegram's own rule: 5-32 characters of letters, digits and underscores.
  // A leading "@" is tolerated since the field already shows one.
  telegramUsername: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^@?[A-Za-z0-9_]{5,32}$/.test(value),
      "Telegram username must be 5-32 letters, numbers or underscores",
    ),
  bio: z
    .string()
    .max(BIO_MAX_LENGTH, `Bio must be ${BIO_MAX_LENGTH} characters or fewer`),
  countryId: z.string(),
  cityId: z.string(),
  avatarKey: z.string(),
  skills: z
    .array(
      z
        .string()
        .max(
          SKILL_MAX_LENGTH,
          `Each skill must be ${SKILL_MAX_LENGTH} characters or fewer`,
        ),
    )
    .max(SKILLS_MAX_COUNT, `You can add up to ${SKILLS_MAX_COUNT} skills`),
  website: optionalUrl("Website"),
  linkedin: optionalUrl("LinkedIn", ["linkedin.com"]),
  twitter: optionalUrl("Twitter", ["x.com", "twitter.com"]),
  facebook: optionalUrl("Facebook", ["facebook.com", "fb.com"]),
  profileVisibility: z.enum(VISIBILITY_OPTIONS),
  contactVisibility: z.enum(VISIBILITY_OPTIONS),
  socialLinksVisibility: z.enum(VISIBILITY_OPTIONS),
  contributionsVisibility: z.enum(VISIBILITY_OPTIONS),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type EditProfileField = keyof EditProfileFormData;

export const EDIT_PROFILE_FIELD_LABELS: Record<EditProfileField, string> = {
  firstName: "First name",
  lastName: "Last name",
  gender: "Gender",
  dateOfBirth: "Date of birth",
  occupation: "Occupation",
  phoneCountry: "Contact number",
  phoneNationalNumber: "Contact number",
  telegramUsername: "Telegram username",
  bio: "Bio",
  countryId: "Country",
  cityId: "City",
  avatarKey: "Profile picture",
  skills: "Skills",
  website: "Website",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  facebook: "Facebook",
  profileVisibility: "Profile visibility",
  contactVisibility: "Contact visibility",
  socialLinksVisibility: "Social links visibility",
  contributionsVisibility: "Contributions visibility",
};

function isSameValue(a: unknown, b: unknown) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => item === b[index]);
  }

  return a === b;
}

// Compared against the server baseline rather than relying on react-hook-form's
// dirty state alone, so the same result can drive both the UI and the draft.
export function getChangedFields(
  values: Partial<EditProfileFormData>,
  baseline: EditProfileFormData,
): EditProfileField[] {
  return (Object.keys(baseline) as EditProfileField[]).filter(
    (field) => field in values && !isSameValue(values[field], baseline[field]),
  );
}

export function pickFields(
  values: Partial<EditProfileFormData>,
  fields: EditProfileField[],
): Partial<EditProfileFormData> {
  return Object.fromEntries(
    fields.map((field) => [field, values[field]]),
  ) as Partial<EditProfileFormData>;
}
