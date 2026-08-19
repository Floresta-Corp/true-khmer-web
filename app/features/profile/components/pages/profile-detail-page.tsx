import {
  useLoaderData,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router";
import type { profileLoader } from "../../services/profile.loader";
import { motion, useReducedMotion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import ProfileAboutCard from "../card/profile-about-card";
import ProfileHeaderCard from "../card/profile-header-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import QuestionCard from "~/features/forum/components/card/question-card";
import QuestionCardSkeleton from "~/features/forum/components/card/question-card-skeleton";
import { OpportunityCard } from "~/components/opportunity-card";
import OpportunityCardSkeleton from "~/features/volunteer/components/sections/opportunity-card-skeleton";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import LaunchpadProjectCardSkeleton from "~/features/launchpad/components/card/launchpad-project-card-skeleton";
import { InfiniteScrollTrigger } from "~/components/infinite-scroll-trigger";
import { usePostedContent } from "../use-posted-content";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeInOut" } },
} as const;

const TAB_TRIGGER_CLASS =
  "px-5 py-3 text-xs sm:text-sm font-black cursor-pointer data-active:text-[#1A73E8] dark:data-active:text-blue-400 data-active:after:bg-[#1A73E8]";

export default function ProfileDetailPage() {
  const data = useLoaderData<typeof profileLoader>();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialPosted =
    data.kind === "profile" && "initialPosted" in data
      ? data.initialPosted
      : undefined;

  const {
    accumulated,
    isTabLoading,
    isLoadingMore,
    handleTabChange,
    handleLoadMore,
  } = usePostedContent(params.id, initialPosted);

  const allowedTabs = ["forum", "volunteer", "project"] as const;
  const urlSourceType = searchParams.get("sourceType");
  const defaultTab =
    urlSourceType &&
    allowedTabs.includes(urlSourceType as (typeof allowedTabs)[number])
      ? urlSourceType
      : "about";

  const profile = data.kind === "profile" ? data.profile : null;
  const prefersReducedMotion = useReducedMotion();

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-400">
        <p className="text-lg font-medium">Profile not found</p>
        <p className="mt-1 text-sm">
          The user you are looking for does not exist or has been removed
        </p>
        <BackToButton to={"/"} className="mt-6" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate={prefersReducedMotion ? undefined : "show"}
    >
      <motion.div
        variants={itemVariants}
        className="mb-8 flex items-center justify-between"
      >
        <BackToButton to={"/"} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ProfileHeaderCard
          profileImage={profile.profile.avatarKey ?? ""}
          profileName={profile.user.displayName ?? ""}
          occupation={profile.user.occupation ?? ""}
          tierName={profile.tier?.name}
          cityName={profile.profile.city?.name}
          countryName={profile.profile.country?.name}
          email={profile.user.email ?? ""}
          website={profile.socialLinks.website ?? ""}
          profileId={profile.user.id}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
          <div className="mb-8 w-full border-b">
            <TabsList className="flex gap-10 bg-transparent" variant={"line"}>
              <TabsTrigger className={TAB_TRIGGER_CLASS} value="about">
                About
              </TabsTrigger>
              <TabsTrigger className={TAB_TRIGGER_CLASS} value="forum">
                Forum ({profile.postedCounts?.forum ?? 0})
              </TabsTrigger>
              <TabsTrigger className={TAB_TRIGGER_CLASS} value="volunteer">
                Volunteer ({profile.postedCounts?.volunteer ?? 0})
              </TabsTrigger>
              <TabsTrigger className={TAB_TRIGGER_CLASS} value="project">
                Launchpad ({profile.postedCounts?.project ?? 0})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="about">
            {profile.profile.bio || profile.skills.length > 0 ? (
              <ProfileAboutCard
                about={profile.profile.bio ?? ""}
                skills={profile.skills}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-lg font-medium">No information available</p>
                <p className="mt-1 text-sm">
                  This user has not added any details yet
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="forum">
            <div className="space-y-4">
              {isTabLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <QuestionCardSkeleton key={i} />
                ))
              ) : accumulated.questions.length > 0 ? (
                <>
                  {accumulated.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question as any}
                      categories={[]}
                      index={index}
                    />
                  ))}
                  <InfiniteScrollTrigger
                    hasMore={accumulated.hasMore}
                    isLoading={isLoadingMore}
                    onTrigger={() => handleLoadMore("forum")}
                  />
                </>
              ) : (
                <p className="py-8 text-center text-gray-500">
                  No forum posts yet
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="volunteer">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isTabLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <OpportunityCardSkeleton key={i} />
                ))
              ) : accumulated.opportunities.length > 0 ? (
                <>
                  {accumulated.opportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
                  <div className="col-span-full">
                    <InfiniteScrollTrigger
                      hasMore={accumulated.hasMore}
                      isLoading={isLoadingMore}
                      onTrigger={() => handleLoadMore("volunteer")}
                    />
                  </div>
                </>
              ) : (
                <p className="col-span-full py-8 text-center text-gray-500">
                  No volunteer posts yet
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="project">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isTabLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <LaunchpadProjectCardSkeleton
                    key={i}
                    className="shadow-none"
                  />
                ))
              ) : accumulated.launchpads.length > 0 ? (
                <>
                  {accumulated.launchpads.map((item) => (
                    <LaunchpadProjectCard
                      key={item.id}
                      item={item}
                      onOpenOpportunity={(opportunity) =>
                        navigate(`/launchpad/detail/${opportunity.id}`)
                      }
                    />
                  ))}
                  <div className="col-span-full">
                    <InfiniteScrollTrigger
                      hasMore={accumulated.hasMore}
                      isLoading={isLoadingMore}
                      onTrigger={() => handleLoadMore("project")}
                    />
                  </div>
                </>
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
  );
}
