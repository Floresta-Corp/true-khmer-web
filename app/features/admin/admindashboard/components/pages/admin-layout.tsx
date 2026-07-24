import { useEffect, useState } from "react";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X as CloseIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router";
import type { adminLayoutLoader } from "../../services/admin-layout.loader";
import {
  SidebarItem,
  navItems,
  sectionLabels,
  sectionOrder,
} from "../SidebarItem";
import { NotificationsDropdown } from "../NotificationsDropdown";
import AdminUserMenu from "../AdminUserMenu";
import { AdminThemeSwitcher } from "../admin-theme-switcher";
import { AdminNotificationProvider } from "~/context/admin-notification-context";

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
  if (pathname.startsWith("/tk-admin/blog")) return "blog";
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored !== null) setIsCollapsed(stored === "true");

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncIsDesktop = () => setIsDesktop(mediaQuery.matches);
    syncIsDesktop();
    setMounted(true);

    mediaQuery.addEventListener("change", syncIsDesktop);
    return () => mediaQuery.removeEventListener("change", syncIsDesktop);
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-collapsed", String(next));
      return next;
    });
  };

  useEffect(() => {
    const next = getActiveMenu(location.pathname);
    if (next) setActiveMenu(next);
  }, [location.pathname]);

  const pendingPathname = navigation.location?.pathname;
  const visibleActiveMenu =
    navigation.state !== "idle" && pendingPathname
      ? (getActiveMenu(pendingPathname) ?? activeMenu)
      : activeMenu;
  const effectiveCollapsed = isDesktop ? isCollapsed : false;

  return (
    <AdminNotificationProvider>
      <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md transition-all duration-300 md:h-20 md:px-8 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 transition-colors hover:text-slate-900 md:hidden dark:hover:text-white"
              aria-label="Toggle admin menu"
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
            <img
              src="/Logofullsize.svg"
              alt="True Khmer"
              className="h-8 w-auto md:h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <AdminThemeSwitcher />
            <div className="mx-1 hidden h-6 w-px bg-slate-100 sm:block dark:bg-slate-800" />
            <div className="ml-0 flex items-center gap-1 sm:ml-4 sm:gap-2">
              <NotificationsDropdown />
              <AdminUserMenu admin={admin} />
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Mobile sidebar backdrop */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-x-0 top-16 bottom-0 z-70 bg-slate-900/40 backdrop-blur-sm md:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <aside
            className={`fixed top-16 left-0 z-80 flex h-[calc(100vh-4rem)] flex-col border-r border-slate-100 bg-white py-5 md:sticky md:top-20 md:z-auto md:h-[calc(100vh-5rem)] md:translate-x-0 dark:border-slate-800/60 dark:bg-slate-950 ${
              mounted
                ? "transition-[width,transform] duration-300 ease-in-out will-change-[width]"
                : ""
            } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} ${
              effectiveCollapsed ? "w-18" : "w-64"
            }`}
          >
            {/* Collapse toggle (centered) — only when collapsed; when expanded
                it lives inline with the first section header below */}
            {effectiveCollapsed && (
              <div className="mb-2 hidden items-center justify-center md:flex">
                <button
                  onClick={toggleCollapsed}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-white"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen size={20} />
                </button>
              </div>
            )}

            <div
              className={`flex w-full flex-1 flex-col overflow-y-auto ${
                effectiveCollapsed ? "items-center gap-1" : "items-stretch px-3"
              }`}
            >
              {sectionOrder
                .map((section) => ({
                  section,
                  items: navItems
                    .filter((item) => item.section === section)
                    .filter((item) =>
                      item.id === "users" ||
                      item.id === "registrations" ||
                      item.id === "partners"
                        ? admin.role === "SUPER_ADMIN"
                        : true,
                    ),
                }))
                .filter(({ items }) => items.length > 0)
                .map(({ section, items }, groupIndex) => (
                  <div
                    key={section}
                    className={`flex w-full flex-col gap-1 ${
                      effectiveCollapsed ? "items-center" : "items-stretch"
                    }`}
                  >
                    {effectiveCollapsed ? (
                      groupIndex > 0 && (
                        <div className="mx-auto my-2 h-px w-6 bg-slate-100 dark:bg-slate-800" />
                      )
                    ) : groupIndex === 0 ? (
                      <div className="mt-1 mb-1 flex items-center justify-between px-3">
                        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                          {sectionLabels[section]}
                        </span>
                        <button
                          onClick={toggleCollapsed}
                          className="hidden rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900 md:inline-flex dark:hover:bg-slate-800/50 dark:hover:text-white"
                          aria-label="Collapse sidebar"
                        >
                          <PanelLeftClose size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="mt-5 mb-1 px-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                        {sectionLabels[section]}
                      </span>
                    )}

                    {items.map((item) => (
                      <SidebarItem
                        key={item.id}
                        {...item}
                        collapsed={effectiveCollapsed}
                        active={visibleActiveMenu === item.id}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                      />
                    ))}
                  </div>
                ))}
            </div>

            <div className="mt-auto flex w-full flex-col items-center gap-1 pb-8">
              <div className="mx-auto mb-4 h-px w-8 bg-slate-50 dark:bg-slate-800" />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-[#020617]">
            <Outlet
              context={{ admin, isSuperAdmin: admin.role === "SUPER_ADMIN" }}
            />
          </main>
        </div>
      </div>
    </AdminNotificationProvider>
  );
}
