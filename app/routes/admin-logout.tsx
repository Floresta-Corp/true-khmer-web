import {
  adminLogoutAction,
  adminLogoutLoader,
} from "~/features/admin/auth/service/admin-logout.action";

export function meta() {
  return [{ title: "Admin Sign Out | True Khmer" }];
}

export const loader = adminLogoutLoader;

export const action = adminLogoutAction;
