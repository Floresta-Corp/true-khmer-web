import { VolunteerAvailableOpportunities } from "../page/section/volunteer-available-opportunities";
import { VolunteerCategoriesSection } from "../page/section/volunteer-categories-section";
import { motion, useReducedMotion } from "motion/react";
import VolunteerHeader from "../page/section/volunteer-header";
import { volunteerLoader } from "~/routes/api/volunteer/volunteer-loader";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import { volunteerAction } from "~/routes/api/volunteer/volunteer-action";

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
  const duration = prefersReducedMotion ? 0 : 0.35;
  const reloadOpportunities = () => revalidator.revalidate();

  console.log(opportunities, opportunities?.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0 }}
      >
        <VolunteerHeader locations={locations || []} />
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
      >
        <VolunteerAvailableOpportunities
          opportunities={opportunities ?? []}
          pagination={pagination}
          onMutationComplete={() => reloadOpportunities()}
        />
      </motion.div>
    </div>
  );
}
