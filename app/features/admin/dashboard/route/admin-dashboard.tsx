import { adminDashboardLoader } from "../services/admin-dashboard.loader";
import AdminDashboardPage from "../components/pages/admin-dashboard-page";

export function meta() {
  return [{ title: "Admin Dashboard | True Khmer" }];
}

export const loader = adminDashboardLoader;

export default function AdminDashboard() {
  return <AdminDashboardPage />;
}
