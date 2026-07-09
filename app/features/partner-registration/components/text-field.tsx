import { FieldError } from "./field-error";

const inputClasses =
  "block w-full rounded-md bg-white px-4 py-3 text-sm text-slate-900 outline-1 -outline-offset-1 outline-slate-300 placeholder:text-slate-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 disabled:opacity-60 md:px-6 dark:bg-slate-900 dark:text-white dark:outline-slate-700";

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
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        className={inputClasses}
      />
      <FieldError message={error} />
    </div>
  );
}
