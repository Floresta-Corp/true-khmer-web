import { useLoaderData, useSearchParams } from "react-router";
import SavedItemsSidebar from "../saved-items-sidebar";
import type { loader } from "../../routes/saved-items";
import type { FilterId } from "../saved-item-filter";
import type { Question } from "~/services/forum/forum-types";
import type { Opportunity } from "~/services/volunteer/volunteer-types";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";
import SavedItemsGrid from "../saved-items-gride";

const VALID_FILTERS: FilterId[] = [
  "all",
  "forum",
  "volunteer",
  "launchpad",
  "event",
];

export default function SaveItemPage() {
  const { saveItem } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Clean & safe filter extraction
  const rawFilter = searchParams.get("filter");
  const activeFilter = VALID_FILTERS.includes(rawFilter as FilterId)
    ? (rawFilter as FilterId)
    : "all";

  const handleFilterChange = (id: FilterId) => {
    const params = new URLSearchParams(searchParams);
    if (id === "all") {
      params.delete("filter");
    } else {
      params.set("filter", id);
    }
    setSearchParams(params, { replace: true });
  };

  // 2. Single-pass categorization (No more triple .filter().map() loops)
  const forums: Question[] = [];
  const volunteers: Opportunity[] = [];
  const launchpads: LaunchpadOpportunity[] = [];

  for (const saved of saveItem) {
    if (saved.type === "forum") {
      // Cast to unknown first to clear the slate for TypeScript
      forums.push(saved.item as unknown as Question);
    } else if (saved.type === "volunteer") {
      volunteers.push(saved.item as unknown as Opportunity);
    } else if (saved.type === "project") {
      launchpads.push(saved.item as unknown as LaunchpadOpportunity);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:pt-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          <SavedItemsSidebar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={{
              all: saveItem.length,
              forum: forums.length,
              event: 0,
              volunteer: volunteers.length,
              launchpad: launchpads.length,
            }}
          />

          <main className="min-w-0 flex-1">
            <div className="mb-10 lg:mb-16">
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
                Saved Items
              </h1>
              <p className="text-[15px] font-medium text-slate-500 sm:text-base">
                Managing all your saved items across the platform.
              </p>
            </div>

            <SavedItemsGrid
              activeFilter={activeFilter}
              savedForums={forums}
              savedVolunteers={volunteers}
              savedLaunchpads={launchpads}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
