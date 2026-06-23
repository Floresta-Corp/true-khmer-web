import * as React from "react";
import { motion } from "motion/react";
import { MyspaceLoader } from "~/routes/api/myspace/myspace-loader";
import type { Route } from "./+types/myspace";
import { PageHeader } from "../components/myspace-page-header";
import { ProfileHeader } from "../components/myspace-profile-header";
import { MyAchievementsCard } from "../components/myspace-my-achievements-card";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { useSearchParams } from "react-router";
import MyspaceBioCard from "../components/myspace-bio-card";
import { CommunityStandingCard } from "../components/myspace-community-standing-cards";

export const loader = MyspaceLoader;

export function meta() {
  return [{ title: "MySpace | True Khmer" }];
}

export default function MySpacePage({ loaderData }: Route.ComponentProps) {
  const { me } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = React.useState<"myview" | "public">(
    searchParams.get("view") === "public" ? "public" : "myview",
  );

  React.useEffect(() => {
    const searchViewMode =
      searchParams.get("view") === "public" ? "public" : "myview";
    setViewMode(searchViewMode);
  }, [searchParams]);

  if (!me) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const isPublicView = viewMode === "public";

  const handleToggleView = () => {
    const nextViewMode = isPublicView ? "myview" : "public";
    setViewMode(nextViewMode);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      if (nextViewMode === "public") {
        nextParams.set("view", "public");
      } else {
        nextParams.delete("view");
      }
      return nextParams;
    });
  };

  const displayName =
    me.user.displayName || `${me.user.firstName} ${me.user.lastName}`;
  return (
    <ForumPageLayout contentClassName="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <PageHeader
            isPublicView={isPublicView}
            onToggleView={handleToggleView}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <ProfileHeader
            displayName={displayName}
            avatarKey={me.profile.avatarKey}
            firstName={me.user.firstName}
            lastName={me.user.lastName}
            occupation={me.user.occupation}
            location={me.profile?.country?.name || null}
            email={me.user.email}
            tier={me.progress.tier.name}
            socialLinks={me.socialLinks}
          />
        </motion.div>
      </div>

      <div className="lg:col-span-8 gap-3 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <MyspaceBioCard
            bio={me.profile.bio || "No bio available."}
            skills={me.skills.map((skill) => skill.name)}
          />
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <PointsChartCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <RecentActivityList
            activities={recentActivities || []}
            maxItems={5}
          />
        </motion.div> */}
      </div>

      <aside className="lg:col-span-4">
        <div className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <CommunityStandingCard
              totalPoints={me.progress.totalPoints}
              tier={me.progress.tier}
              rank={me.progress.rank}
              nextTier={me.progress.nextTier}
              pointsUntilNextTier={me.progress.pointsUntilNextTier}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <MyAchievementsCard badges={me.badges} />
          </motion.div>
        </div>
      </aside>
    </ForumPageLayout>
  );
}
