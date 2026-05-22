import { useLoaderData, useSearchParams } from "react-router";
import type { FilterId } from "../saved-item-filter";
import SavedItemsGrid from "../saved-items-gride";
import SavedItemsSidebar from "../saved-items-sidebar";
import type { loader } from "../../routes/saved-items";

export default function SaveItemPage() {
  const { forums, volunteers, launchpads } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const allowed: FilterId[] = [
    "all",
    "forum",
    "volunteer",
    "launchpad",
    "event",
  ];
  const activeFilter: FilterId =
    typeParam && allowed.includes(typeParam as FilterId)
      ? (typeParam as FilterId)
      : "all";

  const handleFilterChange = (id: FilterId) => {
    setSearchParams({ type: id });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:pt-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          <SavedItemsSidebar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={{
              all: forums.length + volunteers.length + launchpads.length,
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
