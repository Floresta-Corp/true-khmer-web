import { UserManagementPage } from "../components/user-management-page";

export function meta() {
  return [{ title: "Add User | True Khmer Admin" }];
}

export default function UserManagementAddRoute() {
  return <UserManagementPage initialAddModalOpen />;
}
