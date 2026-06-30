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
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all ${
          isActive
            ? "bg-white text-primary font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="text-sm font-semibold leading-6">{item.label}</span>
        {count > 0 && (
          <span className="ml-auto flex items-center justify-center h-5 min-w-5 rounded-full bg-red-600 text-white text-xs font-semibold">
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-5 w-63 shrink-0">
      {/* Search Input */}
      <div className="relative h-10">
        <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search updates..."
          className="w-full h-full pl-9 pr-3.5 rounded-2xl border border-gray-200 bg-white text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
        />
      </div>

      {/* Filter Navigation */}
      <Card className="flex flex-col gap-1 rounded-2xl border-none bg-slate-100 p-2 shadow-none">
        {filterItems.map(renderFilterButton)}
      </Card>
    </div>
  );
}
