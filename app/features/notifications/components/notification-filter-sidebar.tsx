import { Search, Bell, Inbox, Users, Zap, Archive } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Card } from "~/components/ui/card";

type NotificationFilterItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
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
    to: "/notifications?filter=unread",
    icon: Inbox,
    count: 2,
  },
  {
    id: "volunteer",
    label: "Volunteer",
    to: "/notifications?filter=volunteer",
    icon: Users,
  },
  {
    id: "projects",
    label: "Projects",
    to: "/notifications?filter=projects",
    icon: Zap,
  },
  {
    id: "archived",
    label: "Archived",
    to: "/notifications?filter=archived",
    icon: Archive,
  },
];

export default function NotificationFilterSidebar() {
  const location = useLocation();

  const renderFilterButton = (item: NotificationFilterItem) => {
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
        {item.count !== undefined && item.count > 0 && (
          <span className="ml-auto flex items-center justify-center h-5 min-w-5 rounded-full bg-red-600 text-white text-xs font-semibold">
            {item.count}
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
      <Card className="flex flex-col gap-1 rounded-2xl bg-slate-100 p-2 shadow-none">
        {filterItems.map(renderFilterButton)}
      </Card>
    </div>
  );
}
