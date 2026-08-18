// ── API response shapes ─────────────────────────────────────────────────────
// The admin dashboard API is split into three independently-filterable
// endpoints. Everything below is derived from the generated client so there is
// a single source of truth — regenerate with `bun run api` when the spec moves.

import type {
  AdminDashboardActiveUsersResponse,
  AdminDashboardErrorResponse,
  AdminDashboardNewRegistrationsResponse,
} from "~/types/api-client";

export type {
  AdminDashboardActiveUsersResponse,
  AdminDashboardErrorResponse,
  AdminDashboardNewRegistrationsResponse,
};

export type MetricPoint = { label: string; count: number };
export type DatedMetricPoint = MetricPoint & { date: string };

export type ActiveUsersData = AdminDashboardActiveUsersResponse["activeUsers"];
export type NewRegistrationsData =
  AdminDashboardNewRegistrationsResponse["newRegistrations"];

/** Chart range values accepted by the active-users / new-registrations endpoints. */
export type ChartPeriod = ActiveUsersData["period"];

/**
 * Narrowed view of `AdminDashboardOverviewResponse["dashboard"]`. The generated
 * schema types `totalPartners`, `partners.total` and `partners.sectors` as
 * `unknown` (the spec leaves them untyped), so this restates the shape the UI
 * actually relies on. Everything else here derives from the generated client.
 */
export type DashboardOverview = {
  summary: {
    totalUsers: number;
    totalPartners: number | null;
    openReports: number;
  };
  demographics: {
    genderBreakdown: MetricPoint[];
    ageGroups: MetricPoint[];
  };
  partners: {
    total: number | null;
    sectors: MetricPoint[] | null;
  };
};

export type DashboardOverviewResponse = {
  ok: true;
  dashboard: DashboardOverview;
};

/** A chart's live series state, owned by the page and shared with its KPI tile. */
export type ChartSeries<T> = {
  /** The last payload that loaded successfully — never the failed period's. */
  data: T;
  period: ChartPeriod;
  loading: boolean;
  /** Set when the most recent fetch failed, so `data` predates `period`. */
  error: string | null;
  setPeriod: (period: ChartPeriod) => void;
};

export type StatItem = {
  id: string;
  label: string;
  value: string;
  /** e.g. "+12%" — omitted when no comparison data exists. */
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
};

export type NewSignupBar = {
  day: string;
  value: number;
};

export type ActiveUserPoint = {
  time: string;
  value: number;
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
};

export type QuickAction = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  to?: string;
  onSelect?: () => void;
  disabledReason?: string;
};

export type RangeOption = {
  id: string;
  label: string;
};

export const TEXT_SECONDARY = "var(--admin-text-secondary)";
export const TEXT_MUTED = "var(--admin-text-muted)";
export const GRID_COLOR = "var(--admin-grid)";

/** True Khmer Royal Blue — primary brand color used across charts. */
export const BRAND_COLOR = "#1c5dd4"; // --tk-primary-600
export const BRAND_FILL = "#d5e2fa"; // --tk-primary-100

/** Distinct hues for categorical bar/segment charts so each row reads apart. */
export const CATEGORICAL_COLORS = [
  "#1c5dd4",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
] as const;

export const TOOLTIP_STYLE = {
  border: "1px solid var(--admin-tooltip-border)",
  borderRadius: "12px",
  fontSize: "11px",
  padding: "8px 12px",
  color: TEXT_SECONDARY,
  backgroundColor: "var(--admin-tooltip-bg)",
} as const;

export const TOOLTIP_CURSOR = {
  fill: "var(--admin-card-muted)",
  radius: 8,
} as const;

export type PeriodOption = { id: ChartPeriod; label: string };

/** Period presets exposed by the chart endpoints — must match the backend enum. */
export const CHART_PERIOD_OPTIONS: PeriodOption[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "12w", label: "Last 12 weeks" },
  { id: "6m", label: "Last 6 months" },
  { id: "12m", label: "Last 12 months" },
];

export const DEFAULT_ACTIVE_USERS_PERIOD: ChartPeriod = "7d";
export const DEFAULT_NEW_REGISTRATIONS_PERIOD: ChartPeriod = "7d";

/** Period the top-of-page date filter starts on; drives the headline KPI tiles. */
export const DEFAULT_SUMMARY_PERIOD: ChartPeriod = "7d";

/** Coerce an untrusted query value into a valid ChartPeriod. */
export function resolveChartPeriod(
  value: string | null | undefined,
  fallback: ChartPeriod,
): ChartPeriod {
  return CHART_PERIOD_OPTIONS.some((option) => option.id === value)
    ? (value as ChartPeriod)
    : fallback;
}
