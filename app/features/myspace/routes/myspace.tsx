import { motion } from "motion/react";
import { MyspaceLoader } from "~/routes/api/myspace/myspace-loader";
import type { Route } from "./+types/myspace";
import { resolveImageURL } from "~/lib/utils";
import { RecentActivityList } from "../components/recent-activity-list";
import { PageHeader } from "../components/myspace-page-header";
import { ProfileHeader } from "../components/myspace-profile-header";
import { AchievementsCard } from "../components/myspace-achievements-card";
import { PointsChartCard } from "../components/myspace-points-chart-card";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import MyspaceBioCard from "../components/myspace-bio-card";
import { StatsCards } from "../components/myspace-stats-cards";

export const loader = MyspaceLoader;

export function meta() {
  return [{ title: "MySpace | True Khmer" }];
}

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
    <ForumPageLayout contentClassName="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12 space-y-6">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <PointsChartCard />
        </motion.div>
      </div>

      <aside className="lg:col-span-4">
        <div className="grid gap-4">
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
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <AchievementsCard badges={me.badges} />
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
          </motion.div>
        </div>
      </aside>
    </ForumPageLayout>
  );
}
