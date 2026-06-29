import { type ShouldRevalidateFunctionArgs } from "react-router";
import { adminLayoutLoader } from "../services/admin-layout.loader";
import AdminLayout from "../components/pages/admin-layout";

export const loader = adminLayoutLoader;

export function shouldRevalidate({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (formMethod) return true;

  if (
    currentUrl.pathname.startsWith("/tk-admin") &&
    nextUrl.pathname.startsWith("/tk-admin")
  ) {
    return true;
  }

  return defaultShouldRevalidate;
}

export function meta() {
  return [{ title: "Admin Panel | True Khmer" }];
}

export default function AdminLayoutRoute() {
  return <AdminLayout />;
}
