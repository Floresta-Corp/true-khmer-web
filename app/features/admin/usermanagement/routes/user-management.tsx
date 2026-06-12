import { UserManagementPage } from "../components/user-management-page";

export function meta() {
  return [{ title: "User Management | True Khmer" }];
}

export default function UserManagementRoute() {
  return <UserManagementPage />;
}
