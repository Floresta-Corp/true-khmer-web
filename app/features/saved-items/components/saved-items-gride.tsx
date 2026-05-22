import { Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { CategoriesPicker, Question } from "~/services/forum/forum-types";
import type { Opportunity } from "~/services/volunteer/volunteer-types";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";
import type { FilterId } from "./saved-item-filter";
import { OpportunityCard } from "~/components/opportunity-card";
import QuestionCard from "~/features/forum/components/card/question-card";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import { useCallback } from "react";
import { useNavigate } from "react-router";

interface SavedGridProps {
  activeFilter: FilterId;
  savedForums: Question[];
  savedVolunteers: Opportunity[];
  savedLaunchpads: LaunchpadOpportunity[];
  categories?: CategoriesPicker[];
}

function EmptyState({ activeFilter }: { activeFilter: FilterId }) {
  const label = activeFilter === "all" ? "items" : activeFilter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center"
    >
      <Tag className="mx-auto mb-4 size-10 text-slate-300" />
      <p className="text-base font-semibold text-slate-700">
        No saved {label} yet.
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Saved content will appear here after you bookmark it.
      </p>
    </motion.div>
  );
}

export default function SavedItemsGrid({
  activeFilter,
  savedForums,
  savedVolunteers,
  savedLaunchpads,
  categories,
}: SavedGridProps) {
  const showForum = activeFilter === "all" || activeFilter === "forum";
  const showVolunteer = activeFilter === "all" || activeFilter === "volunteer";
  const showLaunchpad = activeFilter === "all" || activeFilter === "launchpad";
  const visibleCount =
    (showForum ? savedForums.length : 0) +
    (showVolunteer ? savedVolunteers.length : 0) +
    (showLaunchpad ? savedLaunchpads.length : 0);

  if (visibleCount === 0) {
    return <EmptyState activeFilter={activeFilter} />;
  }
  const navigate = useNavigate();
  const onOpenOpportunity = useCallback(
    (item: LaunchpadOpportunity) => {
      navigate(`/launchpad/detail/${item.id}`);
    },
    [navigate],
  );

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={activeFilter}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {showForum &&
          savedForums.map((question) => (
            <motion.div
              key={`forum-${question.id}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <QuestionCard question={question} categories={categories ?? []} />
            </motion.div>
          ))}

        {showVolunteer &&
          savedVolunteers.map((opportunity) => (
            <motion.div
              key={`volunteer-${opportunity.id}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <OpportunityCard
                opportunity={opportunity}
                onMutationComplete={() => {}}
              />
            </motion.div>
          ))}

        {showLaunchpad &&
          savedLaunchpads.map((project) => (
            <motion.div
              key={`launchpad-${project.id}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <LaunchpadProjectCard
                key={project.id}
                item={project}
                onOpenOpportunity={onOpenOpportunity}
              />
            </motion.div>
          ))}
      </motion.div>
    </AnimatePresence>
  );
}
