import { getCountryCallingCode, isSupportedCountry } from "libphonenumber-js";

interface ProfilePhone {
  country: string;
  nationalNumber: string;
}

export function toTelHref(
  phone: ProfilePhone | null | undefined,
): string | null {
  if (!phone) return null;

  const national = phone.nationalNumber.replace(/[^\d+]/g, "");
  if (!national) return null;

  if (national.startsWith("+")) return national;

  const iso = phone.country?.toUpperCase();
  if (!iso || !isSupportedCountry(iso)) return null;

  return `+${getCountryCallingCode(iso)}${national.replace(/^0+/, "")}`;
}
