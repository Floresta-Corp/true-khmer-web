import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  AuthChangePasswordRequest,
  ChangePasswordResponse,
} from "~/types/api-client";

export function deleteAccount(request: Request) {
  return apiRequestWithSession<{
    ok: true;
    userId: string;
    status: "DELETED";
    deletedAt: string | null;
  }>(request, "/auth/account?confirm=true", { method: "DELETE" });
}

export function changePassword(
  request: Request,
  body: AuthChangePasswordRequest,
) {
  return apiRequestWithSession<
    ChangePasswordResponse,
    AuthChangePasswordRequest
  >(request, "/auth/change-password", {
    method: "POST",
    body,
  });
}
