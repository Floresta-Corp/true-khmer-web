import type { FormDataVolunteerInput } from "~/services/volunteer/types";
import type { VolunteerPostPage1Errors } from "../page/volunteer-post-page-1";
import type { VolunteerPostPage2Errors } from "../page/volunteer-post-page-2";

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const validateDetailStep = (
  formData: FormDataVolunteerInput,
): VolunteerPostPage1Errors => {
  const errors: VolunteerPostPage1Errors = {};

  if (!hasText(formData.title)) {
    errors.title = "Opportunity title is required.";
  }
  if (!hasText(formData.categoryId)) {
    errors.categoryId = "Category is required.";
  }
  if (!hasText(formData.locationId)) {
    errors.locationId = "Location is required.";
  }
  if (!hasText(formData.durationLabel)) {
    errors.durationLabel = "Duration is required.";
  }
  if (!hasText(formData.commitmentLabel)) {
    errors.commitmentLabel = "Commitment is required.";
  }
  if (!hasText(formData.applicationDeadline)) {
    errors.applicationDeadline = "Application deadline is required.";
  }
  if (!formData.coverImageKey?.value) {
    errors.coverImageKey = "Main event cover is required.";
  }
  if (!hasText(formData.overview)) {
    errors.overview = "Overview is required.";
  }

  if (formData.benefits.length === 0) {
    errors.benefitErrors = ["At least one benefit is required."];
  } else {
    const benefitErrors = formData.benefits.map((benefit) =>
      hasText(benefit) ? "" : "Benefit is required.",
    );
    if (benefitErrors.some((error) => error.length > 0)) {
      errors.benefitErrors = benefitErrors;
    }
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
    if (!hasText(role.commitmentLabel)) {
      roleError.commitmentLabel = "Commitment is required.";
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
