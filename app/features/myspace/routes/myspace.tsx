import { motion } from "motion/react";
import { MyspaceLoader } from "~/routes/api/myspace/myspace-loader";
import type { Route } from "./+types/myspace";
import { resolveImageURL } from "~/lib/utils";
import { RecentActivityList } from "../components/recent-activity-list";
import { ShareProfileCard } from "../components/myspace-share-profile-card";
import { PageHeader } from "../components/myspace-page-header";
import { ProfileHeader } from "../components/myspace-profile-header";
import { StatsCards } from "../components/myspace-stats-cards";
import { AchievementsCard } from "../components/myspace-achievements-card";
import { PointsChartCard } from "../components/myspace-points-chart-card";
import { TopRankingCard } from "../components/myspace-top-ranking-card";

export const loader = MyspaceLoader;

export default function MySpacePage({ loaderData }: Route.ComponentProps) {
  const { me, recentActivities } = loaderData;

  if (!me) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const displayName =
    me.user.displayName || `${me.user.firstName} ${me.user.lastName}`;
  const avatarUrl = resolveImageURL(me.profile.avatarKey || undefined);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 space-y-6">
          {/*<div className="lg:col-span-9 space-y-6">*/}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <PageHeader />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <ProfileHeader
              displayName={displayName}
              avatarUrl={avatarUrl}
              firstName={me.user.firstName}
              lastName={me.user.lastName}
              occupation={me.user.occupation}
              bio={me.profile.bio}
              socialLinks={me.socialLinks}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <StatsCards
              totalPoints={me.progress.totalPoints}
              tier={me.progress.tier}
              rank={me.progress.rank}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <AchievementsCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <PointsChartCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <RecentActivityList
              activities={recentActivities || []}
              maxItems={20}
            />
          </motion.div>
        </div>

        {/*<aside className="lg:col-span-3">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <ShareProfileCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <TopRankingCard />
            </motion.div>
          </div>
        </aside>*/}
      </div>
    </div>
  );
}
