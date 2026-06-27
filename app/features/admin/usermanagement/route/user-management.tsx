import { UserManagementPageSkeleton } from "../components/user-management-page-skeleton";
import UserManagementPage from "../components/pages/user-management-page";
import { userManagementAction } from "../services/user-management.action";
import { userManagementLoader } from "../services/user-management.loader";

export const loader = userManagementLoader;
export const action = userManagementAction;

export function meta() {
  return [{ title: "User Management | True Khmer" }];
}

export function HydrateFallback() {
  return <UserManagementPageSkeleton />;
}

export default function UserManagementRoute() {
  return <UserManagementPage />;
}
