import { Suspense } from "react";
import {
  Await,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "react-router";

import { Button } from "~/components/ui/button";
import { UserManagementDetailHeader } from "../components/user-management-detail-header";
import { UserManagementDetailSkeleton } from "../components/user-management-detail-skeleton";
import {
  ManagementConsole,
  PointsOverview,
  RecentActivity,
  UserSummary,
} from "../components/user-management-detail-sections";
import { userManagementDetailAction } from "../service/user-management-detail.action";
import { userManagementDetailLoader } from "../service/user-management-detail.loader";

export const loader = userManagementDetailLoader;
export const action = userManagementDetailAction;

export function meta() {
  return [{ title: "User Profile | True Khmer" }];
}

export function HydrateFallback() {
  return <UserManagementDetailSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f8fafc] px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {isNotFound ? "User not found" : "Unable to load user"}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
          {isNotFound
            ? "This user may have been removed."
            : "Something went wrong."}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Return to user management and try again.
        </p>
        <Button asChild className="mt-6">
          <Link to="/tk-admin/users">Back to users</Link>
        </Button>
      </div>
    </main>
  );
}

export default function UserManagementDetailRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<UserManagementDetailSkeleton />}>
      <Await resolve={user}>
        {(resolvedUser) => (
          <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">
              <UserManagementDetailHeader />

              <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="space-y-6">
                  <UserSummary user={resolvedUser} />
                  <ManagementConsole user={resolvedUser} />
                </aside>

                <section className="min-w-0 space-y-6">
                  <PointsOverview points={resolvedUser.points} />
                  <RecentActivity activities={resolvedUser.recentActivity} />
                </section>
              </div>
            </div>
          </main>
        )}
      </Await>
    </Suspense>
  );
}
