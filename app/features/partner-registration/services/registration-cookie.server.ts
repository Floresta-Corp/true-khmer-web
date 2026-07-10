import type { PartnerRegistrationRequest } from "~/types/api-client";

const COOKIE_NAME = "partnerFormData";

export type CompanyRegistrationData = Pick<
  PartnerRegistrationRequest,
  | "companyName"
  | "companyEmail"
  | "sectorOfActivity"
  | "companyAddress"
  | "city"
  | "country"
  | "companyContactNumber"
> &
  Partial<
    Pick<
      PartnerRegistrationRequest,
      | "registrationNumber"
      | "zipCode"
      | "website"
      | "companyTelegram"
      | "companyFacebookUrl"
      | "companyLinkedinUrl"
      | "package"
    >
  >;

// Read + parse the multi-step registration cookie. Returns null if absent/invalid.
export function readPartnerCookie(
  request: Request,
): Partial<CompanyRegistrationData> | null {
  const cookies = request.headers.get("Cookie") ?? "";
  const match = cookies.match(/partnerFormData=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

// Serialize the registration cookie (HttpOnly, 1h) for a Set-Cookie header.
export function setPartnerCookie(
  data: Partial<CompanyRegistrationData>,
): string {
  const value = encodeURIComponent(JSON.stringify(data));
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
}

export function clearPartnerCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
