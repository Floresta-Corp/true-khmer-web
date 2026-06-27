import type { FormDataVolunteerInput } from "~/features/volunteer/types";
import type { VolunteerPostPage1Errors } from "../components/pages/volunteer-post-page-1";
import type { VolunteerPostPage2Errors } from "../components/pages/volunteer-post-page-2";
import { z } from "zod";
import { isBefore, isValid, parseISO } from "date-fns";

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const VolunteerDateRangeSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
  })
  .superRefine((value, context) => {
    const startDate = parseISO(value.startDate);
    const endDate = parseISO(value.endDate);

    if (!isValid(startDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date must be valid.",
      });
    }

    if (!isValid(endDate)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be valid.",
      });
    }

    if (
      isValid(startDate) &&
      isValid(endDate) &&
      isBefore(endDate, startDate)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be on or after the start date.",
      });
    }
  });

type ValidateDetailMode = "continue" | "submit";

export const validateDetailStep = (
  formData: FormDataVolunteerInput,
  mode: ValidateDetailMode = "submit",
): VolunteerPostPage1Errors => {
  const errors: VolunteerPostPage1Errors = {};

  // Fields required for both continue and submit
  if (!hasText(formData.title)) {
    errors.title = "Opportunity title is required.";
  }
  if (!hasText(formData.categoryId)) {
    errors.categoryId = "Category is required.";
  }
  if (!hasText(formData.locationId)) {
    errors.locationId = "Location is required.";
  }

  const dateRangeResult = VolunteerDateRangeSchema.safeParse({
    startDate: formData.startDate,
    endDate: formData.endDate,
  });
  if (!dateRangeResult.success) {
    errors.dateRange =
      dateRangeResult.error.issues[0]?.message ??
      "Please select a valid date range.";
  }

  // Benefits: require at least one benefit for continue and submit
  if (formData.benefits.length === 0) {
    errors.benefitErrors = ["At least one benefit is required."];
  } else {
    // Validate each benefit item is non-empty (both continue and submit)
    const benefitErrors = formData.benefits.map((benefit) =>
      hasText(benefit) ? "" : "Benefit is required.",
    );
    if (benefitErrors.some((error) => error.length > 0)) {
      errors.benefitErrors = benefitErrors;
    }
  }

  // Require overview and commitmentLabel even for continue flow
  if (!hasText(formData.commitmentLabel)) {
    errors.commitmentLabel = "Commitment is required.";
  }
  if (!hasText(formData.overview)) {
    errors.overview = "Overview is required.";
  }

  if (mode === "submit") {
    if (!hasText(formData.applicationDeadline)) {
      errors.applicationDeadline = "Application deadline is required.";
    }
  }

  // Require cover image for both continue and submit flows so upload shows errors
  if (!formData.coverImageKey?.value) {
    errors.coverImageKey = "Main event cover is required.";
  }
  return errors;
};

export const validateRoleStep = (
  formData: FormDataVolunteerInput,
): VolunteerPostPage2Errors => {
  const errors: VolunteerPostPage2Errors = {};

  const roleErrors = formData.roles.map((role) => {
    const roleError: NonNullable<
      VolunteerPostPage2Errors["roleErrors"]
    >[number] = {};

    if (!hasText(role.title)) {
      roleError.title = "Role title is required.";
    }

    if (!(typeof role.capacity === "number" && role.capacity > 0)) {
      roleError.capacity = "Capacity must be at least 1.";
    }

    const responsibilityErrors = role.responsibilities.map((item) =>
      hasText(item) ? "" : "Responsibility is required.",
    );
    const requirementErrors = role.requirements.map((item) =>
      hasText(item) ? "" : "Requirement is required.",
    );

    if (role.responsibilities.length === 0) {
      roleError.responsibilityErrors = [
        "At least one responsibility is required.",
      ];
    } else if (responsibilityErrors.some((item) => item.length > 0)) {
      roleError.responsibilityErrors = responsibilityErrors;
    }

    if (role.requirements.length === 0) {
      roleError.requirementErrors = ["At least one requirement is required."];
    } else if (requirementErrors.some((item) => item.length > 0)) {
      roleError.requirementErrors = requirementErrors;
    }

    return roleError;
  });

  if (roleErrors.some((roleError) => Object.keys(roleError).length > 0)) {
    errors.roleErrors = roleErrors;
  }

  const contactErrors: NonNullable<VolunteerPostPage2Errors["contact"]> = {};

  if (!hasText(formData.contact.phone)) {
    contactErrors.phone = "Phone number is required.";
  }
  if (!hasText(formData.contact.email)) {
    contactErrors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.contact.email.trim())) {
    contactErrors.email = "Please enter a valid email address.";
  }

  const telegramUsername = formData.contact.telegramUsername as string | null;
  if (
    telegramUsername &&
    hasText(telegramUsername) &&
    !telegramUsername.trim().startsWith("@")
  ) {
    contactErrors.telegramUsername = "Telegram username must start with @.";
  }

  if (Object.keys(contactErrors).length > 0) {
    errors.contact = contactErrors;
  }
  return errors;
};

export const VolunteerApplicationDataSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
  availability: z.string().min(1, "Availability is required"),
  relevantExperience: z.string().min(1, "Relevant experience is required"),
});

export const VolunteerApplicationFilesSchema = z.object({
  files: z
    .array(z.any())
    .min(1, "At least one supporting document is required"),
});

export type VolunteerApplicationDataInput = z.infer<
  typeof VolunteerApplicationDataSchema
>;
export type VolunteerApplicationFilesInput = z.infer<
  typeof VolunteerApplicationFilesSchema
>;

export const validateVolunteerApplicationData = (
  data: unknown,
): Record<string, string> => {
  const result = VolunteerApplicationDataSchema.safeParse(data);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path[0] as string;
    errors[path] = issue.message;
  });
  return errors;
};

const ALLOWED_FILE_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

export const validateVolunteerApplicationFiles = (
  files: unknown[],
): Record<string, string> => {
  if (!files || files.length === 0)
    return { files: "At least one supporting document is required" };

  if (files.length > 3) return { files: "Maximum 3 files can be uploaded" };

  for (const file of files) {
    if (file instanceof File) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { files: "Only PDF files are allowed" };
      }
      if (file.size > MAX_FILE_SIZE) {
        return { files: "Each file must be less than 10MB" };
      }
    }
  }

  return {};
};
