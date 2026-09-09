import { useMemo, useState } from "react";
import { LayoutGrid, Map, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  EventExhibitorCard,
  EventExhibitorProfile,
} from "~/features/events/components/event-exhibitor-card";
import { EventFloorPlan } from "~/features/events/components/event-floor-plan";
import {
  getExhibitorCategory,
  getExhibitorId,
  getExhibitorName,
  readString,
} from "~/features/events/lib/public-event-data";
import type {
  PublicEventExhibitor,
  PublicEventExhibitorCategory,
  PublicEventFloorPlanPhoto,
} from "~/features/events/lib/public-event-data";

const PAGE_SIZE = 12;

export function EventExhibitors({
  exhibitors,
  categories,
  floorPlanPhotos,
}: {
  exhibitors: PublicEventExhibitor[];
  categories: PublicEventExhibitorCategory[];
  floorPlanPhotos: PublicEventFloorPlanPhoto[];
}) {
  const [view, setView] = useState<"list" | "floor-plan">("list");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PublicEventExhibitor | null>(null);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return exhibitors.filter((exhibitor) => {
      const category = getExhibitorCategory(exhibitor);
      const exhibitorCategoryId = category
        ? readString(category, "id", "uuid")
        : readString(exhibitor, "categoryId");
      const categoryName = category
        ? readString(category, "name", "title")
        : null;
      const matchesCategory =
        categoryId === "ALL" || exhibitorCategoryId === categoryId;
      const matchesQuery =
        !normalizedQuery ||
        getExhibitorName(exhibitor).toLowerCase().includes(normalizedQuery) ||
        categoryName?.toLowerCase().includes(normalizedQuery);
      return matchesCategory && Boolean(matchesQuery);
    });
  }, [categoryId, exhibitors, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleExhibitors = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section aria-labelledby="event-exhibitors-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="event-exhibitors-heading"
          className="text-[26px] font-extrabold text-[#1A1A2E]"
        >
          Exhibitors
        </h2>
        {floorPlanPhotos.length > 0 && (
          <div className="flex rounded-lg bg-[#F3F4F6] p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold transition-colors",
                view === "list"
                  ? "bg-white text-[#1C5DD4] shadow-sm"
                  : "text-[#9A9AB0]",
              )}
            >
              <LayoutGrid className="size-4" aria-hidden /> List
            </button>
            <button
              type="button"
              onClick={() => setView("floor-plan")}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold transition-colors",
                view === "floor-plan"
                  ? "bg-white text-[#1C5DD4] shadow-sm"
                  : "text-[#9A9AB0]",
              )}
            >
              <Map className="size-4" aria-hidden /> Floor plan
            </button>
          </div>
        )}
      </div>

      {view === "floor-plan" ? (
        <div className="mt-7">
          <EventFloorPlan photos={floorPlanPhotos} />
        </div>
      ) : (
        <>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search exhibitors</span>
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9A9AB0]" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search exhibitors"
                className="h-11 rounded-[10px] border-[#E5E7EB] pl-9"
              />
            </label>
            {categories.length > 0 && (
              <select
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter exhibitors by category"
                className="h-11 min-w-48 cursor-pointer rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#1C5DD4]"
              >
                <option value="ALL">All categories</option>
                {categories.map((category, index) => {
                  const id = readString(category, "id", "uuid");
                  const name = readString(category, "name", "title");
                  return id && name ? (
                    <option key={id ?? index} value={id}>
                      {name}
                    </option>
                  ) : null;
                })}
              </select>
            )}
          </div>

          {visibleExhibitors.length > 0 ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleExhibitors.map((exhibitor, index) => (
                <EventExhibitorCard
                  key={getExhibitorId(exhibitor, index)}
                  exhibitor={exhibitor}
                  onSelect={() => setSelected(exhibitor)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-[14px] border border-dashed border-[#D5D8E0] py-12 text-center text-sm text-[#9A9AB0]">
              No exhibitors match your search.
            </p>
          )}

          {totalPages > 1 && (
            <div className="mt-7 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </Button>
              <span className="px-2 text-sm font-semibold text-[#9A9AB0]">
                {currentPage} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <EventExhibitorProfile
        exhibitor={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </section>
  );
}
