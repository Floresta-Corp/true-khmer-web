import type { Route } from "./+types/poc";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import {
  HeaderSection,
  RecommendedStoriesSection,
} from "~/features/poc/components/sections";

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "People of Cambodia",
    description:
      "The people shaping Cambodia, in their own words — stories from across the Kingdom.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "People of Cambodia", path: "/poc" },
      ]),
    ],
  });
}

export default function PeopleOfCambodiaPage() {
  const handleWatchVideo = () => {
    // Handle video play
    console.log("Watch video clicked");
  };

  const handleViewDetails = () => {
    // Handle view details
    console.log("View details clicked");
  };

  const handleStoryClick = (story: any) => {
    console.log("Story clicked:", story);
  };

  const handleLike = (storyId: string) => {
    console.log("Liked story:", storyId);
  };

  const handleShare = (storyId: string) => {
    console.log("Shared story:", storyId);
  };

  return (
    <div className="w-full pb-8">
      <HeaderSection
        onWatchVideo={handleWatchVideo}
        onViewDetails={handleViewDetails}
      />
      <RecommendedStoriesSection
        onStoryClick={handleStoryClick}
        onLike={handleLike}
        onShare={handleShare}
      />
    </div>
  );
}
