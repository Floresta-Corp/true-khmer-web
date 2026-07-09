import * as React from "react";
import { motion } from "motion/react";
import { myspaceLoader } from "../services/myspace.loader";
import type { Route } from "./+types/myspace";
import { PageHeader } from "../components/myspace-page-header";
import { ProfileHeader } from "../components/myspace-profile-header";
import { MyAchievementsCard } from "../components/myspace-my-achievements-card";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import { useFetcher, useNavigate, useSearchParams } from "react-router";
import MyspaceBioCard from "../components/myspace-bio-card";
import { CommunityStandingCard } from "../components/myspace-community-standing-cards";
import ProfileHeaderCard from "~/features/profile/components/card/profile-header-card";
import ProfileAboutCard from "~/features/profile/components/card/profile-about-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import QuestionCard from "~/features/forum/components/card/question-card";
import QuestionCardSkeleton from "~/features/forum/components/card/question-card-skeleton";
import { OpportunityCard } from "~/components/opportunity-card";
import OpportunityCardSkeleton from "~/features/volunteer/components/sections/opportunity-card-skeleton";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import LaunchpadProjectCardSkeleton from "~/features/launchpad/components/card/launchpad-project-card-skeleton";
import type { QuestionResponse } from "~/types/api-client";

export const loader = myspaceLoader;

export function meta() {
  return [{ title: "MySpace | True Khmer" }];
}

export default function MySpacePage({ loaderData }: Route.ComponentProps) {
  const { me, userId } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const postedFetcher = useFetcher<any>();
  const profileFetcher = useFetcher<any>();
  const [viewMode, setViewMode] = React.useState<"myview" | "public">(
    searchParams.get("view") === "public" ? "public" : "myview",
  );

  React.useEffect(() => {
    const searchViewMode =
      searchParams.get("view") === "public" ? "public" : "myview";
    setViewMode(searchViewMode);
  }, [searchParams]);

  React.useEffect(() => {
    if (viewMode === "public" && userId && !profileFetcher.data) {
      profileFetcher.load(`/profile/${userId}`);
    }
  }, [viewMode, userId]);

  if (!me) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
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

  const fetcherData =
    postedFetcher.data?.kind === "posted" ? postedFetcher.data.posted : null;

  const isLoading = postedFetcher.state === "loading";

  const forumQuestions =
    fetcherData?.sourceType === "forum" ? fetcherData.questions : [];
  const volunteerOpportunities =
    fetcherData?.sourceType === "volunteer" ? fetcherData.opportunities : [];
  const projectItems =
    fetcherData?.sourceType === "project" ? fetcherData.launchpads : [];

  const postedCounts =
    profileFetcher.data?.kind === "profile"
      ? profileFetcher.data.profile.postedCounts
      : null;

  if (isPublicView) {
    return (
      <ForumPageLayout>
        <motion.div
          className="space-y-6 rounded-2xl border border-[#e1e7ef] bg-white p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <PageHeader
              isPublicView={true}
              onToggleView={handleToggleView}
              profileId={userId}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <ProfileHeaderCard
              profileImage={me.profile.avatarKey ?? ""}
              profileName={displayName}
              occupation={me.user.occupation ?? ""}
              tierName={me.progress.tier.name}
              cityName={me.profile?.city?.name ?? ""}
              countryName={me.profile?.country?.name ?? ""}
              email={me.user.email}
              website={me.socialLinks?.website ?? ""}
              profileId={userId ?? undefined}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <Tabs
              defaultValue="about"
              onValueChange={(value) => {
                if (value !== "about" && userId) {
                  postedFetcher.load(
                    `/profile/${userId}?sourceType=${value}&_intent=client`,
                  );
                }
              }}
            >
              <div className="mb-8 w-full border-b">
                <TabsList className="bg-transparent" variant={"line"}>
                  <TabsTrigger
                    className="cursor-pointer px-10 py-3 text-xs font-black sm:text-sm data-active:text-[#1A73E8] data-active:after:bg-[#1A73E8] dark:data-active:text-blue-400"
                    value="about"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    className="cursor-pointer px-10 py-3 text-xs font-black sm:text-sm data-active:text-[#1A73E8] data-active:after:bg-[#1A73E8] dark:data-active:text-blue-400"
                    value="forum"
                  >
                    Forum{postedCounts ? ` (${postedCounts.forum})` : ""}
                  </TabsTrigger>
                  <TabsTrigger
                    className="cursor-pointer px-10 py-3 text-xs font-black sm:text-sm data-active:text-[#1A73E8] data-active:after:bg-[#1A73E8] dark:data-active:text-blue-400"
                    value="volunteer"
                  >
                    Volunteer
                    {postedCounts ? ` (${postedCounts.volunteer})` : ""}
                  </TabsTrigger>
                  <TabsTrigger
                    className="cursor-pointer px-10 py-3 text-xs font-black sm:text-sm data-active:text-[#1A73E8] data-active:after:bg-[#1A73E8] dark:data-active:text-blue-400"
                    value="project"
                  >
                    Launchpad{postedCounts ? ` (${postedCounts.project})` : ""}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about">
                {me.profile.bio || me.skills.length > 0 ? (
                  <ProfileAboutCard
                    about={me.profile.bio ?? ""}
                    skills={me.skills}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <p className="text-lg font-medium">
                      No information available
                    </p>
                    <p className="mt-1 text-sm">
                      You haven&apos;t added any details yet
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="forum">
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <QuestionCardSkeleton key={`skeleton-${i}`} />
                    ))
                  ) : forumQuestions.length > 0 ? (
                    forumQuestions.map(
                      (question: QuestionResponse, index: number) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          categories={[]}
                          index={index}
                        />
                      ),
                    )
                  ) : (
                    <p className="py-8 text-center text-gray-500">
                      No forum posts yet
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="volunteer">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <OpportunityCardSkeleton key={`skeleton-${i}`} />
                    ))
                  ) : volunteerOpportunities.length > 0 ? (
                    volunteerOpportunities.map((opportunity: any) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                      />
                    ))
                  ) : (
                    <p className="col-span-full py-8 text-center text-gray-500">
                      No volunteer posts yet
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="project">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <LaunchpadProjectCardSkeleton
                        key={`skeleton-${i}`}
                        className="shadow-none"
                      />
                    ))
                  ) : projectItems.length > 0 ? (
                    projectItems.map((item: any) => (
                      <LaunchpadProjectCard
                        key={item.id}
                        item={item}
                        onOpenOpportunity={(opportunity) =>
                          navigate(`/launchpad/detail/${opportunity.id}`)
                        }
                      />
                    ))
                  ) : (
                    <p className="col-span-full py-8 text-center text-gray-500">
                      No launchpad posts yet
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </ForumPageLayout>
    );
  }

  return (
    <ForumPageLayout>
      <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-4 sm:p-6 lg:grid-cols-12 lg:p-8">
        <div className="space-y-6 lg:col-span-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <PageHeader
              isPublicView={isPublicView}
              onToggleView={handleToggleView}
              profileId={userId}
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
              location={
                [me.profile?.city?.name, me.profile?.country?.name]
                  .filter(Boolean)
                  .join(", ") || null
              }
              email={me.user.email}
              tier={me.progress.tier.name}
              socialLinks={me.socialLinks}
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-8">
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
      </div>
    </ForumPageLayout>
  );
}
