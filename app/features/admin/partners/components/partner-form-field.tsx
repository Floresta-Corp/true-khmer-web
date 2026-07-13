import type { ComponentProps, ReactNode } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

const fieldControlClass =
  "h-11 rounded-xl px-4 text-base shadow-none md:text-sm";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  required,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </Label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}

type TextFieldProps = Omit<ComponentProps<typeof Input>, "id"> & {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  fieldClassName?: string;
};

export function PartnerTextField({
  id,
  label,
  required,
  error,
  fieldClassName,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      className={fieldClassName}
    >
      <Input
        id={id}
        required={required}
        className={cn(fieldControlClass, className)}
        aria-invalid={props["aria-invalid"] ?? Boolean(error)}
        {...props}
      />
    </FormField>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface PartnerSelectFieldProps {
  id: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  fieldClassName?: string;
  triggerClassName?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export function PartnerSelectField({
  id,
  label,
  options,
  required,
  error,
  fieldClassName,
  triggerClassName,
  name,
  value,
  defaultValue,
  placeholder,
  disabled,
  onValueChange,
}: PartnerSelectFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      className={fieldClassName}
    >
      <Select
        name={name}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onValueChange={onValueChange}
      >
        <SelectTrigger
          id={id}
          className={cn(
            "w-full",
            fieldControlClass,
            error &&
              "border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
            triggerClassName,
          )}
          aria-invalid={Boolean(error)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

export function FormSectionHeading({
  title,
  accent = "blue",
}: {
  title: string;
  accent?: "blue" | "slate";
}) {
  return (
    <div
      className={`mb-4 border-l-4 pl-3 sm:pl-4 ${
        accent === "blue"
          ? "border-blue-600"
          : "border-slate-300 dark:border-slate-600"
      }`}
    >
      <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
        {title}
      </h3>
    </div>
  );
}
