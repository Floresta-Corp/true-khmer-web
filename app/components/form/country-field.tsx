import { useMemo, useState } from "react";

import {
  SingleSelectDropdown,
  type SingleSelectOption,
} from "~/components/ui/single-select-dropdown";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { FieldError } from "./field-error";
import { FloatingLabel } from "./floating-label";
import { countryOptions } from "./phone-country-options";

const defaultTriggerClasses =
  "h-[46px] w-full justify-between gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-none ring-0 ring-offset-0 hover:bg-white focus:border-blue-600 focus:ring-0 focus-visible:ring-0 md:px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-900";

const selectCountryOptions: SingleSelectOption[] = countryOptions;

interface CountryFieldProps {
  id: string;
  name?: string;
  label: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  otherPlaceholder?: string;
  fieldClassName?: string;
  triggerClassName?: string;
  inputClassName?: string;
  contentClassName?: string;
  onChange?: (value: string) => void;
}

function resolveInitialSelection(value: string) {
  if (!value) return { selected: "", customName: "" };
  const option = selectCountryOptions.find(
    (country) => country.value === value,
  );
  return option
    ? { selected: option.value, customName: "" }
    : { selected: "Other", customName: value };
}

export function CountryField({
  id,
  name = "country",
  label,
  value,
  defaultValue = "",
  required = false,
  disabled = false,
  error,
  placeholder = "Select a country",
  otherPlaceholder = "Enter your country name",
  fieldClassName,
  triggerClassName,
  inputClassName,
  contentClassName,
  onChange,
}: CountryFieldProps) {
  const initial = useMemo(
    () => resolveInitialSelection(value ?? defaultValue),
    [defaultValue, value],
  );
  const [selected, setSelected] = useState(initial.selected);
  const [customName, setCustomName] = useState(initial.customName);

  const effectiveSelected = selected;
  const effectiveCustomName = customName;
  const isOther = effectiveSelected === "Other";
  const effectiveValue = isOther ? effectiveCustomName : effectiveSelected;

  return (
    <div className={cn("relative", fieldClassName)}>
      <FloatingLabel htmlFor={id} required={required}>
        {label}
      </FloatingLabel>
      <input type="hidden" name={name} value={effectiveValue} />
      <SingleSelectDropdown
        id={id}
        value={effectiveSelected}
        onValueChange={(nextSelected) => {
          setSelected(nextSelected);
          const next = nextSelected === "Other" ? customName : nextSelected;
          onChange?.(next);
        }}
        options={selectCountryOptions}
        placeholder={placeholder}
        searchable
        allowClear
        disabled={disabled}
        triggerClassName={cn(defaultTriggerClasses, triggerClassName)}
        className="ring-0 ring-offset-0 focus-visible:ring-0"
        contentClassName={cn(
          "w-[--radix-dropdown-menu-trigger-width]",
          contentClassName,
        )}
        ariaInvalid={Boolean(error)}
      />
      {isOther && (
        <Input
          type="text"
          value={effectiveCustomName}
          onChange={(event) => {
            setCustomName(event.target.value);
            onChange?.(event.target.value);
          }}
          placeholder={otherPlaceholder}
          disabled={disabled}
          required={required}
          className={cn(
            "mt-2 h-[46px] rounded-md border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-none ring-0 placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-0 md:px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
            inputClassName,
          )}
        />
      )}
      <FieldError message={error} />
    </div>
  );
}
