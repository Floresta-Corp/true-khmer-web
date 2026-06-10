import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";
import { LaunchpadAvailableOpportunities } from "../components/section/launchpad-available-opportunities";
import BackToButton from "~/components/back-to-button";
import { motion, useReducedMotion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio";
import { cn } from "~/lib/utils";
import { LaunchpadLoader } from "~/routes/api/launchpad/launchpad-loader";
import { Button } from "~/components/ui/button";

export const loader = LaunchpadLoader;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "startingSoon", label: "Starting Soon" },
  { value: "mostSpotsAvailable", label: "Most Spots Available" },
] as const;

export function meta() {
  return [{ title: "All Projects | True Khmer Launchpad" }];
}

export default function LaunchpadAllPage() {
  const projectLaunchpad = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.3;
  const sectionDelay = prefersReducedMotion ? 0 : 0.03;
  const activeCategoryId = searchParams.get("categoryId");
  const activeLocationId = searchParams.get("cityId");
  const activeSort = searchParams.get("sortBy") || "newest";

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortValue) {
      params.set("sortBy", sortValue);
    } else {
      params.delete("sortBy");
    }
    params.delete("cursor");
    setSearchParams(params, { replace: true });
  };

  const handleCityChange = (cityId: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (cityId) {
      params.set("cityId", cityId);
    } else {
      params.delete("cityId");
    }
    params.delete("cursor");
    setSearchParams(params, { replace: true });
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    const currentSearch = searchValue.trim();
    if (currentSearch) {
      params.set("search", currentSearch);
    } else {
      params.delete("search");
    }
    params.delete("cursor");
    setSearchParams(params, { replace: true });
  };

  const handleCategoryClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }
    params.delete("cursor");
    setSearchParams(params, { replace: true });
  };

  const handleClearAll = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    setSearchParams(params, { replace: true });
  };

  const onOpenOpportunity = (item: LaunchpadOpportunity) => {
    navigate(`/launchpad/detail/${item.id}`);
  };

  const searchQuery = (searchParams.get("search") || "").trim();
  const resultsLabel = searchQuery
    ? `Found ${projectLaunchpad.projects.length} opportunities for "${searchQuery}"`
    : `Found ${projectLaunchpad.projects.length} opportunities`;

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: 0, ease: "easeOut" as const }}
          className="will-change-transform"
        >
          <BackToButton to={"/launchpad"} text="Back to Launchpad" />
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
            <h1 className="text-[clamp(1.9rem,3vw,2.5rem)] font-bold leading-tight text-[#020618]">
              All Projects
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
            className="flex w-full max-w-md items-center rounded-full border border-[#e2e8f0] bg-white px-3 shadow-[0px_1px_2px_rgba(15,23,42,0.04)] lg:w-md will-change-transform"
          >
            <Search className="ml-1 mr-2.5 size-[17.5px] shrink-0 text-[#94a3b8]" />
            <Input
              type="search"
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
              placeholder="Search projects..."
              className="h-11 border-0 bg-transparent px-0 text-sm font-medium text-[#334155] placeholder:font-normal placeholder:text-[#94a3b8] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </motion.form>
        </div>

        {/* Filters sidebar */}
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <motion.aside
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration,
              delay: sectionDelay * 2,
              ease: "easeOut" as const,
            }}
            className="rounded-[18px] border border-[#edf2f7] bg-white p-5 shadow-[0px_10px_30px_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-[#020618]">Filters</h2>
              <Button
                variant="ghost"
                onClick={handleClearAll}
                className="text-xs font-semibold cursor-pointer text-[#2463eb] hover:text-[#1d4ed8]"
              >
                Clear all
              </Button>
            </div>
            <Accordion
              type="multiple"
              defaultValue={["sort-by", "category", "location"]}
              className="mt-1 gap-0"
            >
              <AccordionItem
                value="sort-by"
                className="border-b border-[#edf2f7]"
              >
                <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                  Sort by
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-1">
                  <RadioGroup
                    value={activeSort}
                    onValueChange={handleSortChange}
                    className="gap-3"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] transition-colors hover:text-[#020618]",
                          activeSort === opt.value && "text-[#020618]",
                        )}
                      >
                        <RadioGroupItem
                          value={opt.value}
                          className="border-[#cbd5e1]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="category"
                className="border-b border-[#edf2f7]"
              >
                <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                  Categories
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-1">
                  <RadioGroup
                    value={activeCategoryId || "all-categories"}
                    onValueChange={(v) =>
                      handleCategoryClick(v === "all-categories" ? null : v)
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
                    {projectLaunchpad.categories.map((cat) => (
                      <label
                        key={cat.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]",
                          activeCategoryId === cat.id && "text-[#020618]",
                        )}
                      >
                        <RadioGroupItem
                          value={cat.id}
                          className="border-[#cbd5e1]"
                        />
                        <span>{cat.name}</span>
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
                <AccordionContent className="pb-4 pt-1">
                  <RadioGroup
                    value={activeLocationId || "all-locations"}
                    onValueChange={(v) =>
                      handleCityChange(v === "all-locations" ? undefined : v)
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
                    {projectLaunchpad.locations.map((city) => (
                      <label
                        key={city.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] hover:text-[#020618]",
                          activeLocationId === city.id && "text-[#020618]",
                        )}
                      >
                        <RadioGroupItem
                          value={city.id}
                          className="border-[#cbd5e1]"
                        />
                        <span>{city.name}</span>
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
            className="min-w-auto will-change-transform"
          >
            <LaunchpadAvailableOpportunities
              projects={projectLaunchpad.projects}
              nextCursor={projectLaunchpad.nextCursor}
              onOpenOpportunity={onOpenOpportunity}
            />
          </motion.section>
        </div>
      </div>
    </main>
  );
}
