import { motion, useReducedMotion } from "framer-motion";
import type { Opportunity } from "~/services/volunteer/types/opportunities";
import EmptyPost from "../components/empty-post";
import OpportunityCover from "../components/sections/opportunity-cover";
import OpportunityDetailsGrid from "../components/sections/opportunity-details-grid";
import ProjectOverviewSection from "../components/sections/project-overview-section";
import AvailableRolesCard from "../components/sections/available-roles-card";
import BenefitsSection from "../components/sections/benefit-section";
import ProjectImpactSection from "../components/sections/project-impact-section";
import OrganizerCard from "../components/sections/organizer-card";
import ApplicationSummary from "../components/sections/application-summary";
import BackToButton from "~/components/back-to-button";

interface VolunteerDetailPageProps {
  volunteer?: Opportunity;
}

export function VolunteerDetailPage({ volunteer }: VolunteerDetailPageProps) {
  if (!volunteer) {
    return <EmptyPost />;
  }

  const prefersReducedMotion = useReducedMotion();

  const totalCapacity = volunteer.roles.reduce(
    (sum, role) => sum + role.capacity,
    0,
  );

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
          <BackToButton to="/volunteer" />
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex min-w-0 flex-col gap-4 md:gap-8">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.05,
              }}
              className="flex flex-col gap-8 overflow-hidden rounded-3xl border border-[#e1e7ef] bg-white"
            >
              <OpportunityCover volunteer={volunteer} />
              <div className="px-8">
                <OpportunityDetailsGrid volunteer={volunteer} />
              </div>
              <div className="px-8 pb-8">
                <ProjectOverviewSection volunteer={volunteer} />
              </div>
            </motion.article>

            <AvailableRolesCard roles={volunteer.roles} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.1,
              }}
            >
              <BenefitsSection volunteer={volunteer} />
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
              <ProjectImpactSection volunteer={volunteer} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.2,
              }}
            ></motion.div>
          </section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
            className="lg:sticky lg:top-24 flex flex-col gap-6"
          >
            <ApplicationSummary
              volunteer={volunteer}
              totalCapacity={totalCapacity}
            />
            <OrganizerCard volunteer={volunteer} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
