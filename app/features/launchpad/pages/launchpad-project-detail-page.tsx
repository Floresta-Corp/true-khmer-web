import { motion, useReducedMotion } from "motion/react";
import LaunchpadProjectDetailCard from "../components/card/launchpad-project-detail-card";
import LaunchpadProjectSummaryCard from "../components/card/launchpad-project-summary-card";
import LaunchpadProjectCoverCard from "../components/card/launchpad-project-cover-card";
import LaunchpadSeekingCollaborationCard from "../components/card/launchpad-seeking-collaboration-card";
import LaunchpadPresentationCard from "../components/card/launchpad-presentation-card";
import LaunchpadAuthorCard from "../components/card/launchpad-author-card";
import BackToButton from "~/components/back-to-button";

const data = {
  projectSummary: {
    location: "Phnom Penh",
    applicants: {
      status: "6 spots open",
      count: 6,
    },
    deadline: "2026-04-12",
  },
};

export default function LaunchpadProjectDetailPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-white px-6 py-10 md:px-12 lg:px-28">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
          }}
        >
          <BackToButton to="/launchpad" />
        </motion.div>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex min-w-0 flex-col gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
            >
              <LaunchpadProjectCoverCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.15,
              }}
            >
              <LaunchpadProjectDetailCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.2,
              }}
            >
              <LaunchpadSeekingCollaborationCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.25,
              }}
            >
              <LaunchpadPresentationCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.3,
              }}
            >
              <LaunchpadAuthorCard />
            </motion.div>
          </section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <LaunchpadProjectSummaryCard data={data} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
