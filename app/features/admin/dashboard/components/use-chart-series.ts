import { useRef, useState } from "react";
import { useFetcher } from "react-router";
import type {
  ActiveUsersData,
  AdminDashboardActiveUsersResponse,
  AdminDashboardErrorResponse,
  AdminDashboardNewRegistrationsResponse,
  ChartPeriod,
  ChartSeries,
  NewRegistrationsData,
} from "../types";

type ActiveUsersResult =
  | AdminDashboardActiveUsersResponse
  | AdminDashboardErrorResponse;
type NewRegistrationsResult =
  | AdminDashboardNewRegistrationsResponse
  | AdminDashboardErrorResponse;

const FALLBACK_ERROR = "Couldn't load this range. Try again.";

/**
 * Holds on to the last payload that actually loaded. A failed refetch must not
 * fall back to the initial snapshot — that would relabel the first period's
 * numbers as the newly selected one.
 */
function useLastLoaded<T>(initial: T, loaded: T | undefined): T {
  const lastLoaded = useRef(initial);
  if (loaded !== undefined) lastLoaded.current = loaded;
  return lastLoaded.current;
}

/** `{ ok: false, error }` responses come back with a 500, not a thrown error. */
function resultError(
  result: ActiveUsersResult | NewRegistrationsResult | undefined,
): string | null {
  if (!result || result.ok !== false) return null;
  return result.error || FALLBACK_ERROR;
}

/**
 * Owns the Active Users chart's own period filter and independently-refetched
 * data, seeded from the server-rendered snapshot.
 */
export function useActiveUsersSeries(
  initial: ActiveUsersData,
): ChartSeries<ActiveUsersData> {
  const fetcher = useFetcher<ActiveUsersResult>();
  const [period, setPeriodState] = useState<ChartPeriod>(initial.period);

  const data = useLastLoaded(
    initial,
    fetcher.data?.ok ? fetcher.data.activeUsers : undefined,
  );

  const setPeriod = (next: ChartPeriod) => {
    setPeriodState(next);
    fetcher.load(`/api/admin/dashboard/active-users?period=${next}`);
  };

  return {
    data,
    period,
    loading: fetcher.state !== "idle",
    error: resultError(fetcher.data),
    setPeriod,
  };
}

export type DashboardSummary = {
  period: ChartPeriod;
  activeUsers: ActiveUsersData;
  newRegistrations: NewRegistrationsData;
  loading: boolean;
  /** Set when either metric's most recent fetch failed; the tiles then show
   * the last period that loaded, not `period`. */
  error: string | null;
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
  const activeUsersFetcher = useFetcher<ActiveUsersResult>();
  const newRegistrationsFetcher = useFetcher<NewRegistrationsResult>();
  const [period, setPeriodState] = useState<ChartPeriod>(initialPeriod);

  const activeUsers = useLastLoaded(
    initialActiveUsers,
    activeUsersFetcher.data?.ok
      ? activeUsersFetcher.data.activeUsers
      : undefined,
  );
  const newRegistrations = useLastLoaded(
    initialNewRegistrations,
    newRegistrationsFetcher.data?.ok
      ? newRegistrationsFetcher.data.newRegistrations
      : undefined,
  );

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

  const error =
    resultError(activeUsersFetcher.data) ??
    resultError(newRegistrationsFetcher.data);

  return { period, activeUsers, newRegistrations, loading, error, setPeriod };
}

export function useNewRegistrationsSeries(
  initial: NewRegistrationsData,
): ChartSeries<NewRegistrationsData> {
  const fetcher = useFetcher<NewRegistrationsResult>();
  const [period, setPeriodState] = useState<ChartPeriod>(initial.period);

  const data = useLastLoaded(
    initial,
    fetcher.data?.ok ? fetcher.data.newRegistrations : undefined,
  );

  const setPeriod = (next: ChartPeriod) => {
    setPeriodState(next);
    fetcher.load(`/api/admin/dashboard/new-registrations?period=${next}`);
  };

  return {
    data,
    period,
    loading: fetcher.state !== "idle",
    error: resultError(fetcher.data),
    setPeriod,
  };
}
