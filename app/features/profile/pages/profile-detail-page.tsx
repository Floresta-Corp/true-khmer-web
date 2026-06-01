import { useLoaderData } from "react-router";
import type { loader } from "../routes/profile.$id";
import { motion, prefersReducedMotion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import ProfileAboutCard from "../components/card/profile-about-card";
import ProfileHeaderCard from "../components/card/profile-header-card";

export default function ProfileDetailPage() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
        className="flex items-center justify-between mb-8"
      >
        <BackToButton to={"/"} />
      </motion.div>
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
      <ProfileAboutCard about={profile.profile.bio ?? ""} skills={profile.skills} /> 
    </div>
  );
}
