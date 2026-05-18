import { motion, useReducedMotion } from "motion/react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import BackToButton from "~/components/back-to-button";
import { VolunteerAvailableOpportunities } from "../page/section/volunteer-available-opportunities";
import { volunteerLoader } from "~/routes/api/volunteer/volunteer-loader";
import { CategoryCard } from "~/components/category-card";
import { useState } from "react";
import { volunteerAction } from "~/routes/api/volunteer/volunteer-action";

export const loader = volunteerLoader;
export const action = volunteerAction;

export function meta() {
  return [{ title: "All Volunteer Opportunities | True Khmer" }];
}

export default function VolunteerAllPage() {
  const { categories, userId, locations, opportunities } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;
  const activeCategoryId = searchParams.get("categoryId") || undefined;
  const activeLocationId = searchParams.get("locationId") || undefined;
  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";
  const filteredOpportunities =
    (fetcher.data?.opportunities as typeof opportunities) ?? opportunities;

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const activeLocation = locations?.find((l) => l.id === activeLocationId);
  const reloadOpportunities = useCallback(() => {
    fetcher.load(`/volunteer/all?${searchParams.toString()}`);
  }, [fetcher, searchParams]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params, { replace: true });
    fetcher.load(`/volunteer/all?${params.toString()}`);
  };

  const handleLocationChange = (locationId: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (locationId) {
      params.set("locationId", locationId);
    } else {
      params.delete("locationId");
    }
    setSearchParams(params, { replace: true });
    fetcher.load(`/volunteer/all?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.08,
          }}
        >
          <h1 className="text-3xl font-bold">All Volunteer</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
        >
          <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center md:gap-5">
            <div className="flex min-h-11 flex-1 items-center rounded-xl border border-[#e2e8f0] bg-white px-0 py-0">
              <Search className="ml-4 mr-2.5 size-[17.5px] shrink-0 text-[#99a1af]" />
              <Input
                type="search"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchValue);
                  }
                }}
                placeholder="Search opportunities..."
                className="h-8 mr-2 border-0 bg-transparent px-0 py-0 text-sm font-medium text-[#364153] placeholder:font-normal placeholder:text-[#99a1af] focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <button
                type="button"
                onClick={() => handleSearch(searchValue)}
                className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Search className="size-4" />
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-11 items-center justify-between gap-1.5 rounded-xl border border-[#e2e8f0] bg-white px-4 text-sm font-medium text-[#364153] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-52">
                {activeLocation?.name || "All Locations"}
                <ChevronDown className="size-4 shrink-0 text-[#364153]/65" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  onClick={() => handleLocationChange(undefined)}
                  className={!activeLocationId ? "font-semibold" : ""}
                >
                  All Locations
                </DropdownMenuItem>
                {locations?.map((loc) => (
                  <DropdownMenuItem
                    key={loc.id}
                    onClick={() => handleLocationChange(loc.id)}
                    className={
                      activeLocationId === loc.id ? "font-semibold" : ""
                    }
                  >
                    {loc.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {categories && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: prefersReducedMotion ? 0 : 0.2 }}
          >
            <div className="w-full flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:px-0 lg:grid-cols-4 xl:grid-cols-6">
              {categories?.map((v) => (
                <div
                  key={v.id}
                  className="shrink-0 snap-start md:min-w-0 md:shrink md:w-full cursor-pointer"
                >
                  <CategoryCard
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      if (v.id === activeCategoryId) {
                        params.delete("categoryId");
                      } else {
                        params.set("categoryId", v.id);
                      }
                      setSearchParams(params, { replace: true });
                      fetcher.load(`/volunteer/all?${params.toString()}`);
                    }}
                    active={v.id === activeCategoryId}
                    category={{
                      ...v,
                      displayOrder: v.opportunityCount,
                      updatedBy: v.updatedBy ?? undefined,
                    }}
                    displayName={
                      (v?.opportunityCount || 0) > 1 ? "listings" : "listing"
                    }
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.24 }}
        >
          <VolunteerAvailableOpportunities
            showHeader={false}
            className="w-full px-0 py-0 md:px-0 lg:px-0"
            opportunities={filteredOpportunities ?? []}
            isLoading={isLoading}
            onMutationComplete={reloadOpportunities}
          />
        </motion.div>
      </div>
    </main>
  );
}
