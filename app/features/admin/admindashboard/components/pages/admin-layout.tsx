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
import { AdminNotificationProvider } from "~/context/admin-notification-context";

const menuLabels: Record<string, string> = {
  dashboard: "Dashboard",
  moderation: "Content Moderation",
  users: "User Management",
  registrations: "Registrations",
  partners: "Partner",
  "account-settings": "Account Settings",
};

function getActiveMenu(pathname: string) {
  if (pathname === "/tk-admin" || pathname === "/tk-admin/") return "dashboard";
  if (pathname.startsWith("/tk-admin/content-moderator")) return "moderation";
  if (
    pathname.startsWith("/tk-admin/users") ||
    pathname.startsWith("/tk-admin/user/")
  )
    return "users";
  if (pathname.startsWith("/tk-admin/registrations")) return "registrations";
  if (pathname.startsWith("/tk-admin/partners")) return "partners";
  if (pathname.startsWith("/tk-admin/account-settings"))
    return "account-settings";
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
    <AdminNotificationProvider>
      <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans text-slate-900 antialiased transition-colors duration-300 md:flex-row dark:bg-slate-950">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-60 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black tracking-tight text-white">
              TK
            </div>
            <span className="text-sm font-black tracking-widest text-slate-900 uppercase dark:text-white">
              {pageLabel}
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
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
              className="fixed inset-0 z-70 bg-slate-900/40 backdrop-blur-sm md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed z-80 h-full flex-col items-center border-r border-slate-100 bg-white py-5 transition-all duration-300 md:flex dark:border-slate-800/60 dark:bg-slate-950 ${
            isMobileMenuOpen
              ? "w-18 translate-x-0"
              : "w-0 -translate-x-full md:w-18 md:translate-x-0"
          }`}
        >
          <div className="mb-8 hidden md:block">
            <div className="flex h-10 w-10 items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-[11px] font-black tracking-tight text-white">
                TK
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col items-center gap-1">
            {navItems
              .filter((item) =>
                item.id === "users" ||
                item.id === "registrations" ||
                item.id === "partners"
                  ? admin.role === "SUPER_ADMIN"
                  : true,
              )
              .map((item) => (
                <SidebarItem
                  key={item.id}
                  {...item}
                  active={visibleActiveMenu === item.id}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              ))}
          </div>

          <div className="mt-auto flex w-full flex-col items-center gap-1 pb-8">
            <div className="mx-auto mb-4 h-px w-8 bg-slate-50 dark:bg-slate-800" />
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-0 flex min-h-screen flex-1 flex-col bg-[#f8fafc] transition-all duration-300 md:ml-18 dark:bg-slate-950">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-slate-100 bg-[#f8fafc]/80 px-6 backdrop-blur-md transition-all duration-300 md:top-0 md:h-20 md:px-10 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center gap-2">
              <AdminThemeSwitcher />
              <div className="mx-1 hidden h-6 w-px bg-slate-100 sm:block dark:bg-slate-800" />
              <div className="ml-0 flex items-center gap-1 sm:ml-4 sm:gap-2">
                <NotificationsDropdown />
                <AdminUserMenu admin={admin} />
              </div>
            </div>
          </header>

          <div className="w-full flex-1 bg-slate-50 dark:bg-[#020617]">
            <Outlet context={{ isSuperAdmin: admin.role === "SUPER_ADMIN" }} />
          </div>
        </main>
      </div>
    </AdminNotificationProvider>
  );
}
