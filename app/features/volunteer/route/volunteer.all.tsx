import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Input } from "~/components/ui/input";
import { VolunteerAvailableOpportunities } from "../components/pages/section/volunteer-available-opportunities";
import { volunteerLoader } from "~/features/volunteer/services/volunteer-loader";
import { volunteerAction } from "~/features/volunteer/services/volunteer-action";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio";
import { cn } from "~/lib/utils";
import BackToButton from "~/components/back-to-button";

export const loader = volunteerLoader;
export const action = volunteerAction;

const SORT_OPTIONS = [
  { value: "recent", label: "Recently added" },
  { value: "soon", label: "Starting soon" },
  { value: "spots", label: "Most spots available" },
] as const;

const COMMITMENT_OPTIONS = ["Light", "Regular", "Intensive"] as const;

export function meta() {
  return [{ title: "All Volunteer Opportunities | True Khmer" }];
}

export default function VolunteerAllPage() {
  const { categories, userId, locations, opportunities, pagination } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.24;
  const sectionDelay = prefersReducedMotion ? 0 : 0.03;
  const activeCategoryId = searchParams.get("categoryId") || undefined;
  const activeLocationId = searchParams.get("locationId") || undefined;
  const activeCommitmentLabel =
    searchParams.get("commitmentLabel") || undefined;
  const activeSort = searchParams.get("sort") || "recent";
  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";
  const filteredPagination =
    (fetcher.data?.pagination as typeof pagination) ?? pagination;
  const filteredOpportunities =
    (fetcher.data?.opportunities as typeof opportunities) ?? opportunities;

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const [showAllLocations, setShowAllLocations] = useState(false);
  const ALL_SECTIONS = ["sort-by", "cause-area", "location", "time-commitment"];
  const [openFilterSections, setOpenFilterSections] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1023px)").matches
      ? []
      : ALL_SECTIONS,
  );
  useEffect(() => {
    const mediaQueryList = window.matchMedia("(max-width: 1023px)");
    const onChange = () =>
      setOpenFilterSections(mediaQueryList.matches ? [] : ALL_SECTIONS);
    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, []);

  const locationCount = locations?.length ?? 0;
  const visibleLocations = showAllLocations
    ? (locations ?? [])
    : (locations ?? []).slice(0, 4);

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const visibleOpportunities = useMemo(() => {
    const items = [...(filteredOpportunities ?? [])].filter((opportunity) => {
      if (!activeCommitmentLabel) {
        return true;
      }

      return opportunity.commitmentLabel === activeCommitmentLabel;
    });

    if (activeSort === "soon") {
      return items.sort((left, right) => {
        return (
          new Date(left.applicationDeadline).getTime() -
          new Date(right.applicationDeadline).getTime()
        );
      });
    }

    if (activeSort === "spots") {
      return items.sort((left, right) => {
        const leftRemaining = left.capacity - left.applicationCount;
        const rightRemaining = right.capacity - right.applicationCount;
        return rightRemaining - leftRemaining;
      });
    }

    return items.sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    );
  }, [filteredOpportunities, activeCommitmentLabel, activeSort]);

  const searchQuery = (searchParams.get("search") || searchValue).trim();
  const resultsLabel = searchQuery
    ? `Found ${visibleOpportunities.length} opportunities for "${searchQuery}"`
    : `Found ${visibleOpportunities.length} opportunities`;

  const reloadOpportunities = useCallback(() => {
    fetcher.load(`/volunteer/all?${searchParams.toString()}`);
  }, [fetcher, searchParams]);

  const loadWithParams = (params: URLSearchParams) => {
    setSearchParams(params, { replace: true });
    const query = params.toString();
    fetcher.load(query ? `/volunteer/all?${query}` : "/volunteer/all");
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    const currentSearch = searchValue.trim();
    if (currentSearch) {
      params.set("search", currentSearch);
    } else {
      params.delete("search");
    }
    loadWithParams(params);
  };

  const handleLocationChange = (locationId: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (locationId) {
      params.set("locationId", locationId);
    } else {
      params.delete("locationId");
    }
    loadWithParams(params);
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }
    loadWithParams(params);
  };

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortValue) {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }
    loadWithParams(params);
  };

  const handleCommitmentChange = (commitmentLabel: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (commitmentLabel) {
      params.set("commitmentLabel", commitmentLabel);
    } else {
      params.delete("commitmentLabel");
    }
    loadWithParams(params);
  };

  const handleClearAll = () => {
    setSearchValue("");
    setShowAllLocations(false);
    const params = new URLSearchParams();
    loadWithParams(params);
  };

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: 0, ease: "easeOut" as const }}
          className="will-change-transform"
        >
          <BackToButton to={"/volunteer"} text="Back to Opportunities" />
        </motion.div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: sectionDelay,
              ease: "easeOut" as const,
            }}
            className="space-y-2 will-change-transform"
          >
            <h1 className="text-[clamp(1.9rem,3vw,2.5rem)] leading-tight font-bold text-[#020618]">
              Volunteer Opportunities
            </h1>
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration,
                delay: sectionDelay,
                ease: "easeOut" as const,
              }}
              className="text-sm font-medium text-[#64748b] sm:text-[15px]"
            >
              {resultsLabel}
            </motion.p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: sectionDelay,
              ease: "easeOut" as const,
            }}
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
            className="flex w-full max-w-md items-center rounded-full border border-[#e2e8f0] bg-white px-3 shadow-[0px_1px_2px_rgba(15,23,42,0.04)] will-change-transform lg:w-md"
          >
            <Search className="mr-2.5 ml-1 size-[17.5px] shrink-0 text-[#94a3b8]" />
            <Input
              type="search"
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
              placeholder="Search opportunities..."
              className="h-11 border-0 bg-transparent px-0 text-sm font-medium text-[#334155] placeholder:font-normal placeholder:text-[#94a3b8] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </motion.form>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <motion.aside
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration,
              delay: sectionDelay * 2,
              ease: "easeOut" as const,
            }}
            className="rounded-[18px] border border-[#edf2f7] bg-white p-5 shadow-[0px_10px_30px_rgba(15,23,42,0.03)] will-change-transform"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-[#020618]">Filters</h2>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-[#2463eb] hover:text-[#1d4ed8]"
              >
                Clear all
              </button>
            </div>

            <Accordion
              type="multiple"
              value={openFilterSections}
              onValueChange={setOpenFilterSections}
              className="mt-1 gap-0"
            >
              <AccordionItem
                value="sort-by"
                className="border-b border-[#edf2f7]"
              >
                <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                  Sort by
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-4">
                  <RadioGroup
                    value={activeSort}
                    onValueChange={handleSortChange}
                    className="gap-3"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] transition-colors hover:text-[#020618]",
                          activeSort === option.value && "text-[#020618]",
                        )}
                      >
                        <RadioGroupItem
                          value={option.value}
                          className="border-[#cbd5e1]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="cause-area"
                className="border-b border-[#edf2f7]"
              >
                <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                  Cause area
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-4">
                  <RadioGroup
                    value={activeCategoryId || "all-categories"}
                    onValueChange={(value) =>
                      handleCategoryChange(
                        value === "all-categories" ? undefined : value,
                      )
                    }
                    className="gap-3"
                  >
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]">
                      <RadioGroupItem
                        value="all-categories"
                        className="border-[#cbd5e1]"
                      />
                      <span>All categories</span>
                    </label>
                    {categories?.map((category) => (
                      <label
                        key={category.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]",
                          activeCategoryId === category.id && "text-[#020618]",
                        )}
                      >
                        <RadioGroupItem
                          value={category.id}
                          className="border-[#cbd5e1]"
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="location"
                className="border-b border-[#edf2f7]"
              >
                <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                  Location
                </AccordionTrigger>
                <AccordionContent className="h-auto pt-1 pb-4">
                  <RadioGroup
                    value={activeLocationId || "all-locations"}
                    onValueChange={(value) =>
                      handleLocationChange(
                        value === "all-locations" ? undefined : value,
                      )
                    }
                    className="gap-3"
                  >
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]">
                      <RadioGroupItem
                        value="all-locations"
                        className="border-[#cbd5e1]"
                      />
                      <span>All locations</span>
                    </label>
                    {visibleLocations.map((location) => (
                      <label
                        key={location.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]",
                          activeLocationId === location.id && "text-[#020618]",
                        )}
                      >
                        <RadioGroupItem
                          value={location.id}
                          className="border-[#cbd5e1]"
                        />
                        <span>{location.name}</span>
                      </label>
                    ))}
                  </RadioGroup>

                  {locationCount > 4 && (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setShowAllLocations((current) => !current)}
                      className="mt-3 cursor-pointer text-xs font-semibold text-[#2463eb] hover:text-[#1d4ed8]"
                    >
                      {showAllLocations ? "Show less" : "Show more"}
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="time-commitment">
                <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                  Time commitment
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-1">
                  <RadioGroup
                    value={activeCommitmentLabel || "all-commitment"}
                    onValueChange={(value) =>
                      handleCommitmentChange(
                        value === "all-commitment" ? undefined : value,
                      )
                    }
                    className="gap-3"
                  >
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]">
                      <RadioGroupItem
                        value="all-commitment"
                        className="border-[#cbd5e1]"
                      />
                      <span>All commitment levels</span>
                    </label>
                    {COMMITMENT_OPTIONS.map((commitment) => (
                      <label
                        key={commitment}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]",
                          activeCommitmentLabel === commitment &&
                            "text-[#020618]",
                        )}
                      >
                        <RadioGroupItem
                          value={commitment}
                          className="border-[#cbd5e1]"
                        />
                        <span>{commitment}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: sectionDelay * 3,
              ease: "easeOut" as const,
            }}
            className="min-w-0 will-change-transform"
          >
            <VolunteerAvailableOpportunities
              showHeader={false}
              className="w-full bg-transparent px-0 py-0"
              opportunities={visibleOpportunities}
              pagination={filteredPagination}
              isLoading={isLoading}
              onMutationComplete={reloadOpportunities}
            />
          </motion.section>
        </div>
      </div>
    </main>
  );
}
