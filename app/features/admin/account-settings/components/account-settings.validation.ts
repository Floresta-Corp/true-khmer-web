export type FieldErrors = Record<string, string | undefined>;

const NAME_REGEX = /^[\p{L}\p{M}]+(?:[\s'-][\p{L}\p{M}]+)*$/u;
const NO_SPACE_REGEX = /^\S+$/;

export const hasErrors = (errors: FieldErrors): boolean =>
  Object.values(errors).some(Boolean);

function validateName(label: string, value: string): string | undefined {
  if (!value.trim()) return `${label} is required.`;
  if (!NAME_REGEX.test(value)) return `${label} contains invalid characters.`;
  return undefined;
}

function validatePassword(label: string, value: string): string | undefined {
  if (!value) return `${label} is required.`;
  if (value.length < 8) return `${label} must be at least 8 characters.`;
  if (!NO_SPACE_REGEX.test(value)) return `${label} must not contain spaces.`;
  return undefined;
}

export function validateProfile(values: {
  firstName: string;
  lastName: string;
}): FieldErrors {
  return {
    firstName: validateName("First name", values.firstName),
    lastName: validateName("Last name", values.lastName),
  };
}

export function validatePasswordChange(values: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): FieldErrors {
  const errors: FieldErrors = {
    currentPassword: validatePassword("Current password", values.currentPassword),
    newPassword: validatePassword("New password", values.newPassword),
    confirmPassword: validatePassword("Confirm password", values.confirmPassword),
  };
  if (!errors.confirmPassword && values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}
