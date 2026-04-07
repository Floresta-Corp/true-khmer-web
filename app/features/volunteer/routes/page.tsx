import { AvailableOpportunities } from "../page/section/AvailableOpportunities";
import { BrowseCategories } from "../page/section/BrowseCategories";
import { motion, useReducedMotion } from "motion/react";

import VolunteerHeader from "../page/section/VolunteerHeader";

export default function VolunteerPage() {
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

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
        <BrowseCategories />
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
