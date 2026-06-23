import { Suspense } from "react";
import { Await, useLoaderData, useLocation, useNavigation } from "react-router";

import { UserManagementEmptyState } from "../components/user-management-empty-state";
import { UserManagementHeader } from "../components/user-management-header";
import { UserManagementPageSkeleton } from "../components/user-management-page-skeleton";
import {
  UserManagementPagination,
  UserManagementPaginationSkeleton,
} from "../components/user-management-pagination";
import {
  UserManagementTableSkeleton,
  UserTable,
} from "../components/user-management-table";
import {
  UserManagementToolbar,
  UserManagementToolbarSkeleton,
} from "../components/user-management-toolbar";
import { userManagementAction } from "../service/user-management.action";
import { userManagementLoader } from "../service/user-management.loader";

export const loader = userManagementLoader;
export const action = userManagementAction;

export function meta() {
  return [{ title: "User Management | True Khmer" }];
}

export function HydrateFallback() {
  return <UserManagementPageSkeleton />;
}

export default function UserManagementRoute() {
  const { users } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigation = useNavigation();

  const isLoadingUsers =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  return (
    <Suspense fallback={<UserManagementPageSkeleton />}>
      <Await resolve={users}>
        {(result) => (
          <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-350">
              <UserManagementHeader />

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
