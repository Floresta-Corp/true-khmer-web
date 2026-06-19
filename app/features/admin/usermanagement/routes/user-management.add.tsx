import { redirect } from "react-router";

export function meta() {
  return [{ title: "Add User | True Khmer Admin" }];
}

export function loader() {
  return redirect("/tk-admin/users");
}

export default function UserManagementAddRoute() {
  return null;
}
