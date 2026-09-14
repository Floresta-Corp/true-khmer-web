import { Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import type { CategoriesPicker } from "~/features/forum/types";
import type { QuestionResponse } from "~/types/api-client";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import { OpportunityCard } from "~/components/opportunity-card";
import QuestionCard from "~/features/forum/components/card/question-card";
import LaunchpadProjectCard from "~/features/launchpad/components/card/launchpad-project-card";
import { CourseCard } from "~/features/education/components/course-card";
import { EventListCard } from "~/features/events/components/event-list-card";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import type { PublicCourseListItem } from "~/api/education/education.server";
import { EventListItemSchema } from "~/features/events/types/events";
import SavedItemCard from "./saved-item-card";
import type { FilterId, SavedItemCard as SavedItemCardData } from "../types";

interface SavedGridProps {
  activeFilter: FilterId;
  items: SavedItemCardData[];
  removingIds?: Set<string>;
  onUnsave: (item: SavedItemCardData) => void;
  categories?: CategoriesPicker[];
  userId?: string;
  isLoading?: boolean;
}

const itemAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

// Default (stretch) alignment, so every card in a row takes the row's height.
// `[&>*]:h-full` on the cell makes the card itself fill it even when its own
// root does not set a height — the forum card, for one, does not.
const GRID_CLASS =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const GRID_CELL_CLASS = "h-full [&>*]:h-full";

const EMPTY_LABELS: Record<FilterId, string> = {
  all: "items",
  forum: "forum questions",
  volunteer: "volunteer opportunities",
  project: "projects",
  course: "courses",
  event: "events",
};

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
    <div className={GRID_CLASS}>
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={`skel-${i}`} />
      ))}
    </div>
  );
}

function EmptyState({ activeFilter }: { activeFilter: FilterId }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Tag className="mx-auto mb-4 size-10 text-slate-300" />
      <p className="text-base font-semibold text-slate-700">
        No saved {EMPTY_LABELS[activeFilter]} yet.
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Saved content will appear here after you bookmark it.
      </p>
    </div>
  );
}

/**
 * Each row renders through its own domain card, so a saved question looks like
 * a question and a saved event like an event. The card comes from the `item`
 * payload the API hydrates; a row whose item could not be read falls back to
 * the generic card rather than disappearing.
 */
function CardRenderer({
  card,
  categories,
  userId,
  onUnsave,
  isRemoving,
  onOpenProject,
}: {
  card: SavedItemCardData;
  categories: CategoriesPicker[];
  userId?: string;
  onUnsave: (item: SavedItemCardData) => void;
  isRemoving?: boolean;
  onOpenProject: (item: LaunchpadOpportunity) => void;
}) {
  const fallback = (
    <SavedItemCard item={card} onUnsave={onUnsave} isRemoving={isRemoving} />
  );

  if (!card.item) return fallback;

  switch (card.type) {
    case "forum":
      return (
        <QuestionCard
          question={card.item as QuestionResponse}
          categories={categories}
          userId={userId}
        />
      );
    case "volunteer":
      return (
        <OpportunityCard
          opportunity={card.item as Opportunity}
          onMutationComplete={() => {}}
        />
      );
    case "project":
      return (
        <LaunchpadProjectCard
          item={card.item as LaunchpadOpportunity}
          onOpenOpportunity={onOpenProject}
        />
      );
    case "course":
      return (
        <CourseCard
          course={toCourseSummary(card.item as PublicCourseListItem)}
          isSaved
          onToggleSave={() => onUnsave(card)}
        />
      );
    case "event": {
      // The same card the /events hub renders — category pill, thumbnail,
      // bookmark — fed from the saved snapshot, which is shaped like a Plumpi
      // listing row so the events page's own parser applies.
      const parsed = EventListItemSchema.safeParse(card.item);
      if (!parsed.success) return fallback;
      return (
        <EventListCard
          event={parsed.data}
          isSaved
          onToggleSave={() => onUnsave(card)}
        />
      );
    }
    default:
      return fallback;
  }
}

export default function SavedItemsGrid({
  activeFilter,
  items,
  removingIds,
  onUnsave,
  categories = [],
  userId,
  isLoading = false,
}: SavedGridProps) {
  const navigate = useNavigate();

  const onOpenProject = useCallback(
    (item: LaunchpadOpportunity) => {
      navigate(`/launchpad/detail/${item.id}`);
    },
    [navigate],
  );

  if (isLoading) {
    return <SkeletonGrid />;
  }

  if (items.length === 0) {
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
    <AnimatePresence mode="popLayout" initial={true}>
      <motion.div layout className={GRID_CLASS}>
        {items.map((card, idx) => (
          <motion.div
            key={card.id}
            layout
            {...itemAnim}
            animate={{
              ...itemAnim.animate,
              transition: { ...itemAnim.transition, delay: 0.03 * idx },
            }}
            className={GRID_CELL_CLASS}
          >
            <CardRenderer
              card={card}
              categories={categories}
              userId={userId}
              onUnsave={onUnsave}
              isRemoving={removingIds?.has(card.id)}
              onOpenProject={onOpenProject}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
