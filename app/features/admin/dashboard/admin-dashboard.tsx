import {
  Users,
  Handshake,
  ShieldAlert,
  UserPlus,
  Building2,
  UserCog,
  Bell,
} from "lucide-react";

// Components
import { KpiCard } from "./components/kpi-card";
import { KycBanner } from "./components/kyc-banner";
import { QuickActionsSidebar } from "./components/quick-actions-sidebar";
import { RegistrationsChart } from "./components/registrations-chart";
import { ActiveUsersChart } from "./components/active-users-chart";
import { GenderBreakdownChart } from "./components/gender-breakdown-chart";
import { AgeGroupsChart } from "./components/age-groups-chart";
import { PartnerSectorsChart } from "./components/partner-sectors-chart";

// ── meta ───────────────────────────────────────────────────────────────────
export function meta() {
  return [{ title: "Admin Dashboard | True Khmer" }];
}

// ── types ──────────────────────────────────────────────────────────────────
export type StatItem = {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  iconBg: string;
  iconColor: string;
};

export type ChartBarItem = {
  day: string;
  value: number;
  highlight: boolean;
};

export type GenderItem = {
  name: string;
  value: number;
  color: string;
};

export type AgeItem = {
  range: string;
  value: number;
};

export type PartnerSector = {
  name: string;
  value: number;
  color: string;
};

export type ActiveUserPoint = {
  time: string;
  value: number;
};

export type QuickAction = {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  to?: string;
};

// ── color tokens ──────────────────────────────────────────────────────────
export const TEXT_SECONDARY = "var(--admin-text-secondary)";
export const TEXT_MUTED = "var(--admin-text-muted)";
export const GRID_COLOR = "var(--admin-grid)";
export const TOOLTIP_STYLE = {
  border: "1px solid var(--admin-tooltip-border)",
  borderRadius: "8px",
  fontSize: "11px",
  color: TEXT_SECONDARY,
  backgroundColor: "var(--admin-tooltip-bg)",
} as const;

// ── data ───────────────────────────────────────────────────────────────────
const STATS: StatItem[] = [
  {
    id: "users",
    label: "Total Users",
    value: "12,847",
    icon: Users,
    to: "/tk-admin/users",
    iconBg: "bg-(--admin-card-muted)",
    iconColor: "text-(--admin-text-secondary)",
  },
  {
    id: "partners",
    label: "Total Partners",
    value: "156",
    icon: Handshake,
    to: "/tk-admin/partner",
    iconBg: "bg-(--admin-card-muted)",
    iconColor: "text-(--admin-text-secondary)",
  },
  {
    id: "reports",
    label: "Open Reports",
    value: "24",
    icon: ShieldAlert,
    to: "/tk-admin/content-moderator",
    iconBg: "bg-rose-50 dark:bg-rose-950/60",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "add-user",
    label: "Add User",
    subtitle: "Register Member",
    icon: UserPlus,
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    to: "/tk-admin/users/add",
  },
  {
    id: "add-partner",
    label: "Add Partner",
    subtitle: "New Ecosystem Entry",
    icon: Building2,
    iconClass:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    to: "/tk-admin/partner/add",
  },
  {
    id: "invite-team",
    label: "Invite Team",
    subtitle: "Collaborator Access",
    icon: UserCog,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    to: "/tk-admin/team/invite",
  },
  {
    id: "send-notification",
    label: "Send Notification",
    subtitle: "Platform Broadcast",
    icon: Bell,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
];

const REGISTRATION_DATA: ChartBarItem[] = [
  { day: "Mon", value: 105, highlight: false },
  { day: "Tue", value: 158, highlight: false },
  { day: "Wed", value: 178, highlight: false },
  { day: "Thu", value: 135, highlight: false },
  { day: "Fri", value: 212, highlight: false },
  { day: "Sat", value: 255, highlight: true },
  { day: "Sun", value: 190, highlight: false },
];

const GENDER_DATA: GenderItem[] = [
  { name: "Male", value: 24500, color: "#3b82f6" },
  { name: "Female", value: 18300, color: "#f43f5e" },
];

const AGE_DATA: AgeItem[] = [
  { range: "18-24", value: 12000 },
  { range: "25-34", value: 15400 },
  { range: "35-44", value: 8900 },
  { range: "45-54", value: 4500 },
  { range: "55+", value: 2000 },
];

const SECTOR_DATA: PartnerSector[] = [
  { name: "FinTech", value: 45, color: "#8b5cf6" },
  { name: "Energy", value: 32, color: "#10b981" },
  { name: "Retail", value: 28, color: "#f59e0b" },
  { name: "Logistics", value: 25, color: "#3b82f6" },
  { name: "Travel", value: 26, color: "#ec4899" },
];

const ACTIVE_USERS_DATA: ActiveUserPoint[] = [
  { time: "00:00", value: 840 },
  { time: "04:00", value: 420 },
  { time: "08:00", value: 1200 },
  { time: "12:00", value: 3400 },
  { time: "16:00", value: 4800 },
  { time: "20:00", value: 3800 },
  { time: "23:59", value: 1400 },
];

// ── main page ─────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen dark:bg-slate-95 p-6 space-y-6">
      <KycBanner />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--admin-text)">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((item, i) => (
          <KpiCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <QuickActionsSidebar actions={QUICK_ACTIONS} />

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RegistrationsChart data={REGISTRATION_DATA} />
            <ActiveUsersChart data={ACTIVE_USERS_DATA} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <GenderBreakdownChart data={GENDER_DATA} />
            <AgeGroupsChart data={AGE_DATA} />
            <PartnerSectorsChart data={SECTOR_DATA} />
          </div>
        </div>
      </div>
    </div>
  );
}
