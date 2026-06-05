import { Landmark, Sprout, TrendingDown } from "lucide-react";

export function OnboardingCurrentTierCard() {
  return (
    <div className="w-full rounded-2xl border border-[#ACDCFF] bg-linear-to-b from-[#32A8FF1A] to-[#82CAFF03] px-4 py-4 sm:py-5">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#D5EDFF] text-[#2F6FE4] sm:size-15">
            <Landmark className="size-6 sm:size-7.5" />
          </div>
          <p className="text-center text-xs font-normal leading-5 text-[#344256]">
            Your Current Tier
          </p>
          <p className="text-center text-xl font-bold leading-7 text-[#2F6FE4] sm:text-2xl sm:leading-9">
            Neary
          </p>
        </div>

        <p className="max-w-sm text-center text-xs font-normal leading-4 text-[#111111] sm:text-sm sm:leading-5">
          You are a citizen of the True Khmer community. Participate, help
          others, and contribute to projects to earn your way to Yothea
          (Warrior) and beyond.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex h-6 items-center gap-1 rounded-2xl border border-[#ACDCFF] bg-white px-4 py-1">
            <Sprout size={14} className="text-[#65A30D]" />
            <span className="text-xs font-semibold leading-4 text-[#2F6FE4]">
              0 point
            </span>
          </div>
          <div className="inline-flex h-6 items-center gap-1 rounded-2xl border border-[#ACDCFF] bg-white px-4 py-1">
            <TrendingDown size={14} className="text-[#94A3B8]" />
            <span className="text-xs font-semibold leading-4 text-[#2F6FE4]">
              Rank #--
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
