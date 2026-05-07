import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  GetMySpaceMeResponse,
  GetRecentActivityResponse,
  UpdateMySpaceInput,
  UpdateMySpaceResponse,
} from "../types";

export async function GetMyspaceMe(request: Request) {
  return await apiRequestWithSession<GetMySpaceMeResponse>(request, "/me", {
    method: "GET",
  });
}

export async function GetRecentActivity(request: Request) {
  return await apiRequestWithSession<GetRecentActivityResponse>(
    request,
    "/me/recent-activity",
    {
      method: "GET",
    },
  );
}

export async function UpdateMyspace(request: Request, payload: UpdateMySpaceInput) {
  return await apiRequestWithSession<UpdateMySpaceResponse, UpdateMySpaceInput>(
    request,
    "/me",
    {
      method: "PATCH",
      body: payload,
    },
  );
}
