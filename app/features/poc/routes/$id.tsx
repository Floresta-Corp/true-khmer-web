import { useState } from "react";
import { useNavigate } from "react-router";
import {
  PocNavigationSection,
  StoryDetailHeroSection,
  StoryDetailSidebarSection,
} from "~/features/poc/components/sections";
import PocWatchVideoSection from "../components/sections/WatchVideoSection";

export default function PeopleOfCambodiaDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"video" | "story">("video");

  const handleWatchVideo = () => {
    console.log("Watch video clicked");
  };

  const handleReadFullStory = () => {
    console.log("Read full story clicked");
  };

  const handleLike = () => {
    console.log("Liked");
  };

  const handleShare = () => {
    console.log("Shared");
  };

  const handleReadFullArticle = () => {
    console.log("Read full article clicked");
  };

  const handleRelatedStoryClick = (story: any) => {
    navigate(`/poc/${story.id}`);
  };

  return (
    <div className="w-full flex flex-col px-28 py-8 ">
      <PocNavigationSection
        onWatchVideo={handleWatchVideo}
        onReadFullStory={handleReadFullStory}
      />

      {activeTab === "video" ? (
        <PocWatchVideoSection
          handleLike={handleLike}
          handleShare={handleShare}
          handleReadFullArticle={handleReadFullArticle}
          handleRelatedStoryClick={handleRelatedStoryClick}
        />
      ) : (
        <StoryDetailSidebarSection
          title="The weaver of silk"
          duration="4:20 mns"
          views={1200}
          publishedDate="21 days ago"
          likes={77}
          description="In this intimate documentary, Srey Leak shares her journey of preserving a centuries-old tradition. From the meticulous harvesting of silk to the complex patterns that tell stories of Khmer heritage, 'The Weaver of Silk' explores the intersection of art, history, and sustainable livelihood in modern Cambodia."
          onReadFullArticle={handleReadFullArticle}
          onLike={handleLike}
          onShare={handleShare}
          onRelatedStoryClick={handleRelatedStoryClick}
        />
      )}
    </div>
  );
}
