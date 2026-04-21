import { motion, useReducedMotion } from "framer-motion";
import type { VolunteerPost } from "~/lib/post";
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
import type { Opportunity } from "~/services/volunteer/types";

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
  volunteer?: Opportunity;
}

export function VolunteerDetailPage({ volunteer }: VolunteerDetailPageProps) {
  if (!volunteer) {
    return <EmptyPost />;
  }

  const prefersReducedMotion = useReducedMotion();

  const adaptedVolunteer: VolunteerPost = {
    id: Number(volunteer.id) || 0,
    title: volunteer.title,
    status: volunteer.status,
    location: volunteer.location.name,
    commitment: volunteer.commitmentLabel,
    duration: volunteer.durationLabel,
    applicants: 0,
    totalApplicants:
      volunteer.roles?.reduce((sum, role) => sum + role.capacity, 0) ?? 0,
    deadline: volunteer.applicationDeadline,
    overview: volunteer.overview,
    availableRoles:
      volunteer.roles?.map((role, index) => ({
        id: index + 1,
        title: role.title,
        commitment: role.commitmentLabel,
        spotLeft: role.capacity,
        responsibilities: role.responsibilities,
        requirements: role.requirements,
      })) ?? [],
    benefits: volunteer.benefits,
    projectImpact: volunteer.communityImpact ?? "",
    createdBy: {
      profile: {
        name: volunteer.organizer.name,
        status: "ORGANIZER",
        isVerified: true,
        imageUrl: volunteer.organizer.avatarUrl ?? "",
      },
      details: {
        website: volunteer.organizer.contact.websiteUrl ?? "",
        opportunitiesCount: String(volunteer.organizer.opportunityCount),
        location: volunteer.location.name,
      },
    },
  };

  const roles =
    adaptedVolunteer.availableRoles.length > 0
      ? adaptedVolunteer.availableRoles
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
          <BackToButton
            text="Back to Volunteer Opportunities"
            to="/volunteer"
          />
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
              <OpportunityCover volunteer={adaptedVolunteer} />
              <div className="px-8">
                <OpportunityDetailsGrid volunteer={adaptedVolunteer} />
              </div>
              <div className="px-8 pb-8">
                <ProjectOverviewSection volunteer={adaptedVolunteer} />
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
              <BenefitsSection volunteer={adaptedVolunteer} />
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
              <ProjectImpactSection volunteer={adaptedVolunteer} />
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
              <OrganizerCard volunteer={adaptedVolunteer} />
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
            <ApplicationSummary
              volunteer={adaptedVolunteer}
              role={primaryRole}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
