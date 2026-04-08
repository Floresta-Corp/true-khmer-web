import { AvailableOpportunities } from "../page/section/available-opportunities";
import { VolunteerCategoriesSection } from "../page/section/volunteer-categories-section";
import { motion, useReducedMotion } from "motion/react";
import VolunteerHeader from "../page/section/volunteer-header";
import { volunteerLoader } from "~/routes/api/volunteer/volunteerLoader";
import { useLoaderData } from "react-router";

export const loader = volunteerLoader;

export default function VolunteerPage() {
  const { categories } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  console.log(categories);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0 }}
      >
        <VolunteerHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
        className="lg:pt-17.5"
      >
        <VolunteerCategoriesSection categories={categories?.categories || []} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
      >
        <AvailableOpportunities />
      </motion.div>
    </div>
  );
}
