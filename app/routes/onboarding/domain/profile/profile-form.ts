export type ParsedProfileFormInput = {
  countryId: string;
  cityId: string;
  bio: string;
  avatarKey: string;
  initialCountryId: string;
  initialCityId: string;
  initialBio: string;
  initialAvatarKey: string;
};

export type ProfileFormErrors = {
  countryId?: string;
  cityId?: string;
  form?: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseProfileForm(formData: FormData): ParsedProfileFormInput {
  return {
    countryId: String(formData.get("countryId") || "").trim(),
    cityId: String(formData.get("cityId") || "").trim(),
    bio: String(formData.get("bio") || "").trim(),
    avatarKey: String(formData.get("avatarKey") || "").trim(),
    initialCountryId: String(formData.get("initialCountryId") || "").trim(),
    initialCityId: String(formData.get("initialCityId") || "").trim(),
    initialBio: String(formData.get("initialBio") || "").trim(),
    initialAvatarKey: String(formData.get("initialAvatarKey") || "").trim(),
  };
}

export function validateProfileInput(input: {
  countryId: string;
  cityId: string;
}) {
  const errors: ProfileFormErrors = {};

  if (!input.countryId) errors.countryId = "Country is required";
  else if (!UUID_REGEX.test(input.countryId))
    errors.countryId = "Invalid country selection";

  if (!input.cityId) errors.cityId = "City is required";
  else if (!UUID_REGEX.test(input.cityId))
    errors.cityId = "Invalid city selection";

  return errors;
}

export function isProfileInputUnchanged(input: ParsedProfileFormInput) {
  return (
    input.initialCountryId === input.countryId &&
    input.initialCityId === input.cityId &&
    input.initialBio === input.bio &&
    input.initialAvatarKey === input.avatarKey
  );
}
