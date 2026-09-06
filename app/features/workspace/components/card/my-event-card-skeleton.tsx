import { cn } from "~/lib/utils";

/**
 * A shimmering stand-in for one line of text. The non-breaking space makes the
 * block inherit the line box of whatever type scale it sits in, so a skeleton
 * built from the real card's markup keeps the real card's height.
 */
function TextLine({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block max-w-full animate-pulse rounded bg-[#EDEFF3] align-middle text-transparent select-none",
        className,
      )}
    >
      &nbsp;
    </span>
  );
}

/**
 * Placeholder for `MyEventCard`. The wrapper markup and every layout class are
 * copied from the card itself — only the content is swapped for shimmer — so
 * the grid does not resize when the real events arrive. The title is drawn at
 * its two-line maximum because the grid rows stretch to the tallest card.
 */
export default function MyEventCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex h-full flex-col overflow-hidden rounded-xl bg-white text-left shadow-[0_1px_3px_rgba(26,26,46,0.06),0_8px_24px_rgba(26,26,46,0.04)]"
    >
      <div className="relative h-32.5 shrink-0 animate-pulse bg-[#EDEFF3]">
        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-[5px] text-[12px] font-bold">
          <span className="size-1.5 animate-pulse rounded-full bg-[#EDEFF3]" />
          <TextLine className="w-13" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2.5 text-[15px] leading-[1.3] font-bold">
          <TextLine className="w-full" />
          <TextLine className="w-1/2" />
        </div>

        <div className="mb-3 flex flex-col gap-1.5 text-[12.5px]">
          <TextLine className="w-28" />
          <TextLine className="w-36" />
          <TextLine className="w-32" />
        </div>

        <div className="mt-auto flex justify-between gap-2 border-t border-[#E5E7EB] pt-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="min-w-0">
              <div className="mb-0.5 text-[11px]">
                <TextLine className="w-12" />
              </div>
              <div className="text-[13px] font-bold">
                <TextLine className="w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
