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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-colors ${
        active
          ? "bg-[#EEF3FD] text-[#2F6FE4] font-semibold cursor-default"
          : "text-[#6B7A99] cursor-default"
      }`}
    >
      {active && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-[#2F6FE4]" />
      )}
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
