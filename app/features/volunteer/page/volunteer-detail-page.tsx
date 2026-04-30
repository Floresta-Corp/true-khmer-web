import { motion, useReducedMotion } from "framer-motion";
import type {
  Opportunity,
  Role,
} from "~/services/volunteer/types/opportunities";
import EmptyPost from "../components/empty-post";
import OpportunityCover from "../components/sections/opportunity-cover";
import OpportunityDetailsGrid from "../components/sections/opportunity-details-grid";
import ProjectOverviewSection from "../components/sections/project-overview-section";
import AvailableRolesSection from "../components/sections/available-role-section";
import BenefitsSection from "../components/sections/benefit-section";
import ProjectImpactSection from "../components/sections/project-impact-section";
import OrganizerCard from "../components/sections/organizer-card";
import ApplicationSummary from "../components/sections/application-summary";
import BackToButton from "~/components/back-to-button";

interface VolunteerDetailPageProps {
  volunteer?: Opportunity;
  userId?: string;
}

const responsibilities = [
  "Assist professional archeologists in documenting site conditions",
  "Catalog fragile carvings and annotate preservation priorities",
  "Photograph key artifacts and log findings in the field report",
  "Support local teams with safe site-mapping coordination",
];

const requirements = [
  "Physical fitness for walking in tropical environments",
  "Comfort working outdoors for extended periods",
  "Basic note-taking and reporting discipline",
  "Respect for cultural heritage and local customs",
];

export function VolunteerDetailPage({
  volunteer,
  userId,
}: VolunteerDetailPageProps) {
  if (!volunteer) {
    return <EmptyPost />;
  }

  const prefersReducedMotion = useReducedMotion();

  const totalCapacity = volunteer.roles.reduce(
    (sum, role) => sum + role.capacity,
    0,
  );

  const primaryRole = volunteer.roles.reduce((a, b) =>
    a.displayOrder < b.displayOrder ? a : b,
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
              <div className="px-8 pb-8">
                <AvailableRolesSection roles={volunteer.roles} />
              </div>
            </motion.article>

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
            >
              <OrganizerCard volunteer={volunteer} />
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
            <ApplicationSummary
              volunteer={volunteer}
              totalCapacity={totalCapacity}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
