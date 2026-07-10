import { useMemo, useState } from "react";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { sanitizePhoneNumber } from "~/lib/phone";
import { cn } from "~/lib/utils";
import { FieldError } from "./field-error";
import { FloatingLabel } from "./floating-label";
import { phoneCountryOptions } from "./phone-country-options";

interface PhoneFieldProps {
  id: string;
  name: string;
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  fieldClassName?: string;
  wrapperClassName?: string;
  triggerClassName?: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
}

function parsePhoneValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { country: "KH" as CountryCode, nationalNumber: "" };

  const match = trimmed.match(/^\+(\d+)\s*(.*)$/);
  if (!match) {
    return { country: "KH" as CountryCode, nationalNumber: sanitizePhoneNumber(trimmed) };
  }

  const option = phoneCountryOptions.find(
    (phoneCountry) => phoneCountry.dialCode === `+${match[1]}`,
  );

  return {
    country: option?.country ?? ("KH" as CountryCode),
    nationalNumber: sanitizePhoneNumber(match[2] ?? ""),
  };
}

export function PhoneField({
  id,
  name,
  label,
  value,
  defaultValue = "",
  placeholder = "Enter number",
  required = false,
  disabled = false,
  error,
  fieldClassName,
  wrapperClassName,
  triggerClassName,
  inputClassName,
  onChange,
}: PhoneFieldProps) {
  const initial = useMemo(
    () => parsePhoneValue(value ?? defaultValue),
    [defaultValue, value],
  );
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(initial.country);
  const [nationalNumber, setNationalNumber] = useState(initial.nationalNumber);

  const effectivePhoneCountry = phoneCountry;
  const effectiveNationalNumber =
    value === undefined ? nationalNumber : initial.nationalNumber;

  const selectedPhoneCountry = useMemo(
    () =>
      phoneCountryOptions.find(
        (option) => option.country === effectivePhoneCountry,
      ) ?? {
        country: "KH" as CountryCode,
        dialCode: "+855",
        label: "Cambodia +855",
      },
    [effectivePhoneCountry],
  );

  const combinedValue = effectiveNationalNumber.trim()
    ? `${selectedPhoneCountry.dialCode} ${effectiveNationalNumber.trim()}`
    : "";

  return (
    <div className={cn("relative", fieldClassName)}>
      <FloatingLabel htmlFor={id} required={required}>
        {label}
      </FloatingLabel>
      <input type="hidden" name={name} value={combinedValue} />
      <div
        className={cn(
          "flex h-[46px] overflow-hidden rounded-md outline-1 -outline-offset-1 outline-slate-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600 dark:outline-slate-700",
          wrapperClassName,
        )}
      >
        <Select
          value={effectivePhoneCountry}
          onValueChange={(nextCountry) => {
            const typedCountry = nextCountry as CountryCode;
            const nextDialCode = `+${getCountryCallingCode(typedCountry)}`;
            setPhoneCountry(typedCountry);
            onChange?.(
              effectiveNationalNumber.trim()
                ? `${nextDialCode} ${effectiveNationalNumber.trim()}`
                : "",
            );
          }}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label="Country calling code"
            className={cn(
              "h-full w-28 rounded-none border-0 border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 shadow-none focus:ring-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
              triggerClassName,
            )}
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
          value={effectiveNationalNumber}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={(event) => {
            const nextNationalNumber = sanitizePhoneNumber(event.target.value);
            setNationalNumber(nextNationalNumber);
            onChange?.(
              nextNationalNumber.trim()
                ? `${selectedPhoneCountry.dialCode} ${nextNationalNumber.trim()}`
                : "",
            );
          }}
          className={cn(
            "h-full flex-1 rounded-none border-0 bg-white px-4 text-sm text-slate-900 shadow-none focus-visible:ring-0 md:px-6 dark:bg-slate-900 dark:text-white",
            inputClassName,
          )}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}
