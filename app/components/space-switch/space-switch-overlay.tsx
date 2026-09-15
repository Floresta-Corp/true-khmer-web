export default function SpaceSwitchLoadingOverlay({
  label,
}: {
  label: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white/75 p-5 supports-backdrop-filter:backdrop-blur-xs"
    >
      <div className="size-12 animate-spin rounded-full border-4 border-[#D5E2FA] border-t-[#1C5DD4] motion-reduce:animation-duration-[2.0s]" />
      <p className="text-lg font-semibold text-[#1A1A2E]">{label}</p>
    </div>
  );
}
