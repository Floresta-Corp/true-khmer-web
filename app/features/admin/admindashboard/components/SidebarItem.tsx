import { useState } from "react";
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
  icon: ComponentType<LucideProps>;
  label: string;
  active?: boolean;
  badge?: number;
  disabled?: boolean;
  href: string;
  onNavigate?: () => void;
};

export function SidebarItem({
  icon: Icon,
  label,
  active = false,
  badge = 0,
  disabled = false,
  href,
  onNavigate,
}: SidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);

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

      {badge > 0 && (
        <span className="pointer-events-none absolute top-2 right-3 z-10 min-w-4.5 rounded-full border-2 border-white bg-rose-500 px-1 py-0.5 text-center text-[10px] font-bold text-white dark:border-slate-900">
          {badge}
        </span>
      )}

      {active && (
        <div className="absolute left-0 h-6 w-1.5 rounded-r-full bg-blue-600" />
      )}

      <AnimatePresence>
        {isHovered && !disabled && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute left-16 z-100 flex items-center rounded-xl border border-slate-200/50 bg-slate-100 px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-slate-900 shadow-md dark:bg-slate-800 dark:text-slate-100"
          >
            <div className="absolute -left-1 h-2 w-2 rotate-45 rounded-sm border-b border-l border-slate-200/50 bg-slate-100 dark:bg-slate-800" />
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
}
