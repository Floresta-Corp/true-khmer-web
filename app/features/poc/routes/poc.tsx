import {
  HeaderSection,
  RecommendedStoriesSection,
} from "~/features/poc/components/sections";

export function meta() {
  return [{ title: "People of Cambodia | True Khmer" }];
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
