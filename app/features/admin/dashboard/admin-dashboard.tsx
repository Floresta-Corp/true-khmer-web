import { useState } from "react";
import { useLoaderData } from "react-router";
import {
  Users,
  Handshake,
  ShieldAlert,
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
import { SendNotificationDialog } from "~/features/admin/notifications/components/send-notification-dialog";
import { adminDashboardLoader } from "~/routes/api/auth/super-admin/dashboard/dashboard.loader";
import type { AdminDashboardResponse } from "~/types/api-client";

// ── meta ───────────────────────────────────────────────────────────────────
export function meta() {
  return [{ title: "Admin Dashboard | True Khmer" }];
}

// ── route data ───────────────────────────────────────────────────────────────
export const loader = adminDashboardLoader;

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
  onClick?: () => void;
};

// ── color tokens ──────────────────────────────────────────────────────────
export const TEXT_SECONDARY = "var(--admin-text-secondary)";
export const TEXT_MUTED = "var(--admin-text-muted)";
export const GRID_COLOR = "var(--admin-grid)";
export const TOOLTIP_STYLE = {
  border: "1px solid var(--admin-tooltip-border)",
  borderRadius: "12px",
  fontSize: "11px",
  padding: "8px 12px",
  color: TEXT_SECONDARY,
  backgroundColor: "var(--admin-tooltip-bg)",
  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.15)",
} as const;
export const TOOLTIP_CURSOR = {
  fill: "var(--admin-card-muted)",
  radius: 8,
} as const;

// ── data ───────────────────────────────────────────────────────────────────
type DashboardData = AdminDashboardResponse["dashboard"];

// Static presentation metadata for the KPI cards; values come from the loader.
const STAT_META: Omit<StatItem, "value">[] = [
  {
    id: "users",
    label: "Total Users",
    icon: Users,
    to: "/tk-admin/users",
    iconBg: "bg-(--admin-card-muted)",
    iconColor: "text-(--admin-text-secondary)",
  },
  {
    id: "partners",
    label: "Total Partners",
    icon: Handshake,
    to: "/tk-admin/partner",
    iconBg: "bg-(--admin-card-muted)",
    iconColor: "text-(--admin-text-secondary)",
  },
  {
    id: "reports",
    label: "Open Reports",
    icon: ShieldAlert,
    to: "/tk-admin/content-moderator",
    iconBg: "bg-rose-50 dark:bg-rose-950/60",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

// Color palettes for charts whose values come from the API without colors.
const GENDER_COLORS: Record<string, string> = {
  male: "#3b82f6",
  female: "#f43f5e",
};
const GENDER_FALLBACK_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#06b6d4"];
const SECTOR_COLORS = [
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
  "#06b6d4",
  "#f43f5e",
];

const BASE_QUICK_ACTIONS: Omit<QuickAction, "onClick">[] = [
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

// ── mappers ──────────────────────────────────────────────────────────────
function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function toStats(summary: DashboardData["summary"]): StatItem[] {
  const values: Record<string, number | null> = {
    users: summary.totalUsers,
    partners:
      typeof summary.totalPartners === "number" ? summary.totalPartners : null,
    reports: summary.openReports,
  };

  return STAT_META.map((meta) => {
    const value = values[meta.id];
    return {
      ...meta,
      value: typeof value === "number" ? formatNumber(value) : "—",
    };
  });
}

function toRegistrationData(
  newRegistrations: DashboardData["newRegistrations"],
): ChartBarItem[] {
  const trend = newRegistrations.trend;
  const peak = trend.reduce(
    (max, point) => Math.max(max, point.count),
    Number.NEGATIVE_INFINITY,
  );
  return trend.map((point) => ({
    day: point.label,
    value: point.count,
    highlight: point.count === peak,
  }));
}

function toActiveUsersData(
  activeUsers: DashboardData["activeUsers"],
): ActiveUserPoint[] {
  return activeUsers.trend.map((point) => ({
    time: point.label,
    value: point.count,
  }));
}

function toGenderData(
  demographics: DashboardData["demographics"],
): GenderItem[] {
  return demographics.genderBreakdown.map((item, index) => ({
    name: item.label,
    value: item.count,
    color:
      GENDER_COLORS[item.label.toLowerCase()] ??
      GENDER_FALLBACK_COLORS[index % GENDER_FALLBACK_COLORS.length],
  }));
}

function toAgeData(demographics: DashboardData["demographics"]): AgeItem[] {
  return demographics.ageGroups.map((item) => ({
    range: item.label,
    value: item.count,
  }));
}

function toSectorData(partners: DashboardData["partners"]): PartnerSector[] {
  if (!Array.isArray(partners.sectors)) return [];

  return partners.sectors.flatMap((raw, index) => {
    if (typeof raw !== "object" || raw === null) return [];
    const entry = raw as {
      label?: unknown;
      name?: unknown;
      count?: unknown;
      value?: unknown;
    };
    const name =
      typeof entry.label === "string"
        ? entry.label
        : typeof entry.name === "string"
          ? entry.name
          : null;
    const value =
      typeof entry.count === "number"
        ? entry.count
        : typeof entry.value === "number"
          ? entry.value
          : null;
    if (name === null || value === null) return [];
    return [
      { name, value, color: SECTOR_COLORS[index % SECTOR_COLORS.length] },
    ];
  });
}

// ── main page ─────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { dashboard } = useLoaderData<typeof adminDashboardLoader>();
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  const stats = toStats(dashboard.summary);
  const registrationData = toRegistrationData(dashboard.newRegistrations);
  const activeUsersData = toActiveUsersData(dashboard.activeUsers);
  const genderData = toGenderData(dashboard.demographics);
  const ageData = toAgeData(dashboard.demographics);
  const sectorData = toSectorData(dashboard.partners);
  const showPartnerSectors =
    dashboard.partners.total !== null && sectorData.length > 0;

  const quickActions: QuickAction[] = BASE_QUICK_ACTIONS.map((action) =>
    action.id === "send-notification"
      ? { ...action, onClick: () => setShowNotificationDialog(true) }
      : action,
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-6">
      {/* <KycBanner /> */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--admin-text)">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <KpiCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <QuickActionsSidebar actions={quickActions} />

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RegistrationsChart
              data={registrationData}
              changePercent={dashboard.newRegistrations.changePercent}
            />
            <ActiveUsersChart
              data={activeUsersData}
              liveNow={dashboard.activeUsers.liveNow}
            />
          </div>

          <div
            className={`grid grid-cols-1 gap-6 ${
              showPartnerSectors ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            <GenderBreakdownChart data={genderData} />
            <AgeGroupsChart data={ageData} />
            {showPartnerSectors && <PartnerSectorsChart data={sectorData} />}
          </div>
        </div>
      </div>

      <SendNotificationDialog
        show={showNotificationDialog}
        onClose={() => setShowNotificationDialog(false)}
      />
    </div>
  );
}
