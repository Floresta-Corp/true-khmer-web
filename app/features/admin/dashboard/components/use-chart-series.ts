import { useState } from "react";
import { useFetcher } from "react-router";
import type {
  ActiveUsersData,
  AdminDashboardActiveUsersResponse,
  AdminDashboardNewRegistrationsResponse,
  ChartPeriod,
  ChartSeries,
  NewRegistrationsData,
} from "../types";

/**
 * Owns the Active Users chart's own period filter and independently-refetched
 * data, seeded from the server-rendered snapshot.
 */
export function useActiveUsersSeries(
  initial: ActiveUsersData,
): ChartSeries<ActiveUsersData> {
  const fetcher = useFetcher<AdminDashboardActiveUsersResponse>();
  const [period, setPeriodState] = useState<ChartPeriod>(initial.period);

  const data =
    fetcher.data && "activeUsers" in fetcher.data
      ? fetcher.data.activeUsers
      : initial;

  const setPeriod = (next: ChartPeriod) => {
    setPeriodState(next);
    fetcher.load(`/api/admin/dashboard/active-users?period=${next}`);
  };

  return { data, period, loading: fetcher.state !== "idle", setPeriod };
}

export type DashboardSummary = {
  period: ChartPeriod;
  activeUsers: ActiveUsersData;
  newRegistrations: NewRegistrationsData;
  loading: boolean;
  setPeriod: (period: ChartPeriod) => void;
};

/**
 * Drives the headline KPI tiles from a single period (the top-of-page date
 * filter). Changing it refetches both period-scoped metrics at once, seeded
 * from the server-rendered snapshot so the tiles never flash on first paint.
 */
export function useDashboardSummary(
  initialPeriod: ChartPeriod,
  initialActiveUsers: ActiveUsersData,
  initialNewRegistrations: NewRegistrationsData,
): DashboardSummary {
  const activeUsersFetcher = useFetcher<AdminDashboardActiveUsersResponse>();
  const newRegistrationsFetcher =
    useFetcher<AdminDashboardNewRegistrationsResponse>();
  const [period, setPeriodState] = useState<ChartPeriod>(initialPeriod);

  const activeUsers =
    activeUsersFetcher.data && "activeUsers" in activeUsersFetcher.data
      ? activeUsersFetcher.data.activeUsers
      : initialActiveUsers;
  const newRegistrations =
    newRegistrationsFetcher.data &&
    "newRegistrations" in newRegistrationsFetcher.data
      ? newRegistrationsFetcher.data.newRegistrations
      : initialNewRegistrations;

  const setPeriod = (next: ChartPeriod) => {
    setPeriodState(next);
    activeUsersFetcher.load(`/api/admin/dashboard/active-users?period=${next}`);
    newRegistrationsFetcher.load(
      `/api/admin/dashboard/new-registrations?period=${next}`,
    );
  };

  const loading =
    activeUsersFetcher.state !== "idle" ||
    newRegistrationsFetcher.state !== "idle";

  return { period, activeUsers, newRegistrations, loading, setPeriod };
}

export function useNewRegistrationsSeries(
  initial: NewRegistrationsData,
): ChartSeries<NewRegistrationsData> {
  const fetcher = useFetcher<AdminDashboardNewRegistrationsResponse>();
  const [period, setPeriodState] = useState<ChartPeriod>(initial.period);

  const data =
    fetcher.data && "newRegistrations" in fetcher.data
      ? fetcher.data.newRegistrations
      : initial;

  const setPeriod = (next: ChartPeriod) => {
    setPeriodState(next);
    fetcher.load(`/api/admin/dashboard/new-registrations?period=${next}`);
  };

  return { data, period, loading: fetcher.state !== "idle", setPeriod };
}
