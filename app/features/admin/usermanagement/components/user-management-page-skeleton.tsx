import { UserManagementStatsCardsSkeleton } from "./user-management-card-stats";
import { UserManagementHeader } from "./user-management-header";
import { UserManagementPaginationSkeleton } from "./user-management-pagination";
import { UserManagementTableSkeleton } from "./user-management-table";
import { UserManagementToolbarSkeleton } from "./user-management-toolbar";

export function UserManagementPageSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-350">
        <UserManagementHeader />

        <UserManagementStatsCardsSkeleton />

        <section className="flex h-[clamp(32rem,calc(100dvh-12rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <UserManagementToolbarSkeleton />
          <UserManagementTableSkeleton rows={10} />
          <UserManagementPaginationSkeleton />
        </section>
      </div>
    </main>
  );
}
