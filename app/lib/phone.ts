export function sanitizePhoneNumber(value: string): string {
  return value.replace(/\D/g, "");
}
