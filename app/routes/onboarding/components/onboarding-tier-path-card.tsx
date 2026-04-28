import { Landmark, Shield, Star } from "lucide-react";

const TIERS = [
  {
    icon: Landmark,
    name: "Neary",
    range: "0-499 pts",
    colorClassName: "text-[#2F6FE4]",
  },
  {
    icon: Shield,
    name: "Yothea",
    range: "500-1,999 pts",
    colorClassName: "text-[#98A2B3]",
  },
  {
    icon: Star,
    name: "Reach",
    range: "2,000-4,999 pts",
    colorClassName: "text-[#98A2B3]",
  },
] as const;

export function OnboardingTierPathCard() {
  return (
    <div className="w-full rounded-2xl border border-[#ACDCFF] bg-white px-5 py-4">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold leading-5 text-[#65758B]">
          Tiers Path Ahead
        </p>

        <div className="flex items-center justify-between gap-4">
          {TIERS.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <div key={tier.name} className="contents">
                <div className="flex w-14.25 shrink-0 flex-col items-center gap-1 text-center">
                  <Icon size={20} className={tier.colorClassName} />
                  <p
                    className={`text-sm font-semibold leading-5 ${tier.colorClassName}`}
                  >
                    {tier.name}
                  </p>
                  <p className="whitespace-nowrap text-xs font-normal leading-5 text-[#48566A]">
                    {tier.range}
                  </p>
                </div>

                {index < TIERS.length - 1 ? (
                  <div className="h-0.5 min-w-25 flex-1 rounded-full bg-[#F1F5F9]" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
