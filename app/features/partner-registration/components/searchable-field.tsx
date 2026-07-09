import {
  SingleSelectDropdown,
  type SingleSelectOption,
} from "~/components/ui/single-select-dropdown";
import { FieldError } from "./field-error";
import { FloatingLabel } from "./text-field";

// Match the plain text inputs: thin slate border, no shadow/ring.
const triggerClasses =
  "h-[46px] w-full justify-between gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-none ring-0 ring-offset-0 hover:bg-white focus:border-blue-600 focus:ring-0 focus-visible:ring-0 md:px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-900";

interface SearchableFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SingleSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function SearchableField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  error,
}: SearchableFieldProps) {
  return (
    <div className="relative">
      <FloatingLabel htmlFor={id} required={required}>
        {label}
      </FloatingLabel>
      <SingleSelectDropdown
        id={id}
        name={name}
        value={value}
        onValueChange={onChange}
        options={options}
        placeholder={placeholder ?? `Select ${label.toLowerCase()}`}
        searchable
        allowClear
        disabled={disabled}
        triggerClassName={triggerClasses}
        className="ring-0 ring-offset-0 focus-visible:ring-0"
        contentClassName="w-[--radix-dropdown-menu-trigger-width]"
        ariaInvalid={Boolean(error)}
      />
      <FieldError message={error} />
    </div>
  );
}
