import {
  useLoaderData,
  useFetcher,
  useParams,
  useNavigate,
} from "react-router";
import type { loader } from "../routes/profile.$id";
import { motion, useReducedMotion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import ProfileAboutCard from "../components/card/profile-about-card";
import ProfileHeaderCard from "../components/card/profile-header-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import QuestionCard from "~/features/forum/components/card/question-card";
import QuestionCardSkeleton from "~/features/forum/components/card/question-card-skeleton";
import { OpportunityCard } from "~/components/opportunity-card";
import OpportunityCardSkeleton from "~/features/volunteer/components/sections/opportunity-card-skeleton";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import LaunchpadProjectCardSkeleton from "~/features/launchpad/components/card/launchpad-project-card-skeleton";
import type { Question } from "~/services/forum/types";

export default function ProfileDetailPage() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  const navigate = useNavigate();
  const postedFetcher = useFetcher<typeof loader>();

  const profile = data.kind === "profile" ? data.profile : null;

  const fetcherData =
    postedFetcher.data?.kind === "posted"
      ? postedFetcher.data.postedContent
      : null;

  const isLoading = postedFetcher.state === "loading";

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.36, ease: "easeInOut" },
    },
  } as const;

  const prefersReducedMotion = useReducedMotion();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <p className="text-lg font-medium">Profile not found</p>
        <p className="text-sm mt-1">
          The user you are looking for does not exist or has been removed
        </p>
        <BackToButton to={"/"} className="mt-6" />
      </div>
    );
  }

  const forumQuestions =
    fetcherData?.sourceType === "forum" ? fetcherData.questions : [];

  const volunteerOpportunities =
    fetcherData?.sourceType === "volunteer" ? fetcherData.opportunities : [];

  const projectItems =
    fetcherData?.sourceType === "project" ? fetcherData.launchpads : [];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate={prefersReducedMotion ? undefined : "show"}
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-8"
      >
        <BackToButton to={"/"} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ProfileHeaderCard
          profileImage={profile.profile.avatarKey ?? ""}
          profileName={profile.user.displayName ?? ""}
          occupation={profile.user.occupation ?? ""}
          tierName={profile.tier.name}
          cityName={profile.profile.city.name}
          countryName={profile.profile.country.name}
          email={profile.user.email ?? ""}
          website={profile.socialLinks.website ?? ""}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs
          defaultValue="about"
          onValueChange={(value) => {
            if (value !== "about" && params.id) {
              postedFetcher.load(`/profile/${params.id}?sourceType=${value}`);
            }
          }}
        >
          <div className="w-full border-b mb-8">
            <TabsList className="bg-transparent" variant={"line"}>
              <TabsTrigger
                className="font-bold data-active:text-blue-600 data-active:after:bg-blue-600"
                value={"about"}
              >
                About
              </TabsTrigger>
              <TabsTrigger
                className="font-bold data-active:text-blue-600 data-active:after:bg-blue-600"
                value={"forum"}
              >
                Forum ({profile.postedCounts.forum})
              </TabsTrigger>
              <TabsTrigger
                className="font-bold data-active:text-blue-600 data-active:after:bg-blue-600"
                value={"volunteer"}
              >
                Volunteer ({profile.postedCounts.volunteer})
              </TabsTrigger>
              <TabsTrigger
                className="font-bold data-active:text-blue-600 data-active:after:bg-blue-600"
                value={"project"}
              >
                Projects ({profile.postedCounts.project})
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={"about"}>
            {profile.profile.bio || profile.skills.length > 0 ? (
              <ProfileAboutCard
                about={profile.profile.bio ?? ""}
                skills={profile.skills}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-lg font-medium">No information available</p>
                <p className="text-sm mt-1">
                  This user has not added any details yet
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value={"forum"}>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <QuestionCardSkeleton key={`skeleton-${i}`} />
                ))
              ) : forumQuestions.length > 0 ? (
                forumQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question as unknown as Question}
                    categories={[]}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No forum posts yet
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value={"volunteer"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <OpportunityCardSkeleton key={`skeleton-${i}`} />
                ))
              ) : volunteerOpportunities.length > 0 ? (
                volunteerOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No volunteer posts yet
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value={"project"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <LaunchpadProjectCardSkeleton
                    key={`skeleton-${i}`}
                    className="shadow-none"
                  />
                ))
              ) : projectItems.length > 0 ? (
                projectItems.map((item) => (
                  <LaunchpadProjectCard
                    key={item.id}
                    item={item}
                    onOpenOpportunity={(opportunity) =>
                      navigate(`/launchpad/detail/${opportunity.id}`)
                    }
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-8">
                  No project posts yet
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
