import { motion, prefersReducedMotion } from "motion/react";
import BackToButton from "~/components/back-to-button";
import { Card } from "~/components/ui/card";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";
import ProfileHeaderCard from "../components/card/profile-header-card";

export default function ProfilePage() {
  return (
    <ForumPageLayout>
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
      <ProfileHeaderCard profileImage="" />
    </ForumPageLayout>
  );
}
