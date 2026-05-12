import { Link, useSearchParams } from "react-router";
import ApplicationStatusTabFilter from "../tab/application-status-tab-filter";
import ApplicationTabFilter from "../tab/application-tab-filter";
import { Button } from "~/components/ui/button";
import { Archive } from "lucide-react";

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
  const activeTab: TabItem = isTabItem(tabParam) ? tabParam : "all";
  const handleTabChange = (value: TabItem) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", value);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="flex items-center">
      <div className="flex-1">
        <ApplicationTabFilter
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="flex items-center gap-3">
        <ApplicationStatusTabFilter />
        <Link to="/my-application/archived">
          <Button variant={"ghost"} className="h-9 text-slate-500">
            <Archive />
            Archived
          </Button>
        </Link>
      </div>
    </div>
  );
}
