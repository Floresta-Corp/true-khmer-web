import { Search, Bell, Inbox, Users, Zap, Archive } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Sidebar, SidebarContent, useSidebar } from "~/components/ui/sidebar";

type NotificationSidebarItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
};

const notificationItems: NotificationSidebarItem[] = [
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
    to: "/notifications/archived",
    icon: Archive,
  },
];

export default function NotificationSidebar() {
  const location = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();

  const renderMenuItem = (item: NotificationSidebarItem) => {
    const isActive = location.pathname === item.to;
    return (
      <Link
        key={item.id}
        to={item.to}
        onClick={() => isMobile && setOpenMobile(false)}
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all ${
          isActive
            ? "bg-white text-primary font-semibold"
            : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="text-sm leading-6 font-semibold">{item.label}</span>
        {item.count !== undefined && item.count > 0 && (
          <span className="ml-auto flex items-center justify-center h-5 min-w-5 rounded-full bg-red-600 text-white text-xs font-semibold">
            {item.count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="border-r bg-white w-72"
    >
      <SidebarContent className="p-5 gap-5 flex flex-col">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search updates..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1 rounded-xl bg-slate-100 p-2">
          {notificationItems.map(renderMenuItem)}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
