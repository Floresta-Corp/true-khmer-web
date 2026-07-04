import { isRouteErrorResponse, useRouteError } from "react-router";

import { UserManagementPageSkeleton } from "../components/user-management-page-skeleton";
import UserManagementPage from "../components/pages/user-management-page";
import { userManagementAction } from "../services/user-management.action";
import { userManagementLoader } from "../services/user-management.loader";
import { AccessRestricted } from "~/features/admin/components/access-restricted";

export const loader = userManagementLoader;
export const action = userManagementAction;

export function meta() {
  return [{ title: "User Management | True Khmer" }];
}

export function HydrateFallback() {
  return <UserManagementPageSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function UserManagementRoute() {
  return <UserManagementPage />;
}
