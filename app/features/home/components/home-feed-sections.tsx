import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { HomeCarouselSection } from "./home-carousel-section";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import { OpportunityCard } from "~/components/opportunity-card";
import {
  EventCard,
  type EventData,
} from "~/features/events/components/event-card";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";

function Slide({
  width,
  children,
}: {
  width: string;
  children: React.ReactNode;
}) {
  return <div className={`${width} shrink-0 snap-start`}>{children}</div>;
}

function SeeMoreTile({ to }: { to: string }) {
  return (
    <Slide width="w-[320px] sm:w-[384px]">
      <Link
        to={to}
        className="flex h-full min-h-95 flex-col items-center justify-center gap-4 rounded-2xl border border-[#e1e7ef] bg-[#f8fafc] text-center transition-colors hover:border-[#2f6fe4] hover:bg-[#f1f5f9]"
      >
        <span className="flex size-13 items-center justify-center rounded-full bg-[#1c5dd4] text-white">
          <ArrowRight className="size-5" />
        </span>
        <span className="text-sm font-semibold text-[#344256]">See more</span>
      </Link>
    </Slide>
  );
}

export function LaunchpadFeed({ items }: { items: LaunchpadOpportunity[] }) {
  const navigate = useNavigate();
  if (items.length === 0) return null;

  return (
    <HomeCarouselSection
      title="Launchpad"
      trailing={<SeeMoreTile to="/launchpad/all" />}
    >
      {items.map((item) => (
        <Slide key={item.id} width="w-[320px] sm:w-[384px]">
          <LaunchpadProjectCard
            item={item}
            onOpenOpportunity={(opportunity) =>
              navigate(`/launchpad/detail/${opportunity.id}`)
            }
          />
        </Slide>
      ))}
    </HomeCarouselSection>
  );
}

export function VolunteerFeed({ items }: { items: Opportunity[] }) {
  if (items.length === 0) return null;

  return (
    <HomeCarouselSection title="Volunteers">
      {items.map((opportunity) => (
        <Slide key={opportunity.id} width="w-[320px] sm:w-[384px]">
          <OpportunityCard opportunity={opportunity} />
        </Slide>
      ))}
    </HomeCarouselSection>
  );
}
