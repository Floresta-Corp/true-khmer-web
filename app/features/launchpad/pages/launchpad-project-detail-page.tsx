import { motion, useReducedMotion } from "motion/react";
import { useLoaderData } from "react-router";
import { EllipsisVertical, Share2 } from "lucide-react";
import LaunchpadProjectDetailCard from "../components/card/launchpad-project-detail-card";
import LaunchpadProjectCoverCard from "../components/card/launchpad-project-cover-card";
import LaunchpadSeekingCollaborationCard from "../components/card/launchpad-seeking-collaboration-card";
import LaunchpadPresentationCard from "../components/card/launchpad-presentation-card";
import LaunchpadAuthorCard from "../components/card/launchpad-author-card";
import BackToButton from "~/components/back-to-button";
import IconButton from "~/components/icon-button";
import { Card } from "~/components/ui/card";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";
import LaunchpadJoinProjectCard from "../components/card/launchpad-join-project-card";

export default function LaunchpadProjectDetailPage() {
  const project = useLoaderData<LaunchpadDetail>();
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
          }}
          className="flex items-center justify-between"
        >
          <BackToButton to="/launchpad" />
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Share2 className="size-4" />}
              ariaLabel="Share project"
              disabled
            />
            <IconButton
              icon={<EllipsisVertical className="size-4" />}
              ariaLabel="More options"
              disabled
            />
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
            >
              <Card className="overflow-hidden rounded-2xl border-[#E7ECF3] bg-white">
                <LaunchpadProjectCoverCard project={project} />
                <LaunchpadProjectDetailCard project={project} />
              </Card>
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
              <LaunchpadSeekingCollaborationCard project={project} />
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
              <LaunchpadPresentationCard project={project} />
            </motion.div>
          </section>

          <section className="flex flex-col gap-4 lg:sticky lg:top-6 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.2,
              }}
            >
              <LaunchpadJoinProjectCard project={project} />
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
              <LaunchpadAuthorCard project={project} />
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
