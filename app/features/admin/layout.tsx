import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  Bell,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  User as UserIcon,
  Users,
  X as CloseIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  data,
  Form,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
  type LoaderFunctionArgs,
  type ShouldRevalidateFunctionArgs,
} from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, setCookie } = await requireSuperAdmin(request);
  const loaderData = { userRole: "Super Admin", adminName: admin.name };

  return data(
    loaderData,
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
}

export function shouldRevalidate({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod) return true;

  if (
    currentUrl.pathname.startsWith("/tk-admin") &&
    nextUrl.pathname.startsWith("/tk-admin")
  ) {
    return true;
  }

  return defaultShouldRevalidate;
}

export function meta() {
  return [{ title: "Admin Panel | True Khmer" }];
}

type UserRole = "Super Admin" | "Moderator" | "Partner Manager";
type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

const ADMIN_THEME_STORAGE_KEY = "true-khmer-admin-theme-preference";

function deviceTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolvedTheme(preference: ThemePreference): Theme {
  return preference === "system" ? deviceTheme() : preference;
}

type NavItem = {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
  href: string;
  badge?: number;
  disabled?: boolean;
};

const user = {
  userRole: "Super Admin" as UserRole,
  name: "John Doe",
  email: "cheata.sck@gmail.com",
  initials: "JD",
  avatar: "",
};

const roles: UserRole[] = ["Super Admin", "Moderator", "Partner Manager"];

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/tk-admin",
  },
  {
    id: "moderation",
    label: "Content Moderation",
    icon: ShieldCheck,
    href: "/tk-admin/content-moderator",
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    href: "/tk-admin/users",
  },
  {
    id: "partners",
    label: "Partner",
    icon: Building2,
    href: "/tk-admin",
    disabled: true,
  },
];

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  badge = 0,
  disabled = false,
  href,
  onNavigate,
}: {
  icon: ComponentType<LucideProps>;
  label: string;
  active?: boolean;
  badge?: number;
  disabled?: boolean;
  href: string;
  onNavigate?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <>
      <div
        className={`p-2.5 rounded-xl transition-all duration-200 ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "text-slate-400 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 group-hover:text-slate-900 dark:group-hover:text-slate-100"
        }`}
      >
        <Icon size={20} />
      </div>

      {badge > 0 && (
        <span className="absolute top-2 right-3 bg-rose-500 text-white text-[10px] font-bold px-1 py-0.5 min-w-4.5 text-center rounded-full border-2 border-white dark:border-slate-900 pointer-events-none z-10">
          {badge}
        </span>
      )}

      {active && (
        <div className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-r-full" />
      )}

      <AnimatePresence>
        {isHovered && !disabled && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-16 px-3 py-1.5 bg-slate-100 text-slate-900 dark:text-slate-100 dark:bg-slate-800 text-[13px] font-medium rounded-xl shadow-md border border-slate-200/50 whitespace-nowrap pointer-events-none z-100 flex items-center"
          >
            <div className="absolute -left-1 w-2 h-2 bg-slate-100 dark:bg-slate-800 rotate-45 rounded-sm border-l border-b border-slate-200/50" />
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const className = `relative flex items-center justify-center py-2.5 w-full ${
    disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer group"
  }`;

  if (disabled) {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={className}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={href}
      prefetch="intent"
      onClick={onNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      aria-label={label}
    >
      {content}
    </Link>
  );
};

function getBreadcrumbs(activeMenu: string) {
  const menuLabels: Record<string, string> = {
    dashboard: "Dashboard",
    moderation: "Content Moderation",
    users: "User Management",
    partners: "Partner",
  };

  return ["Home", menuLabels[activeMenu] || "Admin"];
}

export default function AdminLayout() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigation = useNavigation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("system");
  const [theme, setTheme] = useState<Theme>("light");
  const [userRole, setUserRole] = useState(
    loaderData.userRole ?? "Super Admin",
  );
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDashboardRoute =
    location.pathname === "/tk-admin" || location.pathname === "/tk-admin/";

  useEffect(() => {
    const root = window.document.documentElement;
    const savedPreference = window.localStorage.getItem(
      ADMIN_THEME_STORAGE_KEY,
    ) as ThemePreference | null;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (nextTheme: Theme) => {
      root.classList.toggle("dark", nextTheme === "dark");
      root.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };

    const initialPreference: ThemePreference =
      savedPreference === "light" ||
      savedPreference === "dark" ||
      savedPreference === "system"
        ? savedPreference
        : "system";

    setThemePreference(initialPreference);
    applyTheme(resolvedTheme(initialPreference));

    const handleDeviceThemeChange = (event: MediaQueryListEvent) => {
      const preference = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
      if (preference && preference !== "system") return;
      applyTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleDeviceThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleDeviceThemeChange);
  }, []);

  function toggleTheme() {
    const nextPreference: ThemePreference =
      themePreference === "system"
        ? "light"
        : themePreference === "light"
          ? "dark"
          : "system";
    const nextTheme = resolvedTheme(nextPreference);

    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, nextPreference);
    window.document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark",
    );
    window.document.documentElement.style.colorScheme = nextTheme;
    setThemePreference(nextPreference);
    setTheme(nextTheme);
  }

  useEffect(() => {
    if (isDashboardRoute) {
      setActiveMenu("dashboard");
    }

    if (location.pathname.startsWith("/tk-admin/content-moderator")) {
      setActiveMenu("moderation");
    }

    if (
      location.pathname.startsWith("/tk-admin/users") ||
      location.pathname.startsWith("/tk-admin/user/")
    ) {
      setActiveMenu("users");
    }
  }, [isDashboardRoute, location.pathname]);

  const pendingPathname = navigation.location?.pathname;
  const visibleActiveMenu =
    navigation.state !== "idle" && pendingPathname
      ? pendingPathname.startsWith("/tk-admin/content-moderator")
        ? "moderation"
        : pendingPathname.startsWith("/tk-admin/users") ||
            pendingPathname.startsWith("/tk-admin/user/")
          ? "users"
          : pendingPathname === "/tk-admin" || pendingPathname === "/tk-admin/"
            ? "dashboard"
            : activeMenu
      : activeMenu;

  const crumbs = getBreadcrumbs(visibleActiveMenu);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 transition-colors duration-300 antialiased font-sans flex-col md:flex-row">
      <header className="md:hidden h-16 px-6 flex items-center justify-between bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[10px] tracking-tight">
            TK
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
            {crumbs[0]}
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
              icon={item.icon}
              label={item.label}
              active={visibleActiveMenu === item.id}
              badge={item.badge}
              disabled={item.disabled}
              href={item.href}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1 w-full items-center pb-8 mt-auto">
          <div className="h-px bg-slate-50 dark:bg-slate-800 w-8 mb-4 mx-auto" />
        </div>
      </aside>

      <main className="flex-1 transition-all duration-300 md:ml-18 ml-0 flex flex-col min-h-screen bg-[#f8fafc] dark:bg-slate-950">
        <header className="h-16 md:h-20 px-6 md:px-10 flex items-center justify-end sticky top-0 md:top-0 bg-[#f8fafc]/80 dark:bg-slate-950/80 backdrop-blur-md z-30 border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 md:p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-all text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                aria-label={`Theme: ${themePreference}. Change theme`}
                title={`Theme: ${themePreference}`}
              >
                {themePreference === "system" ? (
                  <Monitor size={16} />
                ) : theme === "light" ? (
                  <Moon size={16} />
                ) : (
                  <Sun size={16} />
                )}
              </button>

              <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 mx-1 hidden sm:block" />

              <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-4">
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`relative p-2 md:p-2.5 rounded-xl transition-all ${
                      isNotificationsOpen
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }`}
                    aria-label="Open notifications"
                  >
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-50 dark:border-[#020617]" />
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsNotificationsOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-50 overflow-hidden flex flex-col"
                        >
                          <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 text-center sm:text-left">
                            <h3 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                              Notifications
                            </h3>
                            <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors hidden xs:inline">
                              Mark all as read
                            </button>
                          </div>

                          <div className="max-h-[80vh] sm:max-h-120 overflow-auto py-2">
                            {[
                              {
                                id: 1,
                                title: "Critical Security Alert",
                                desc: "New login from an unrecognized device in Singapore.",
                                time: "2 mins ago",
                              },
                              {
                                id: 2,
                                title: "Community Health Peak",
                                desc: "Health index reached 94% following the new rewards rollout.",
                                time: "45 mins ago",
                              },
                              {
                                id: 3,
                                title: "New Partner Application",
                                desc: "FinTech Connect has applied for a Tier 2 Partner license.",
                                time: "3h ago",
                              },
                            ].map((notif) => (
                              <div
                                key={notif.id}
                                className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                              >
                                <div className="flex gap-4">
                                  <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                    <Bell size={18} />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                                        {notif.title}
                                      </h4>
                                      <span className="text-[10px] font-medium text-slate-400">
                                        {notif.time}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                      {notif.desc}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                            <button className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all">
                              View Activity Log
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <div
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 cursor-pointer overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ml-2"
                  >
                    {user.avatar ? (
                      <Avatar className="w-full h-full rounded-full border-0">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-50 overflow-hidden p-2"
                      >
                        <div className="p-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {user.initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Link
                            to="/tk-admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="px-4 py-2.5 text-[13px] font-bold rounded-xl cursor-pointer transition-all flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <LayoutDashboard
                              size={16}
                              className="text-slate-300"
                            />
                            Dashboard
                          </Link>
                          <Link
                            to="/tk-admin/content-moderator"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="px-4 py-2.5 text-[13px] font-bold rounded-xl cursor-pointer transition-all flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <ShieldCheck size={16} className="text-slate-300" />
                            Moderation
                          </Link>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                          <Form method="post" action="/tk-admin/logout">
                            <button
                              type="submit"
                              className="w-full px-4 py-3 text-[13px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all flex items-center gap-3 text-left cursor-pointer"
                            >
                              <LogOut size={16} />
                              Sign Out
                            </button>
                          </Form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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
