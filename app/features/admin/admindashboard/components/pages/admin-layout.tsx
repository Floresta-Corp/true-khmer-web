import { useEffect, useState } from "react";
import { Menu, X as CloseIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router";
import type { adminLayoutLoader } from "../../services/admin-layout.loader";
import { SidebarItem, navItems } from "../SidebarItem";
import { NotificationsDropdown } from "../NotificationsDropdown";
import AdminUserMenu from "../AdminUserMenu";
import { AdminThemeSwitcher } from "../admin-theme-switcher";

const menuLabels: Record<string, string> = {
  dashboard: "Dashboard",
  moderation: "Content Moderation",
  users: "User Management",
  partners: "Partner",
};

function getActiveMenu(pathname: string) {
  if (pathname === "/tk-admin" || pathname === "/tk-admin/") return "dashboard";
  if (pathname.startsWith("/tk-admin/content-moderator")) return "moderation";
  if (
    pathname.startsWith("/tk-admin/users") ||
    pathname.startsWith("/tk-admin/user/")
  )
    return "users";
  return null;
}

export default function AdminLayout() {
  const { admin } = useLoaderData<typeof adminLayoutLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const next = getActiveMenu(location.pathname);
    if (next) setActiveMenu(next);
  }, [location.pathname]);

  const pendingPathname = navigation.location?.pathname;
  const visibleActiveMenu =
    navigation.state !== "idle" && pendingPathname
      ? (getActiveMenu(pendingPathname) ?? activeMenu)
      : activeMenu;

  const pageLabel = menuLabels[visibleActiveMenu] ?? "Admin";

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 transition-colors duration-300 antialiased font-sans flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="md:hidden h-16 px-6 flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[10px] tracking-tight">
            TK
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
            {pageLabel}
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Toggle admin menu"
        >
          {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-70 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed h-full z-80 transition-all duration-300 md:flex flex-col items-center py-5 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800/60 ${
          isMobileMenuOpen
            ? "w-18 translate-x-0"
            : "w-0 -translate-x-full md:w-18 md:translate-x-0"
        }`}
      >
        <div className="mb-8 hidden md:block">
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-[11px] tracking-tight">
              TK
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full items-center flex-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              {...item}
              active={visibleActiveMenu === item.id}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1 w-full items-center pb-8 mt-auto">
          <div className="h-px bg-slate-50 dark:bg-slate-800 w-8 mb-4 mx-auto" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 transition-all duration-300 md:ml-18 ml-0 flex flex-col min-h-screen bg-[#f8fafc] dark:bg-slate-950">
        <header className="h-16 md:h-20 px-6 md:px-10 flex items-center justify-end sticky top-0 md:top-0 bg-[#f8fafc]/80 dark:bg-slate-950/80 backdrop-blur-md z-30 border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
          <div className="flex items-center gap-2">
            <AdminThemeSwitcher />
            <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-4">
              <NotificationsDropdown />
              <AdminUserMenu admin={admin} />
            </div>
          </div>
        </header>

        <div className="flex-1 w-full bg-slate-50 dark:bg-[#020617]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
