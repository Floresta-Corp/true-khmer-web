import { useLoaderData } from "react-router";
import type { loader } from "../routes/profile.$id";
import { motion, useReducedMotion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import ProfileAboutCard from "../components/card/profile-about-card";
import ProfileHeaderCard from "../components/card/profile-header-card";

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
        <ProfileAboutCard
          about={profile.profile.bio ?? ""}
          skills={profile.skills}
        />
      </motion.div>
    </motion.div>
  );
}
