import { useState } from "react";
import ForumSidebar from "./ForumSidebar";
import { DiscussionThread, type DiscussionPost } from "./DiscussionThread";
import RightSidebar from "./RightSidebar";

export interface ForumContentData {
  posts: DiscussionPost[];
}

interface ForumContentProps {
  data: ForumContentData;
}

export default function ForumContent({ data }: ForumContentProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [activeTab, setActiveTab] = useState<
    "recent" | "topRated" | "unanswered" | "myActivity"
  >("recent");

  return (
    <div className="bg-[#f8fafc] px-30 py-10 min-h-screen">
      <div className="flex gap-7 max-w-full">
        {/* Left Sidebar */}
        <ForumSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Main Content */}
        <DiscussionThread
          posts={data.posts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCategoryClick={setSelectedCategory}
        />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
