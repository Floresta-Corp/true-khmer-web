import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  Newspaper,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";

export type NavItem = {
  id: string;
  label: string;
  icon: ComponentType<LucideProps>;
  href: string;
  badge?: number;
  disabled?: boolean;
};

export const navItems: NavItem[] = [
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
    id: "registrations",
    label: "Registrations",
    icon: ClipboardCheck,
    href: "/tk-admin/registrations",
  },
  {
    id: "partners",
    label: "Partner",
    icon: Building2,
    href: "/tk-admin/partners",
  },
  {
    id: "blog",
    label: "Blog",
    icon: Newspaper,
    href: "/tk-admin/blog",
  },
];

type SidebarItemProps = {
  id?: string;
  icon: ComponentType<LucideProps>;
  label: string;
  active?: boolean;
  badge?: number;
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
    mounted && !disabled && collapsed
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
      <div
        className={`rounded-xl p-2.5 transition-all duration-200 ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-900 dark:group-hover:bg-slate-800/50 dark:group-hover:text-slate-100"
        }`}
      >
        <Icon size={20} />
      </div>

      {!collapsed && (
        <span
          className={`ml-3 flex-1 truncate text-sm ${
            active
              ? "font-semibold text-blue-600 dark:text-blue-400"
              : "font-medium text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100"
          }`}
        >
          {label}
        </span>
      )}

      {badge > 0 && (
        <span className="pointer-events-none absolute top-2 right-3 z-10 min-w-4.5 rounded-full border-2 border-white bg-rose-500 px-1 py-0.5 text-center text-[10px] font-bold text-white dark:border-slate-900">
          {badge}
        </span>
      )}

      {active && (
        <div className="absolute left-0 h-6 w-1.5 rounded-r-full bg-blue-600" />
      )}
    </>
  );

  const className = `relative flex items-center py-2.5 w-full rounded-xl transition-colors duration-200 ${
    collapsed ? "justify-center" : "justify-start px-2"
  } ${
    disabled
      ? "cursor-not-allowed opacity-40"
      : `cursor-pointer group ${
          active ? "" : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
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
