import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

import { UserManagementDetailHeader } from "../user-management-detail-header";
import { UserManagementDetailSkeleton } from "../user-management-detail-skeleton";
import {
  ManagementConsole,
  PointsOverview,
  RecentActivity,
  UserSummary,
} from "../user-management-detail-sections";
import type { userManagementDetailLoader } from "../../services/user-management-detail.loader";

export default function UserManagementDetailPage() {
  const { user } = useLoaderData<typeof userManagementDetailLoader>();

  return (
    <Suspense fallback={<UserManagementDetailSkeleton />}>
      <Await resolve={user}>
        {(resolvedUser) => (
          <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
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
