import { adminOtpLoader } from "../services/admin-login-otp.loader";
import { adminOtpAction } from "../services/admin-login-otp.action";
import AdminLoginOtpPage from "../components/pages/admin-login-otp-page";

export const loader = adminOtpLoader;
export const action = adminOtpAction;

export function meta() {
  return [{ title: "Verify Admin Sign In | True Khmer" }];
}

export default function AdminLoginOtp() {
  return <AdminLoginOtpPage />;
}
