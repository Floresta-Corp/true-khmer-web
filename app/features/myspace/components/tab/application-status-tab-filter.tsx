import { useSearchParams } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
  const statusParam = searchParams.get("status");
  const activeStatus: StatusTab = statusItems.includes(statusParam as StatusTab)
    ? (statusParam as StatusTab)
    : "all";

  const handleStatusChange = (value: StatusTab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("status", value);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <Tabs
      value={activeStatus}
      onValueChange={(value) => handleStatusChange(value as StatusTab)}
    >
      <TabsList className="flex items-center gap-1.75 rounded-2xl bg-white p-[3.5px]">
        {statusItems.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className={`rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors data-[state=active]:bg-[#F0F6FF] data-[state=active]:text-[#0F59E2] data-[state=inactive]:text-[#5E6D82]`}
          >
            {statusLabels[status]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
