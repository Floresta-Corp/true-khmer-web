import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { HomeCarouselSection } from "./home-carousel-section";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import { OpportunityCard } from "~/components/opportunity-card";
import {
  EventCard,
  type EventData,
} from "~/features/events/components/event-card";
import { HomeDiscussionCard } from "./home-discussion-card";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import type { QuestionResponse } from "~/types/api-client";

// Cards fill the row so an exact number show per view (rest revealed by
// scrolling). Widths subtract the 20px (1.25rem) `gap-5` between slides:
// N-up = (100% − (N−1)·1.25rem) / N. Mobile shows one card with a small peek.
const THREE_UP =
  "w-[85%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]";
const FOUR_UP =
  "w-[80%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]";

function Slide({
  width,
  children,
}: {
  width: string;
  children: React.ReactNode;
}) {
  return <div className={`${width} shrink-0 snap-start`}>{children}</div>;
}

function SeeMoreTile({ to, width }: { to: string; width: string }) {
  return (
    <Slide width={width}>
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
      trailing={<SeeMoreTile to="/launchpad/all" width={THREE_UP} />}
    >
      {items.map((item) => (
        <Slide key={item.id} width={THREE_UP}>
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
    <HomeCarouselSection
      title="Volunteers"
      trailing={<SeeMoreTile to="/volunteer/all" width={THREE_UP} />}
    >
      {items.map((opportunity) => (
        <Slide key={opportunity.id} width={THREE_UP}>
          <OpportunityCard opportunity={opportunity} />
        </Slide>
      ))}
    </HomeCarouselSection>
  );
}

export function DiscussionFeed({ items }: { items: QuestionResponse[] }) {
  if (items.length === 0) return null;

  return (
    <HomeCarouselSection
      title="Popular Discussions"
      trailing={<SeeMoreTile to="/forum" width={THREE_UP} />}
    >
      {items.map((question) => (
        <Slide key={question.id} width={THREE_UP}>
          <HomeDiscussionCard question={question} />
        </Slide>
      ))}
    </HomeCarouselSection>
  );
}

export function EventsFeed({ items }: { items: EventData[] }) {
  if (items.length === 0) return null;

  return (
    <HomeCarouselSection
      title="Upcoming Events"
      trailing={<SeeMoreTile to="/events/all" width={FOUR_UP} />}
    >
      {items.map((event) => (
        <Slide key={event.id} width={FOUR_UP}>
          <EventCard event={event} />
        </Slide>
      ))}
    </HomeCarouselSection>
  );
}
