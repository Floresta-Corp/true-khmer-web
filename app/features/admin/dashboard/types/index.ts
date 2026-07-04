import type { AdminDashboardResponse } from "~/types/api-client";

export type AdminDashboardData = AdminDashboardResponse["dashboard"];

export type StatItem = {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  iconBg: string;
  iconColor: string;
  disabled?: boolean;
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
  disabled?: boolean;
};

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
