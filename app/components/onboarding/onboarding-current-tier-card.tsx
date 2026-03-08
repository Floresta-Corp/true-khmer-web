import { Landmark, Sprout, TrendingDown } from "lucide-react";

export function OnboardingCurrentTierCard() {
  return (
    <div className="rounded-2xl border border-[#A6D4FF] bg-linear-to-b from-[#2894FA1A] to-[#2894FA00] px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex w-28 flex-col items-center gap-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#BFDBFE] text-[#2F6FE4]">
            <Landmark size={28} />
          </div>
          <p className="text-center text-xs font-normal leading-5 text-[#475467]">
            Your Current Tier
          </p>
          <p className="text-center text-4xl font-bold leading-9 text-[#2F6FE4]">
            Neary
          </p>
        </div>

        <p className="max-w-sm text-center text-xs font-normal leading-5 text-[#111827] sm:text-sm sm:leading-6">
          You are a citizen of the True Khmer community.
          <br />
          Participate, help others, and contribute to projects to
          <br />
          earn your way to Yothea (Warrior) and beyond.
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex h-6 items-center gap-1 rounded-2xl border border-[#A6D4FF] bg-[#F5F7FA] px-4 py-1">
            <Sprout size={14} className="text-[#65A30D]" />
            <span className="text-xs font-semibold leading-4 text-[#2F6FE4]">
              0 point
            </span>
          </div>
          <div className="inline-flex h-6 items-center gap-1 rounded-2xl border border-[#A6D4FF] bg-[#F5F7FA] px-4 py-1">
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
