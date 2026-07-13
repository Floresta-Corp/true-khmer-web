import { Input } from "~/components/ui/input";
import { FloatingLabel } from "~/components/form/floating-label";
import { FieldError } from "~/components/form/field-error";

const inputClasses =
  "h-[46px] rounded-md border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-none ring-0 placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:ring-0 md:px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  error,
}: TextFieldProps) {
  return (
    <div className="relative">
      <FloatingLabel htmlFor={id} required={required}>
        {label}
      </FloatingLabel>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={inputClasses}
      />
      <FieldError message={error} />
    </div>
  );
}
