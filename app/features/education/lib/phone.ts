import { getCountryCallingCode, isSupportedCountry } from "libphonenumber-js";

/** The public profile's phone shape: an ISO country code plus the local part. */
interface ProfilePhone {
  country: string;
  nationalNumber: string;
}

/**
 * An E.164 number for a `tel:` link, or `null` when there isn't a usable one.
 *
 * `PublicProfileResponse.phone.country` is an ISO 3166 code ("KH"), not a
 * dialling code, so it has to be converted rather than concatenated. A number
 * already in E.164 form is passed through — the column stores some that way.
 */
export function toTelHref(
  phone: ProfilePhone | null | undefined,
): string | null {
  if (!phone) return null;

  const national = phone.nationalNumber.replace(/[^\d+]/g, "");
  if (!national) return null;

  // Already E.164 (some rows store the full number in `nationalNumber`).
  if (national.startsWith("+")) return national;

  const iso = phone.country?.toUpperCase();
  if (!iso || !isSupportedCountry(iso)) return null;

  return `+${getCountryCallingCode(iso)}${national.replace(/^0+/, "")}`;
}
