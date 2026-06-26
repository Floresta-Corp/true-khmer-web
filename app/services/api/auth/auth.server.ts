import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  AuthChangePasswordRequest,
  ChangePasswordResponse,
} from "~/types/api-client";

export function changePassword(
  request: Request,
  body: AuthChangePasswordRequest,
) {
  return apiRequestWithSession<ChangePasswordResponse, AuthChangePasswordRequest>(
    request,
    "/auth/change-password",
    {
      method: "POST",
      body,
    },
  );
}
