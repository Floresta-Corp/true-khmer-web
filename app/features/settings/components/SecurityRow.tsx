export function SecurityRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-[#1A2233]">{label}</p>
        <p className="max-w-xs text-sm text-[#6B7A99]">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
