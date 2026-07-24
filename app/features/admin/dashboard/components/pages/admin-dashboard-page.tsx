import { useState } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import {
  Users,
  Handshake,
  ShieldAlert,
  UserCog,
  Bell,
  UserPlus,
  Building2,
  ClipboardList,
} from "lucide-react";

import { KpiCard } from "../kpi-card";
import { WelcomeCard } from "../welcome-card";
import { QuickActionsCard } from "../quick-actions-card";
import { RegistrationsChart } from "../registrations-chart";
import { ActiveUsersChart } from "../active-users-chart";
import { GenderBreakdownChart } from "../gender-breakdown-chart";
import { AgeGroupsChart } from "../age-groups-chart";
import { PartnerSectorsChart } from "../partner-sectors-chart";
import { SendNotificationDialog } from "~/features/admin/notifications/components/send-notification-dialog";
import { InviteMemberFlow } from "../invite-member-flow";
import type { AdminUser } from "~/types/api-client";
import type { adminDashboardLoader } from "../../services/admin-dashboard.loader";
import type {
  AdminDashboardData,
  StatItem,
  ChartBarItem,
  GenderItem,
  AgeItem,
  PartnerSector,
  ActiveUserPoint,
  QuickAction,
} from "../../types";

// ── static data ───────────────────────────────────────────────────────────
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
    to: "/tk-admin/partners",
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

// Real, working actions come first; the rest are placeholders shown as
// "coming soon" so the row still reads like the design.
const BASE_QUICK_ACTIONS: Omit<QuickAction, "onClick">[] = [
  {
    id: "invite-team",
    label: "Invite Team",
    subtitle: "Collaborator Access",
    icon: UserCog,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  {
    id: "send-notification",
    label: "Send Notification",
    subtitle: "Platform Broadcast",
    icon: Bell,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    id: "add-user",
    label: "Add User",
    subtitle: "Coming soon",
    icon: UserPlus,
    iconClass: "bg-(--admin-card-muted) text-(--admin-text-secondary)",
    disabled: true,
  },
  {
    id: "add-partner",
    label: "Add Partner",
    subtitle: "Coming soon",
    icon: Building2,
    iconClass: "bg-(--admin-card-muted) text-(--admin-text-secondary)",
    disabled: true,
  },
  {
    id: "create-listing",
    label: "Create Listing",
    subtitle: "Coming soon",
    icon: ClipboardList,
    iconClass: "bg-(--admin-card-muted) text-(--admin-text-secondary)",
    disabled: true,
  },
];

// ── mappers ───────────────────────────────────────────────────────────────
function toStats(summary: AdminDashboardData["summary"]): StatItem[] {
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
      value: typeof value === "number" ? value.toLocaleString("en-US") : "—",
    };
  });
}

function toRegistrationData(
  newRegistrations: AdminDashboardData["newRegistrations"],
): ChartBarItem[] {
  const peak = Math.max(...newRegistrations.trend.map((p) => p.count));
  return newRegistrations.trend.map((p) => ({
    day: p.label,
    value: p.count,
    highlight: p.count === peak,
  }));
}

function toActiveUsersData(
  activeUsers: AdminDashboardData["activeUsers"],
): ActiveUserPoint[] {
  return activeUsers.trend.map((p) => ({ time: p.label, value: p.count }));
}

function toGenderData(
  demographics: AdminDashboardData["demographics"],
): GenderItem[] {
  return demographics.genderBreakdown.map((item, i) => ({
    name: item.label,
    value: item.count,
    color:
      GENDER_COLORS[item.label.toLowerCase()] ??
      GENDER_FALLBACK_COLORS[i % GENDER_FALLBACK_COLORS.length],
  }));
}

function toAgeData(
  demographics: AdminDashboardData["demographics"],
): AgeItem[] {
  return demographics.ageGroups.map((item) => ({
    range: item.label,
    value: item.count,
  }));
}

function toSectorData(
  partners: AdminDashboardData["partners"],
): PartnerSector[] {
  if (!Array.isArray(partners.sectors)) return [];

  const totals = new Map<string, { name: string; value: number }>();

  for (const raw of partners.sectors) {
    if (typeof raw !== "object" || raw === null) continue;
    const { label, name, count, value } = raw as Record<string, unknown>;
    const sectorName =
      typeof label === "string"
        ? label
        : typeof name === "string"
          ? name
          : null;
    const sectorValue =
      typeof count === "number"
        ? count
        : typeof value === "number"
          ? value
          : null;
    if (sectorName === null || sectorValue === null) continue;

    for (const part of sectorName.split(",")) {
      const display = part.trim().replace(/\s+/g, " ");
      if (!display) continue;
      const key = display.toLowerCase();
      const existing = totals.get(key);
      if (existing) {
        existing.value += sectorValue;
      } else {
        totals.set(key, { name: display, value: sectorValue });
      }
    }
  }

  return [...totals.values()]
    .sort((a, b) => b.value - a.value)
    .map((entry, i) => ({
      ...entry,
      color: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }));
}

// ── page ──────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { dashboard } = useLoaderData<typeof adminDashboardLoader>();
  const { admin, isSuperAdmin } = useOutletContext<{
    admin: AdminUser;
    isSuperAdmin: boolean;
  }>();
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const stats = toStats(dashboard.summary).map((stat) =>
    !isSuperAdmin && (stat.id === "users" || stat.id === "partners")
      ? { ...stat, disabled: true }
      : stat,
  );
  const registrationData = toRegistrationData(dashboard.newRegistrations);
  const activeUsersData = toActiveUsersData(dashboard.activeUsers);
  const genderData = toGenderData(dashboard.demographics);
  const ageData = toAgeData(dashboard.demographics);
  const sectorData = toSectorData(dashboard.partners);
  const showPartnerSectors =
    dashboard.partners.total !== null && sectorData.length > 0;

  const quickActions: QuickAction[] = BASE_QUICK_ACTIONS.map((action) => {
    if (action.disabled) return action;
    if (!isSuperAdmin) return { ...action, disabled: true };
    if (action.id === "send-notification") {
      return { ...action, onClick: () => setShowNotificationDialog(true) };
    }
    if (action.id === "invite-team") {
      return { ...action, onClick: () => setShowInviteModal(true) };
    }
    return action;
  });

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6 dark:bg-slate-950">
      <div>
        <h1 className="text-2xl font-bold text-(--admin-text)">Dashboard</h1>
        <p className="mt-1 text-(--admin-text-secondary)">
          Platform overview and things that need your attention
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <WelcomeCard admin={admin} className="lg:col-span-7" />
        <QuickActionsCard actions={quickActions} className="lg:col-span-5" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((item, i) => (
          <KpiCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          className={`grid grid-cols-1 gap-6 ${showPartnerSectors ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
        >
          <GenderBreakdownChart data={genderData} />
          <AgeGroupsChart data={ageData} />
          {showPartnerSectors && <PartnerSectorsChart data={sectorData} />}
        </div>
      </div>

      <SendNotificationDialog
        show={showNotificationDialog}
        onClose={() => setShowNotificationDialog(false)}
      />

      <InviteMemberFlow
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}
