import { Landmark, Sprout, TrendingDown } from "lucide-react";
import {
  MEMBER_TIERS,
  STARTING_MEMBER_TIER,
  type MemberTier,
} from "~/lib/tiers";

type OnboardingCurrentTierCardProps = {
  tierName?: string;
  tier?: MemberTier;
  nextTierName?: string | null;
  totalPoints?: number;
};

export function OnboardingCurrentTierCard({
  tierName = STARTING_MEMBER_TIER.name,
  tier = STARTING_MEMBER_TIER,
  nextTierName = MEMBER_TIERS[1].name,
  totalPoints = 0,
}: OnboardingCurrentTierCardProps) {
  return (
    <div className="w-full rounded-2xl border border-[#ACDCFF] bg-linear-to-b from-[#32A8FF1A] to-[#82CAFF03] px-4 py-4 sm:py-5">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#D5EDFF] text-[#2F6FE4] sm:size-15">
            <Landmark className="size-6 sm:size-7.5" />
          </div>
          <p className="text-center text-xs leading-5 font-normal text-[#344256]">
            Your Current Tier
          </p>
          <p className="text-center text-xl leading-7 font-bold text-[#2F6FE4] sm:text-2xl sm:leading-9">
            {tierName} Tier
          </p>
          {/* Tier names are Khmer words; the script and meaning make them
              readable to members who don't speak Khmer. */}
          <p className="text-center text-xs leading-5 font-medium text-[#48566A] sm:text-sm">
            {tier.khmerName} · {tier.meaning}
          </p>
        </div>

        <p className="max-w-sm text-center text-xs leading-4 font-normal text-[#111111] sm:text-sm sm:leading-5">
          You are a member of the True Khmer community. Participate, help
          others, and contribute to projects to earn your way
          {nextTierName
            ? ` to the ${nextTierName} tier and beyond`
            : " to the top"}
          .
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex h-6 items-center gap-1 rounded-2xl border border-[#ACDCFF] bg-white px-4 py-1">
            <Sprout size={14} className="text-[#65A30D]" />
            <span className="text-xs leading-4 font-semibold text-[#2F6FE4]">
              {totalPoints} {totalPoints === 1 ? "point" : "points"}
            </span>
          </div>
          <div className="inline-flex h-6 items-center gap-1 rounded-2xl border border-[#ACDCFF] bg-white px-4 py-1">
            <TrendingDown size={14} className="text-[#94A3B8]" />
            <span className="text-xs leading-4 font-semibold text-[#2F6FE4]">
              Rank #--
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
