export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mt-1.5 pl-1">
      <span className="text-xs text-rose-600 dark:text-rose-400">
        {message}
      </span>
    </div>
  );
}
