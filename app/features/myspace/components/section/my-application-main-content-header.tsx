import { motion } from "motion/react";
import { useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
import ApplicationStatusTabFilter from "../tab/application-status-tab-filter";
import ApplicationTabFilter from "../tab/application-tab-filter";
import { Button } from "~/components/ui/button";
import { Archive } from "lucide-react";
import { useCallback } from "react";

const tabItems = [
  { label: "All", value: "all" },
  { label: "Volunteer", value: "volunteer" },
  { label: "Projects", value: "projects" },
];

type TabItem = (typeof tabItems)[number]["value"];

const isTabItem = (value: string | null): value is TabItem =>
  tabItems.some((tab) => tab.value === value);

export default function MyAppicationMainContentHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const filterParam = searchParams.get("filter");
  const isArchivedActive = filterParam === "archived";
  const activeTab: TabItem | "__archived__" = isArchivedActive
    ? "__archived__"
    : isTabItem(tabParam)
      ? tabParam
      : "all";

  const handleTabChange = useCallback(
    (value: TabItem) => {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          nextParams.set("tab", value);
          nextParams.delete("filter");
          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleArchivedClick = useCallback(() => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.set("filter", "archived");
        return nextParams;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center"
    >
      <div className="flex-1">
        <ApplicationTabFilter
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="flex items-center gap-3">
        <ApplicationStatusTabFilter />
        <Button
          variant={isArchivedActive ? "secondary" : "ghost"}
          className={cn(
            "h-9 gap-2 rounded-full text-sm",
            isArchivedActive
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "text-slate-500 hover:bg-slate-50",
          )}
          onClick={handleArchivedClick}
        >
          <Archive />
          Archived
        </Button>
      </div>
    </motion.div>
  );
}
