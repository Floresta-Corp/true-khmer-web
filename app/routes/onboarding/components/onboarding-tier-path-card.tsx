import { Landmark, Shield, Star } from "lucide-react";
import { MEMBER_TIERS } from "~/lib/tiers";

const TIERS = [
  {
    icon: Landmark,
    name: MEMBER_TIERS[0].name,
    range: "0-499",
    colorClassName: "text-[#2F6FE4]",
  },
  {
    icon: Shield,
    name: MEMBER_TIERS[1].name,
    range: "500-1,999",
    colorClassName: "text-[#98A2B3]",
  },
  {
    icon: Star,
    name: MEMBER_TIERS[2].name,
    range: "2,000-4,999",
    colorClassName: "text-[#98A2B3]",
  },
] as const;

export function OnboardingTierPathCard() {
  return (
    <div className="w-full rounded-2xl border border-[#ACDCFF] bg-white px-3 py-3.5 sm:px-5 sm:py-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        <p className="text-xs leading-5 font-semibold text-[#65758B]">
          Tiers Path Ahead
        </p>

        <div className="flex items-start justify-between gap-1.5 sm:gap-4">
          {TIERS.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <div key={tier.name} className="contents">
                {/* Columns share the row on small screens and settle at a fixed
                    width from sm up, so the connectors keep their length. */}
                <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center sm:w-25 sm:flex-none">
                  <Icon size={20} className={tier.colorClassName} />
                  <p
                    className={`text-[13px] leading-4.5 font-semibold sm:text-sm sm:leading-5 ${tier.colorClassName}`}
                  >
                    {tier.name}
                  </p>
                  {/* The range stays unbroken; only " pts" is allowed to wrap
                      onto a second line on the narrowest screens. */}
                  <p className="text-[11px] leading-4 font-normal text-[#48566A] sm:text-xs sm:leading-5 sm:whitespace-nowrap">
                    <span className="whitespace-nowrap">{tier.range}</span> pts
                  </p>
                </div>

                {index < TIERS.length - 1 ? (
                  <div className="mt-2 h-0.5 w-2.5 flex-none rounded-full bg-[#F1F5F9] sm:mt-2.5 sm:w-auto sm:min-w-0 sm:flex-1" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
