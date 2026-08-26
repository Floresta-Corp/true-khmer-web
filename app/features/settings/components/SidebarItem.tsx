export function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        active
          ? "cursor-default bg-[#EEF3FD] font-semibold text-[#2F6FE4]"
          : "cursor-default text-[#6B7A99]"
      }`}
    >
      {active && (
        <span className="absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-l-full bg-[#2F6FE4]" />
      )}
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
