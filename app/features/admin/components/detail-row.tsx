/**
 * Icon + label on the left, value on the right. Meant to be stacked inside a
 * `divide-y` container so a run of rows reads as one metadata table.
 */
export default function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
        <span className="shrink-0">{icon}</span>
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}
