import { Search, Bell, Inbox, Users, Zap, Archive } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Card } from "~/components/ui/card";

type NotificationFilterItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const filterItems: NotificationFilterItem[] = [
  {
    id: "all",
    label: "All notifications",
    to: "/notifications",
    icon: Bell,
  },
  {
    id: "unread",
    label: "Unread",
    to: "/notifications?unreadOnly=true",
    icon: Inbox,
  },
  {
    id: "volunteer",
    label: "Volunteer",
    to: "/notifications?type=application",
    icon: Users,
  },
  {
    id: "launchpad",
    label: "Projects",
    to: "/notifications?type=launchpad_update",
    icon: Zap,
  },
  {
    id: "archived",
    label: "Archived",
    to: "/notifications?archived=true",
    icon: Archive,
  },
];

interface NotificationFilterSidebarProps {
  unreadCount: number;
}

export default function NotificationFilterSidebar({
  unreadCount,
}: NotificationFilterSidebarProps) {
  const location = useLocation();

  const renderFilterButton = (item: NotificationFilterItem) => {
    const count = item.id === "unread" ? unreadCount : 0;
    const currentPath = location.pathname;
    const currentSearch = new URLSearchParams(location.search);
    const [targetPath, targetQuery = ""] = item.to.split("?");
    const targetSearch = new URLSearchParams(targetQuery);

    const isTargetSearchEmpty = Array.from(targetSearch.keys()).length === 0;

    const isActive =
      currentPath === targetPath &&
      (isTargetSearchEmpty
        ? location.search === ""
        : Array.from(targetSearch.entries()).every(
            ([k, v]) => currentSearch.get(k) === v,
          ));

    return (
      <Link
        key={item.id}
        to={item.to}
        className={`flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2.5 whitespace-nowrap transition-all md:w-full md:shrink md:gap-3 ${
          isActive
            ? "bg-white font-semibold text-primary"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="text-sm leading-6 font-semibold">{item.label}</span>
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white md:ml-auto">
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-3 md:w-63 md:gap-5">
      {/* Search Input */}
      <div className="relative h-10">
        <Search className="absolute top-3 left-3 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search updates..."
          className="h-full w-full rounded-2xl border border-gray-200 bg-white pr-3.5 pl-9 text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
        />
      </div>

      {/* Filter Navigation */}
      <Card className="flex flex-row gap-1 overflow-x-auto rounded-2xl border-none bg-slate-100 p-2 shadow-none md:flex-col">
        {filterItems.map(renderFilterButton)}
      </Card>
    </div>
  );
}
