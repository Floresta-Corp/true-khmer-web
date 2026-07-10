import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export interface PhoneCountryOption {
  country: CountryCode;
  dialCode: string;
  label: string;
  countryName: string;
}

export const phoneCountryOptions: PhoneCountryOption[] = getCountries()
  .map((country) => {
    const dialCode = `+${getCountryCallingCode(country)}`;
    const countryName = regionNames?.of(country) ?? country;
    return {
      country,
      dialCode,
      countryName,
      label: `${countryName} ${dialCode}`,
    };
  })
  .sort((first, second) => {
    if (first.country === "KH") return -1;
    if (second.country === "KH") return 1;
    return first.label.localeCompare(second.label);
  });

export const countryOptions = [
  ...phoneCountryOptions.map((option) => ({
    value: option.countryName,
    label: option.countryName,
  })),
  { value: "Other", label: "Other" },
];
