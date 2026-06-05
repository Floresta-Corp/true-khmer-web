import { useLoaderData } from "react-router";
import type { loader } from "../routes/profile.$id";
import { motion, useReducedMotion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import ProfileAboutCard from "../components/card/profile-about-card";
import ProfileHeaderCard from "../components/card/profile-header-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function ProfileDetailPage() {
  const { profile } = useLoaderData<typeof loader>();

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
    show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  } as const;

  const prefersReducedMotion = useReducedMotion();

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
        <Tabs defaultValue="about">
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
                value={"projects"}
              >
                Projects ({profile.postedCounts.project})
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={"about"}>
            <ProfileAboutCard
              about={profile.profile.bio ?? ""}
              skills={profile.skills}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
