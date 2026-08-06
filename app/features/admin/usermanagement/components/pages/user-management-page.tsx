import { Suspense } from "react";
import { Await, useLoaderData, useLocation, useNavigation } from "react-router";

import { UserManagementEmptyState } from "../user-management-empty-state";
import { UserManagementHeader } from "../user-management-header";
import { UserManagementPageSkeleton } from "../user-management-page-skeleton";
import {
  UserManagementPagination,
  UserManagementPaginationSkeleton,
} from "../user-management-pagination";
import {
  UserManagementTableSkeleton,
  UserTable,
} from "../user-management-table";
import { UserManagementToolbar } from "../user-management-toolbar";
import type { userManagementLoader } from "../../services/user-management.loader";
import {
  UserManagementStatsCards,
  UserManagementStatsCardsSkeleton,
} from "../user-management-card-stats";

export default function UserManagementPage() {
  const { users, stats } = useLoaderData<typeof userManagementLoader>();
  const location = useLocation();
  const navigation = useNavigation();

  const isLoadingUsers =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  return (
    <Suspense fallback={<UserManagementPageSkeleton />}>
      <Await resolve={users}>
        {(result) => (
          <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
            <div className="max-w-full">
              <UserManagementHeader />

              {/* Stats are supplementary: hide the row if it fails rather
                  than leaving a skeleton loading forever. */}
              <Suspense fallback={<UserManagementStatsCardsSkeleton />}>
                <Await resolve={stats} errorElement={<></>}>
                  {(resolvedStats) => (
                    <UserManagementStatsCards stats={resolvedStats} />
                  )}
                </Await>
              </Suspense>

              <section
                className="flex h-[clamp(32rem,calc(100dvh-12rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                aria-busy={isLoadingUsers}
              >
                <UserManagementToolbar />

                {isLoadingUsers ? (
                  <>
                    <UserManagementTableSkeleton rows={6} />
                    <UserManagementPaginationSkeleton />
                  </>
                ) : (
                  <>
                    {result.users.length > 0 ? (
                      <>
                        <UserTable users={result.users} />
                        <UserManagementPagination
                          page={result.page}
                          limit={result.limit}
                          totalPages={result.totalPages}
                          total={result.total}
                        />
                      </>
                    ) : (
                      <UserManagementEmptyState />
                    )}
                  </>
                )}
              </section>
            </div>
          </main>
        )}
      </Await>
    </Suspense>
  );
}
