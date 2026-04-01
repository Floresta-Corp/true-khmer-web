import { StoryDetailHeroSection } from "./story-detail-hero-section";
import { StoryDetailSidebarSection } from "./story-detail-sidebar-section";

interface PocWatchVideoSectionProps {
  handleLike: () => void;
  handleShare: () => void;
  handleReadFullArticle: () => void;
  handleRelatedStoryClick: (story: any) => void;
}

export default function PocWatchVideoSection({
  handleLike,
  handleShare,
  handleReadFullArticle,
  handleRelatedStoryClick,
}: PocWatchVideoSectionProps) {
  return (
    <>
      {/* Hero Section */}
      <StoryDetailHeroSection onLike={handleLike} onShare={handleShare} />

      {/* Sidebar Section with Details and More Stories */}
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
    </>
  );
}
