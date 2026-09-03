import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { homeLoader } from "~/features/home/services/home.loader";
import { homeAction } from "~/features/home/services/home.action";
import { HomeHeroSection } from "~/features/home/components/home-hero-section";
import { HomeWelcomeHeroSection } from "~/features/home/components/home-welcome-hero-section";
import { HomeExploreSection } from "~/features/home/components/home-explore-section";
import { HomeEventsSection } from "~/features/home/components/home-events-section";
import { HomeTrustedBySection } from "~/features/home/components/home-trusted-by-section";
import { HomePillarsSection } from "~/features/home/components/home-pillars-section";
import {
  BlogFeed,
  DiscussionFeed,
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
export const action = homeAction;

export default function Home() {
  const { user, launchpads, volunteers, discussions, blogPosts } =
    useLoaderData<typeof loader>();

  return (
    <div className="bg-white">
      {user ? (
        // ── Authenticated: welcome hero + explore shortcuts + community feeds ──
        <>
          <HomeWelcomeHeroSection name={user.name} />
          <HomeExploreSection />
          <DiscussionFeed items={discussions} />
          {/* <HomeEventsSection /> */}
          <LaunchpadFeed items={launchpads} />
          <VolunteerFeed items={volunteers} />
          <BlogFeed items={blogPosts} />
        </>
      ) : (
        // ── Guest: marketing hero + pillars, then the community feeds ──
        <>
          <HomeHeroSection />
          <HomeTrustedBySection />
          <HomePillarsSection />
          <LaunchpadFeed items={launchpads} />
          <VolunteerFeed items={volunteers} />
          <BlogFeed items={blogPosts} />
        </>
      )}
    </div>
  );
}
