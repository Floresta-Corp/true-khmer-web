import { isRouteErrorResponse, Link, useRouteError } from "react-router";

import { Button } from "~/components/ui/button";
import { UserManagementDetailPage } from "../components/user-management-detail-page";
import { UserManagementDetailSkeleton } from "../components/user-management-detail-skeleton";
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
  return <UserManagementDetailPage />;
}
