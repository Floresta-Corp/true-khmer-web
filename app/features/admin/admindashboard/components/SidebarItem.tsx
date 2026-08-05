import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  Building2,
  ClipboardCheck,
  ClipboardList,
  Heart,
  History,
  Hotel,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Rocket,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";

export type NavSection =
  | "overview"
  | "manage"
  | "content_management"
  | "system";

export const sectionLabels: Record<NavSection, string> = {
  overview: "Overview",
  manage: "Manage",
  content_management: "Content Management",
  system: "System",
};

export const sectionOrder: NavSection[] = [
  "overview",
  "manage",
  "content_management",
  "system",
];

export type NavItem = {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
  href: string;
  section: NavSection;
  badge?: number;
  superAdminOnly?: boolean;
  wip?: boolean;
  disabled?: boolean;
};

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/tk-admin",
    section: "overview",
  },
  {
    id: "users",
    label: "Users ",
    icon: Users,
    href: "/tk-admin/users",
    section: "manage",
    superAdminOnly: true,
  },
  {
    id: "partners",
    label: "Partners",
    icon: Hotel,
    href: "/tk-admin/partners",
    section: "manage",
    superAdminOnly: true,
  },
  {
    id: "blog",
    label: "Blog",
    icon: Newspaper,
    href: "/tk-admin/blog",
    section: "manage",
  },
  {
    id: "registrations",
    label: "Registrations",
    icon: ClipboardList,
    href: "/tk-admin/registrations",
    section: "manage",
    superAdminOnly: true,
  },
  {
    id: "moderation",
    label: "Moderation",
    icon: ShieldAlert,
    href: "/tk-admin/content-moderator",
    section: "manage",
  },
  // Content Management is not built yet — shown but not navigable.
  {
    id: "manage-volunteer",
    label: "Volunteer",
    icon: Heart,
    href: "#",
    section: "content_management",
    disabled: true,
  },
  {
    id: "manage-launchpad",
    label: "Launchpad",
    icon: Rocket,
    href: "#",
    section: "content_management",
    disabled: true,
  },
  {
    id: "manage-forum",
    label: "Forum",
    icon: MessageSquare,
    href: "#",
    section: "content_management",
    disabled: true,
  },
  {
    id: "myteam",
    label: "Team Members",
    icon: UserCog,
    href: "/tk-admin/manage-moderator/team",
    section: "system",
    superAdminOnly: true,
  },
  {
    id: "audit-log",
    label: "Audit Log",
    icon: History,
    href: "/tk-admin/admin-audit-log",
    section: "system",
    superAdminOnly: true,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/tk-admin/account-settings",
    section: "system",
  },
];

type SidebarItemProps = {
  id?: string;
  icon: ComponentType<LucideProps>;
  label: string;
  active?: boolean;
  badge?: number;
  wip?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
  href: string;
  onNavigate?: () => void;
};

export function SidebarItem({
  icon: Icon,
  label,
  active = false,
  badge = 0,
  wip = false,
  disabled = false,
  collapsed = false,
  href,
  onNavigate,
}: SidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const anchorRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  const showTooltip = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
    }
    setIsHovered(true);
  };

  const hideTooltip = () => setIsHovered(false);

  const tooltip =
    mounted && collapsed
      ? createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ top: tooltipPos.top, left: tooltipPos.left }}
                className="pointer-events-none fixed z-100 flex -translate-y-1/2 items-center rounded-xl border border-slate-200/50 bg-slate-100 px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-slate-900 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <div className="absolute -left-1 h-2 w-2 rotate-45 rounded-sm border-b border-l border-slate-200/50 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
                {label}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null;

  const content = (
    <>
      <Icon size={20} className="shrink-0" />

      {!collapsed && (
        <span className="ml-3 flex-1 truncate text-sm">{label}</span>
      )}

      {/* WIP pill (visual only — the item stays navigable) */}
      {!collapsed && wip && (
        <span className="ml-auto rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase dark:bg-slate-800 dark:text-slate-500">
          WIP
        </span>
      )}

      {badge > 0 &&
        (collapsed ? (
          <span className="pointer-events-none absolute top-1.5 right-1.5 z-10 min-w-4.5 rounded-full border-2 border-white bg-rose-500 px-1 py-0.5 text-center text-[10px] font-bold text-white dark:border-slate-950">
            {badge}
          </span>
        ) : (
          <span className="ml-auto min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[11px] font-bold text-white">
            {badge}
          </span>
        ))}
    </>
  );

  const className = `relative flex items-center rounded-lg transition-colors duration-200 ${
    collapsed ? "h-11 w-11 justify-center" : "w-full justify-start px-3 py-2.5"
  } ${
    active
      ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
      : "font-medium text-slate-500 dark:text-slate-400"
  } ${
    disabled
      ? "cursor-not-allowed opacity-40"
      : `cursor-pointer group ${
          active
            ? ""
            : "hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
        }`
  }`;

  if (disabled) {
    return (
      <div
        ref={anchorRef as React.RefObject<HTMLDivElement>}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={className}
      >
        {content}
        {tooltip}
      </div>
    );
  }

  return (
    <Link
      ref={anchorRef as React.RefObject<HTMLAnchorElement>}
      to={href}
      prefetch="intent"
      onClick={onNavigate}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={className}
      aria-label={label}
    >
      {content}
      {tooltip}
    </Link>
  );
}
