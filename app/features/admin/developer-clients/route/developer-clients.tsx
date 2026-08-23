import { isRouteErrorResponse, useRouteError } from "react-router";

import { AccessRestricted } from "~/features/admin/components/access-restricted";
import DeveloperClientsPage from "../components/pages/developer-clients-page";
import { DeveloperClientsPaginationSkeleton } from "../components/developer-clients-pagination";
import { DeveloperClientsTableSkeleton } from "../components/developer-clients-table";
import { DeveloperClientsToolbarSkeleton } from "../components/developer-clients-toolbar";
import { developerClientsAction } from "../services/developer-clients.action";
import { developerClientsLoader } from "../services/developer-clients.loader";

export const loader = developerClientsLoader;
export const action = developerClientsAction;

export function meta() {
  return [{ title: "Developer Clients | True Khmer" }];
}

export function HydrateFallback() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="max-w-full space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <section className="flex h-[clamp(32rem,calc(100dvh-14rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <DeveloperClientsToolbarSkeleton />
          <DeveloperClientsTableSkeleton rows={6} />
          <DeveloperClientsPaginationSkeleton />
        </section>
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function DeveloperClients() {
  return <DeveloperClientsPage />;
}
