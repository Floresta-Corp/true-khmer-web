import { Archive } from "lucide-react";
import { useNavigation, useSearchParams } from "react-router";
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
  const navigation = useNavigation();

  // While a navigation is pending (loader still fetching), reflect the target
  // URL's filter so the active tab switches immediately on click instead of
  // waiting for the new data to load.
  const activeParams =
    navigation.state !== "idle" && navigation.location
      ? new URLSearchParams(navigation.location.search)
      : searchParams;
  const statusParam = activeParams.get("filter");
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
    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-5">
      <Tabs
        value={activeStatus}
        onValueChange={(value) => handleStatusChange(value as StatusTab)}
        className="w-full md:w-auto"
      >
        <TabsList className="grid w-full grid-cols-4 items-center rounded-2xl bg-[#F1F3F4] p-[3.5px] text-[#1A73E7] group-data-horizontal/tabs:h-12 md:w-auto">
          {statusItems.map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="h-full cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors data-[state=active]:bg-white data-[state=active]:text-[#0F59E2] data-[state=inactive]:text-[#5E6D82] md:min-w-18"
            >
              {statusLabels[status]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <button
        type="button"
        aria-pressed={statusParam === "archived"}
        onClick={handleArchivedClick}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#F1F3F4] text-xs font-bold transition-colors md:w-auto md:justify-start md:border-none md:px-0",
          statusParam === "archived"
            ? "border-transparent bg-[#F1F3F4] text-[#1A73E8] md:bg-transparent"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
        )}
      >
        <Archive className="size-4" />
        Archived
      </button>
    </div>
  );
}
