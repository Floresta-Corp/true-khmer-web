import { Info } from "lucide-react";

/**
 * The 14px help icon each Analytics card carries, with the design's 220px
 * popover on hover and focus.
 */
export function CardInfo({ text }: { text: string }) {
  return (
    <span className="group/info relative flex cursor-help text-[#9A9AB0]">
      <Info size={14} strokeWidth={2} aria-hidden />
      <span className="sr-only">{text}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute top-5 left-0 z-10 w-[220px] rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs leading-normal text-[#333333] opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-opacity group-hover/info:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
