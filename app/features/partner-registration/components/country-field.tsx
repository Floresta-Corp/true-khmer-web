import { useMemo, useState } from "react";

import {
  SingleSelectDropdown,
  type SingleSelectOption,
} from "~/components/ui/single-select-dropdown";
import { countries } from "../data/countries";
import { FieldError } from "./field-error";
import { FloatingLabel } from "./text-field";

// Match the plain text inputs: thin slate border, no shadow/ring.
const triggerClasses =
  "h-[46px] w-full justify-between gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-none ring-0 ring-offset-0 hover:bg-white focus:border-blue-600 focus:ring-0 focus-visible:ring-0 md:px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-900";

const countryOptions: SingleSelectOption[] = countries.map((country) => ({
  value: country.label,
  label: country.label,
}));

interface CountryFieldProps {
  id: string;
  name?: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}

export function CountryField({
  id,
  name = "country",
  label,
  required = false,
  disabled = false,
  error,
  onChange,
}: CountryFieldProps) {
  const [selected, setSelected] = useState("");
  const [customName, setCustomName] = useState("");

  const isOther = selected === "Other";
  const effectiveValue = useMemo(
    () => (isOther ? customName : selected),
    [isOther, customName, selected],
  );

  return (
    <div className="relative">
      <FloatingLabel htmlFor={id} required={required}>
        {label}
      </FloatingLabel>
      <input type="hidden" name={name} value={effectiveValue} />
      <SingleSelectDropdown
        id={id}
        value={selected}
        onValueChange={(value) => {
          setSelected(value);
          const next = value === "Other" ? customName : value;
          onChange?.(next);
        }}
        options={countryOptions}
        placeholder="Select a country"
        searchable
        allowClear
        disabled={disabled}
        triggerClassName={triggerClasses}
        className="ring-0 ring-offset-0 focus-visible:ring-0"
        contentClassName="w-[--radix-dropdown-menu-trigger-width]"
        ariaInvalid={Boolean(error)}
      />
      {isOther && (
        <input
          type="text"
          value={customName}
          onChange={(event) => {
            setCustomName(event.target.value);
            onChange?.(event.target.value);
          }}
          placeholder="Enter your country name"
          disabled={disabled}
          required={required}
          className="mt-2 block w-full rounded-md bg-white px-4 py-3 text-sm text-slate-900 outline-1 -outline-offset-1 outline-slate-300 placeholder:text-slate-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 md:px-6 dark:bg-slate-900 dark:text-white dark:outline-slate-700"
        />
      )}
      <FieldError message={error} />
    </div>
  );
}
