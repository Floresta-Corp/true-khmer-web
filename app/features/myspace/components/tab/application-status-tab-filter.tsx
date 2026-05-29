import { Archive } from "lucide-react";
import { useSearchParams } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

type StatusTab = "all" | "pending" | "active" | "completed";

const statusItems: StatusTab[] = ["all", "pending", "active", "completed"];

const statusLabels: Record<StatusTab, string> = {
  all: "All",
  pending: "Pending",
  active: "Active",
  completed: "Completed",
};

export default function ApplicationStatusTabFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("filter");
  let activeStatus: StatusTab | "";
  if (statusParam === null) {
    // No filter param -> default to All
    activeStatus = "all";
  } else if (statusParam === "archived") {
    // Archived filter should not activate the status tabs
    activeStatus = "";
  } else {
    activeStatus = statusItems.includes(statusParam as StatusTab)
      ? (statusParam as StatusTab)
      : "";
  }

  const handleStatusChange = (value: StatusTab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("filter", value);
    setSearchParams(nextParams, { replace: true });
  };

  const handleArchivedClick = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("filter", "archived");
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="flex flex-wrap items-center gap-5">
      <Tabs
        value={activeStatus}
        onValueChange={(value) => handleStatusChange(value as StatusTab)}
      >
        <TabsList className="grid grid-cols-4 items-center rounded-2xl bg-[#F1F3F4] p-[3.5px] text-[#1A73E7] group-data-horizontal/tabs:h-12">
          {statusItems.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="h-full min-w-18 cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors data-[state=active]:bg-white data-[state=active]:text-[#0F59E2] data-[state=inactive]:text-[#5E6D82]"
            >
              {statusLabels[status]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <button
        type="button"
        onClick={handleArchivedClick}
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-xl px-2 text-xs font-bold transition-colors",
          statusParam === "archived"
            ? "text-[#1A73E8]"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
        )}
      >
        <Archive className="size-4" />
        Archived
      </button>
    </div>
  );
}
