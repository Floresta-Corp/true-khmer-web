import { Input } from "~/components/ui/input";
import { FieldError } from "./field-error";

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

export function FloatingLabel({
  htmlFor,
  required,
  children,
  className = "",
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`absolute -top-2 left-4 z-10 inline-block rounded-lg bg-white px-1 text-xs font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300 ${className}`}
    >
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
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
