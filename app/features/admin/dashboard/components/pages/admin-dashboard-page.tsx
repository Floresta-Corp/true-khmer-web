import { useLoaderData, useOutletContext } from "react-router";
import {
  UserPlus,
  Building2,
  ClipboardList,
  Shield,
  Users,
} from "lucide-react";

import { KpiCard } from "../kpi-card";
import { WelcomeCard } from "../welcome-card";
import { QuickActionsCard } from "../quick-actions-card";
import { RangeSelect } from "../range-select";
import { NewSignupsChart } from "../new-signups-chart";
import { ActiveUsersChart } from "../active-users-chart";
import {
  useActiveUsersSeries,
  useDashboardSummary,
  useNewRegistrationsSeries,
} from "../use-chart-series";
import { GenderBreakdownChart } from "../gender-breakdown-chart";
import { AgeGroupsChart } from "../age-groups-chart";
import { PartnerSectorsChart } from "../partner-sectors-chart";
import type { AdminUser } from "~/types/api-client";
import type { adminDashboardLoader } from "../../services/admin-dashboard.loader";
import { CHART_PERIOD_OPTIONS } from "../../types";
import type {
  ActiveUsersData,
  ChartPeriod,
  DashboardOverview,
  GenderItem,
  AgeItem,
  MetricPoint,
  NewRegistrationsData,
  PartnerSector,
  QuickAction,
  StatItem,
} from "../../types";

// ── static data ───────────────────────────────────────────────────────────
const GENDER_COLORS: Record<string, string> = {
  male: "#3b82f6",
  female: "#f43f5e",
};

const GENDER_FALLBACK_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#06b6d4"];

// Quick actions are not yet wired up — the design shows them as an upcoming
// ("Coming soon") feature, rendered non-interactive.
const QUICK_ACTION_ICON =
  "bg-indigo-50 text-indigo-400 dark:bg-indigo-900/20 dark:text-indigo-400";

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "add-user",
    label: "Add User",
    icon: UserPlus,
    iconClass: QUICK_ACTION_ICON,
  },
  {
    id: "add-partner",
    label: "Add Partner",
    icon: Building2,
    iconClass: QUICK_ACTION_ICON,
  },
  {
    id: "create-listing",
    label: "Create Listing",
    icon: ClipboardList,
    iconClass: QUICK_ACTION_ICON,
  },
  {
    id: "view-reports",
    label: "View Reports",
    icon: Shield,
    iconClass: QUICK_ACTION_ICON,
  },
  {
    id: "team-members",
    label: "Team Members",
    icon: Users,
    iconClass: QUICK_ACTION_ICON,
  },
];

// ── mappers ───────────────────────────────────────────────────────────────
// KPI headline numbers reflect the default period served by the loader; the
// charts below carry their own period filters and refetch independently.
function toStats(
  overview: DashboardOverview,
  activeUsers: ActiveUsersData,
  newRegistrations: NewRegistrationsData,
  isSuperAdmin: boolean,
): StatItem[] {
  const { summary } = overview;
  const signups = newRegistrations.trend.reduce((sum, p) => sum + p.count, 0);

  const restricted = (value: number | null) =>
    !isSuperAdmin || value === null ? "—" : value.toLocaleString("en-US");

  // Turn a period-over-period change % into the badge fields, or nothing.
  const delta = (change: number | null) =>
    typeof change === "number"
      ? {
          delta: `${change >= 0 ? "+" : ""}${change}%`,
          deltaTone: change >= 0 ? ("up" as const) : ("down" as const),
        }
      : {};

  return [
    {
      id: "users",
      label: "Total Users",
      value: restricted(summary.totalUsers),
    },
    {
      id: "active",
      label: "Active Users",
      value: activeUsers.count.toLocaleString("en-US"),
      ...delta(activeUsers.changePercent),
    },
    {
      id: "partners",
      label: "Total Partners",
      value: restricted(summary.totalPartners),
    },
    {
      id: "signups",
      label: "New Signups",
      value: signups.toLocaleString("en-US"),
      ...delta(newRegistrations.changePercent),
    },
  ];
}

function toGenderData(
  demographics: DashboardOverview["demographics"],
): GenderItem[] {
  return demographics.genderBreakdown.map((item, i) => ({
    name: item.label,
    value: item.count,
    color:
      GENDER_COLORS[item.label.toLowerCase()] ??
      GENDER_FALLBACK_COLORS[i % GENDER_FALLBACK_COLORS.length],
  }));
}

function toAgeData(demographics: DashboardOverview["demographics"]): AgeItem[] {
  return demographics.ageGroups.slice(0, 5).map((item) => ({
    range: item.label,
    value: item.count,
  }));
}

function toSectorData(sectors: MetricPoint[] | null): PartnerSector[] {
  if (!Array.isArray(sectors)) return [];

  const totals = new Map<string, { name: string; value: number }>();

  for (const { label, count } of sectors) {
    for (const part of label.split(",")) {
      const display = part.trim().replace(/\s+/g, " ");
      if (!display) continue;
      const key = display.toLowerCase();
      const existing = totals.get(key);
      if (existing) {
        existing.value += count;
      } else {
        totals.set(key, { name: display, value: count });
      }
    }
  }

  return [...totals.values()].sort((a, b) => b.value - a.value).slice(0, 5);
}

// ── page ──────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { overview, summary, charts } =
    useLoaderData<typeof adminDashboardLoader>();
  const { admin, isSuperAdmin } = useOutletContext<{
    admin: AdminUser;
    isSuperAdmin: boolean;
  }>();

  // The top date filter drives the headline KPI tiles; each chart below keeps
  // its own dropdown and refetches independently.
  const summaryData = useDashboardSummary(
    summary.period,
    summary.activeUsers,
    summary.newRegistrations,
  );
  const activeUsersSeries = useActiveUsersSeries(charts.activeUsers);
  const newRegistrationsSeries = useNewRegistrationsSeries(
    charts.newRegistrations,
  );

  const stats = toStats(
    overview,
    summaryData.activeUsers,
    summaryData.newRegistrations,
    isSuperAdmin,
  );
  const genderData = toGenderData(overview.demographics);
  const ageData = toAgeData(overview.demographics);
  const sectorData = toSectorData(overview.partners.sectors);
  const showPartnerSectors =
    overview.partners.total !== null && sectorData.length > 0;

  return (
    <div className="min-h-screen space-y-4 bg-(--admin-page-bg) px-8 py-7">
      <div className="flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-(--admin-text)">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-(--admin-text-secondary)">
            Platform overview and things that need your attention
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RangeSelect
            options={CHART_PERIOD_OPTIONS}
            value={summaryData.period}
            onChange={(id) => summaryData.setPeriod(id as ChartPeriod)}
            disabled={summaryData.loading}
            withCalendar
          />
          {summaryData.error && (
            <p
              role="status"
              className="text-xs text-rose-600 dark:text-rose-400"
            >
              {summaryData.error}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-4">
        <WelcomeCard admin={admin} className="flex-[1_1_480px]" />
        <QuickActionsCard
          actions={QUICK_ACTIONS}
          className="min-w-70 flex-[1_1_300px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((item, i) => (
          <KpiCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ActiveUsersChart series={activeUsersSeries} />
        <NewSignupsChart series={newRegistrationsSeries} />
      </div>

      <div
        className={`grid grid-cols-1 gap-4 ${showPartnerSectors ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        <GenderBreakdownChart data={genderData} />
        <AgeGroupsChart data={ageData} />
        {showPartnerSectors && <PartnerSectorsChart data={sectorData} />}
      </div>
    </div>
  );
}
