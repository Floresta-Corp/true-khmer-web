import { motion, useReducedMotion } from "motion/react";
import LaunchpadHeaderSection from "../components/section/launchpad-header-section";
import { LaunchpadBrowseCategoriesSection } from "../components/section/launchpad-browse-categories-section";
import { LaunchpadAvailableProjectsSection } from "../components/section/launchpad-available-project-section";
import { launchpadLoader } from "../services/launchpad.loader";
import type { Route } from "./+types/launchpad";
import { useLoaderData, useNavigate } from "react-router";

export const loader = launchpadLoader;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Launchpad - True Khmer" },
    {
      name: "description",
      content:
        "Discover and join exciting projects on the True Khmer Launchpad.",
    },
  ];
}

export default function LaunchpadPage() {
  const { categories } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;
  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0 }}
        className="will-change-transform"
      >
        <LaunchpadHeaderSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
      >
        <LaunchpadBrowseCategoriesSection
          categories={categories || []}
          showAllCategory
          onClickCategory={(v) => {
            navigate(
              v
                ? `/launchpad/all?categoryId=${encodeURIComponent(v)}`
                : "/launchpad/all",
            );
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
      >
        <LaunchpadAvailableProjectsSection />
      </motion.div>
    </div>
  );
}
