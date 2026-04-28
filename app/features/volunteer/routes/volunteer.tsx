import { VolunteerAvailableOpportunities } from "../page/section/volunteer-available-opportunities";
import { VolunteerCategoriesSection } from "../page/section/volunteer-categories-section";
import { motion, useReducedMotion } from "motion/react";
import VolunteerHeader from "../page/section/volunteer-header";
import { volunteerLoader } from "~/routes/api/volunteer/volunteer-loader";
import { useLoaderData } from "react-router";

export const loader = volunteerLoader;

export default function VolunteerPage() {
  const { categories, opportunities, locations } =
    useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0 }}
      >
        <VolunteerHeader locations={locations?.locations || []} />
      </motion.div>

      {categories?.categories && categories.categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="lg:pt-17.5"
        >
          <VolunteerCategoriesSection
            categories={categories?.categories || []}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
      >
        <VolunteerAvailableOpportunities
          opportunities={opportunities?.opportunities ?? []}
          categories={categories?.categories ?? []}
        />
      </motion.div>
    </div>
  );
}
