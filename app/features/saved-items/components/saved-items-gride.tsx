import { Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { CategoriesPicker } from "~/features/forum/types";
import type { QuestionResponse } from "~/types/api-client";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import { OpportunityCard } from "~/components/opportunity-card";
import QuestionCard from "~/features/forum/components/card/question-card";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import type { FilterId } from "../types";

type SavedCardItem =
  | { type: "forum"; data: QuestionResponse }
  | { type: "volunteer"; data: Opportunity }
  | { type: "launchpad"; data: LaunchpadOpportunity };

interface SavedGridProps {
  activeFilter: FilterId;
  savedForums: QuestionResponse[];
  savedVolunteers: Opportunity[];
  savedLaunchpads: LaunchpadOpportunity[];
  categories?: CategoriesPicker[];
  isLoading?: boolean;
}

const itemAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

const MASONRY_COLUMNS_CLASS = "columns-1 gap-6 sm:columns-2 xl:columns-3";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5">
      <div className="mb-3 h-40 rounded-xl bg-slate-100" />
      <div className="mb-2 h-4 w-3/4 rounded bg-slate-100" />
      <div className="mb-4 h-3 w-full rounded bg-slate-100" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-100" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className={MASONRY_COLUMNS_CLASS}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={`skel-${i}`} className="mb-6 break-inside-avoid">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ activeFilter }: { activeFilter: FilterId }) {
  const label = activeFilter === "all" ? "items" : activeFilter;

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Tag className="mx-auto mb-4 size-10 text-slate-300" />
      <p className="text-base font-semibold text-slate-700">
        No saved {label} yet.
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Saved content will appear here after you bookmark it.
      </p>
    </div>
  );
}

function CardRenderer({
  item,
  categories,
  onOpenOpportunity,
}: {
  item: SavedCardItem;
  categories: CategoriesPicker[];
  onOpenOpportunity: (item: LaunchpadOpportunity) => void;
}) {
  switch (item.type) {
    case "forum":
      return <QuestionCard question={item.data} categories={categories} />;
    case "volunteer":
      return (
        <OpportunityCard
          opportunity={item.data}
          onMutationComplete={() => {}}
        />
      );
    case "launchpad":
      return (
        <LaunchpadProjectCard
          item={item.data}
          onOpenOpportunity={onOpenOpportunity}
        />
      );
  }
}

export default function SavedItemsGrid({
  activeFilter,
  savedForums,
  savedVolunteers,
  savedLaunchpads,
  categories = [],
  isLoading = false,
}: SavedGridProps) {
  const navigate = useNavigate();

  const onOpenOpportunity = useCallback(
    (item: LaunchpadOpportunity) => {
      navigate(`/launchpad/detail/${item.id}`);
    },
    [navigate],
  );

  const allItems = useMemo(() => {
    const items: SavedCardItem[] = [];

    if (activeFilter === "all" || activeFilter === "forum") {
      savedForums.forEach((q) => items.push({ type: "forum", data: q }));
    }
    if (activeFilter === "all" || activeFilter === "volunteer") {
      savedVolunteers.forEach((o) =>
        items.push({ type: "volunteer", data: o }),
      );
    }
    if (activeFilter === "all" || activeFilter === "launchpad") {
      savedLaunchpads.forEach((p) =>
        items.push({ type: "launchpad", data: p }),
      );
    }

    return items;
  }, [activeFilter, savedForums, savedVolunteers, savedLaunchpads]);

  if (isLoading) {
    return <SkeletonGrid />;
  }

  if (allItems.length === 0) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <EmptyState activeFilter={activeFilter} />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.div layout className={MASONRY_COLUMNS_CLASS}>
        {allItems.map((item, idx) => (
          <motion.div
            key={`${item.type}-${item.data.id}`}
            layout
            {...itemAnim}
            animate={{
              ...itemAnim.animate,
              transition: { ...itemAnim.transition, delay: 0.03 * idx },
            }}
            className="mb-6 break-inside-avoid"
          >
            <CardRenderer
              item={item}
              categories={categories}
              onOpenOpportunity={onOpenOpportunity}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
