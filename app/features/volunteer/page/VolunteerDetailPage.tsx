import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { VolunteerPost } from "~/lib/post";
import EmptyPost from "../components/EmptyPost";
import BackToVolunteerButton from "../components/BackToVolunteerButton";
import OpportunityCover from "../components/sections/OpportunityCover";
import OpportunityDetailsGrid from "../components/sections/OpportunityDetailsGrid";
import ProjectOverviewSection from "../components/sections/ProjectOverviewSection";
import AvailableRolesSection from "../components/sections/AvailableRolesSection";
import BenefitsSection from "../components/sections/BenefitsSection";
import ProjectImpactSection from "../components/sections/ProjectImpactSection";
import OrganizerCard from "../components/sections/OrganizerCard";
import ApplicationSummary from "../components/sections/ApplicationSummary";

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

interface VolunteerDetailPageProps {
  opportunityId?: string;
  volunteer?: VolunteerPost;
}

export function VolunteerDetailPage({ volunteer }: VolunteerDetailPageProps) {
  if (!volunteer) {
    return <EmptyPost />;
  }

  const prefersReducedMotion = useReducedMotion();

  const roles =
    volunteer?.availableRoles?.length > 0
      ? volunteer.availableRoles
      : [
          {
            id: 1,
            title: "Temple Restoration Support",
            commitment: "Full week",
            spotLeft: 3,
            responsibilities,
            requirements,
          },
        ];

  const primaryRole = roles[0];

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
          <BackToVolunteerButton />
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex min-w-0 flex-col gap-4 md:gap-8">
            {/* Cover Section */}
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
                <AvailableRolesSection roles={roles} />
              </div>
            </motion.article>

            {/* Benefits Section */}
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

            {/* Impact Section */}
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

            {/* Organizer Card */}
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

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <ApplicationSummary volunteer={volunteer} role={primaryRole} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
