import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { homeLoader } from "~/features/home/services/home.loader";
import { HomeHeroSection } from "~/features/home/components/home-hero-section";
import { HomeTrustedBySection } from "~/features/home/components/home-trusted-by-section";
import { HomePillarsSection } from "~/features/home/components/home-pillars-section";
import {
  LaunchpadFeed,
  VolunteerFeed,
} from "~/features/home/components/home-feed-sections";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "True Khmer — Unleashing the Potential of Cambodia" },
    {
      name: "description",
      content:
        "Khmer for Khmer, together, taking an active role in shaping our Kingdom's future by supporting local talent, ventures, and initiatives.",
    },
  ];
}

export const loader = homeLoader;

export default function Home() {
  const { user, launchpads, volunteers, upcomingEvents, events } =
    useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      {user ? (
        // ── Authenticated: feed-first, no marketing chrome ──
        <>
          <LaunchpadFeed items={launchpads} />
          <VolunteerFeed items={volunteers} />
        </>
      ) : (
        // ── Guest: marketing hero + pillars, then the community feeds ──
        <>
          <HomeHeroSection isAuthenticated={false} />
          <HomeTrustedBySection />
          <HomePillarsSection />
          <LaunchpadFeed items={launchpads} />
          <VolunteerFeed items={volunteers} />
          {/* <BlogFeed />
          <EventsFeed title="Upcoming Events" items={upcomingEvents} /> */}
        </>
      )}
    </div>
  );
}
