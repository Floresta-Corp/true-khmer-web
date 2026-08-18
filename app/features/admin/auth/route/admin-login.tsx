import { adminLoginLoader } from "../services/admin-login.loader";
import { adminLoginAction } from "../services/admin-login.action";
import AdminLoginPage from "../components/pages/admin-login-page";

export const loader = adminLoginLoader;
export const action = adminLoginAction;

export function meta() {
  return [{ title: "Admin Sign In | True Khmer" }];
}

export default function AdminLogin() {
  return <AdminLoginPage />;
}
