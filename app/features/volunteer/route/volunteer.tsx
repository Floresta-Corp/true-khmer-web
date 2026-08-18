import { VolunteerAvailableOpportunities } from "../components/pages/section/volunteer-available-opportunities";
import { VolunteerCategoriesSection } from "../components/pages/section/volunteer-categories-section";
import { motion, useReducedMotion } from "motion/react";
import VolunteerHeader from "../components/pages/section/volunteer-header";
import { volunteerLoader } from "~/features/volunteer/services/volunteer-loader";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { volunteerAction } from "~/features/volunteer/services/volunteer-action";

export const loader = volunteerLoader;
export const action = volunteerAction;

export function meta() {
  return [{ title: "Volunteer Opportunities | True Khmer" }];
}

export default function VolunteerPage() {
  const { categories, opportunities, locations, pagination } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.24;
  const sectionDelay = prefersReducedMotion ? 0 : 0.03;
  const reloadOpportunities = () => revalidator.revalidate();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: "easeOut" as const }}
      className="min-h-screen bg-gray-50"
    >
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0, ease: "easeOut" as const }}
        className="will-change-transform"
      >
        <VolunteerHeader locations={locations || []} />
      </motion.div>

      {categories && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: sectionDelay,
            ease: "easeOut" as const,
          }}
          className="will-change-transform lg:pt-17.5"
        >
          <VolunteerCategoriesSection
            categories={categories || []}
            onClickCategory={(v) => {
              navigate(`/volunteer/all?categoryId=${v}`);
            }}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration,
          delay: sectionDelay * 2,
          ease: "easeOut" as const,
        }}
        className="will-change-transform"
      >
        <VolunteerAvailableOpportunities
          className="w-full bg-gray-50 py-10"
          containerClassName="site-container"
          opportunities={opportunities ?? []}
          pagination={pagination}
          onMutationComplete={() => reloadOpportunities()}
        />
      </motion.div>
    </motion.main>
  );
}
