import { useMemo, useState } from "react";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { sanitizePhoneNumber } from "~/lib/phone";
import { FieldError } from "./field-error";
import { FloatingLabel } from "./text-field";

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const phoneCountryOptions = getCountries()
  .map((country) => {
    const dialCode = `+${getCountryCallingCode(country)}`;
    return {
      country,
      dialCode,
      label: `${regionNames?.of(country) ?? country} ${dialCode}`,
    };
  })
  .sort((first, second) => {
    if (first.country === "KH") return -1;
    if (second.country === "KH") return 1;
    return first.label.localeCompare(second.label);
  });

interface PhoneFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

export function PhoneField({
  id,
  name,
  label,
  placeholder = "Enter number",
  required = false,
  disabled = false,
  error,
  onChange,
}: PhoneFieldProps) {
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("KH");
  const [nationalNumber, setNationalNumber] = useState("");

  const selectedPhoneCountry = useMemo(
    () =>
      phoneCountryOptions.find((option) => option.country === phoneCountry) ?? {
        country: "KH" as CountryCode,
        dialCode: "+855",
        label: "Cambodia +855",
      },
    [phoneCountry],
  );

  // Combined value posted with the form and matching the API phone regex.
  const combinedValue = nationalNumber.trim()
    ? `${selectedPhoneCountry.dialCode} ${nationalNumber.trim()}`
    : "";

  const emitChange = (next: string) => {
    onChange?.(
      next.trim() ? `${selectedPhoneCountry.dialCode} ${next.trim()}` : "",
    );
  };

  return (
    <div className="relative">
      <FloatingLabel htmlFor={id} required={required}>
        {label}
      </FloatingLabel>
      <input type="hidden" name={name} value={combinedValue} />
      <div className="flex h-[46px] overflow-hidden rounded-md outline-1 -outline-offset-1 outline-slate-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600 dark:outline-slate-700">
        <Select
          value={phoneCountry}
          onValueChange={(value) => {
            setPhoneCountry(value as CountryCode);
            onChange?.(
              nationalNumber.trim()
                ? `+${getCountryCallingCode(value as CountryCode)} ${nationalNumber.trim()}`
                : "",
            );
          }}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label="Country calling code"
            className="h-full w-28 rounded-none border-0 border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 shadow-none focus:ring-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <span className="truncate">{selectedPhoneCountry.dialCode}</span>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectGroup>
              {phoneCountryOptions.map((option) => (
                <SelectItem key={option.country} value={option.country}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          id={id}
          inputMode="tel"
          value={nationalNumber}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={(event) => {
            const next = sanitizePhoneNumber(event.target.value);
            setNationalNumber(next);
            emitChange(next);
          }}
          className="h-full flex-1 rounded-none border-0 bg-white px-4 text-sm text-slate-900 shadow-none focus-visible:ring-0 md:px-6 dark:bg-slate-900 dark:text-white"
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}
