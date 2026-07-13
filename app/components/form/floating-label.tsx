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
