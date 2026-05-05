import { motion, useReducedMotion } from "motion/react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import BackToButton from "~/components/back-to-button";
import { VolunteerCategoriesSection } from "../page/section/volunteer-categories-section";
import { volunteerLoader } from "~/routes/api/volunteer/volunteer-loader";

export const loader = volunteerLoader;

export default function VolunteerAllPage() {
  const { categories, userId, locations, opportunities } =
    useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
          }}
        >
          <BackToButton to={"/volunteer"} />
        </motion.div>

        {categories && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
            className="lg:pt-17.5"
          >
            <VolunteerCategoriesSection
              categories={categories || []}
              onClickCategory={(v) => {
                navigate(`/volunteer/all?categoryId=${v}`);
              }}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
