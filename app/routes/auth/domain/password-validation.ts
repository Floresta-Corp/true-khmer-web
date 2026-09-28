export const PASSWORD_REQUIREMENTS = [
  {
    label: "At least one lowercase letter",
    test: (p: string) => /[a-z]/.test(p),
  },
  { label: "Minimum 8 characters", test: (p: string) => p.length >= 8 },
  {
    label: "At least one uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  { label: "At least one number", test: (p: string) => /\d/.test(p) },
  {
    label: "At least one special character",
    test: (p: string) => /[^A-Za-z0-9\s]/.test(p),
  },
  { label: "No spaces", test: (p: string) => p.length > 0 && !/\s/.test(p) },
] as const;

export function getPasswordValidationError(password: string) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (/\s/.test(password)) return "Password must not contain spaces.";
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return "Password must include at least one special character.";
  }

  return undefined;
}
