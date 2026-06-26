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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-[#1A2233]">{label}</p>
        <p className="text-sm text-[#6B7A99] max-w-xs">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
