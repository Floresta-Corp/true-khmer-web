import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicationArchiveAction,
  ApplicationSourceType,
  ApplicationStatusAction,
  GetMyApplicationDetailResponse,
  GetMyApplicationResponse,
} from "../types";
import {
  MyApplicationSourceTypeSchema,
  MyApplicationArchiveActionSchema,
  MyApplicationStatusActionSchema,
  type MyApplicationSourceType,
} from "../types/my-application-type";

function normalizeMyApplicationSourceType(
  sourceType: MyApplicationSourceType,
) {
  return sourceType === "project" ? "projects" : sourceType;
}

function normalizeMyApplicationArchiveAction(
  archiveAction: ApplicationArchiveAction,
) {
  return MyApplicationArchiveActionSchema.parse(archiveAction);
}
export interface MyApplicationQueryParams {
  tab?: string;
  filter?: string;
}

export async function getMyApplicationResponse(
  request: Request,
  queryParams: MyApplicationQueryParams,
) {
  const searchParams = new URLSearchParams();
  if (queryParams.tab) {
    searchParams.set("type", queryParams.tab);
  }
  if (queryParams.filter) {
    searchParams.set("filter", queryParams.filter);
  }
  const url = `/my-application?${searchParams.toString()}`;

  const result = await apiRequestWithSession<GetMyApplicationResponse>(
    request,
    url,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getMyApplicationDetailResponse(
  request: Request,
  sourceType: string,
  applicationId: string,
) {
  const url = `/my-application/${encodeURIComponent(
    sourceType,
  )}/${encodeURIComponent(applicationId)}`;

  const result = await apiRequestWithSession<GetMyApplicationDetailResponse>(
    request,
    url,
    {
      method: "GET",
    },
  );
  return result;
}

export async function postMyApplicationChangeStatus(
  request: Request,
  sourceType: string,
  applicationId: string,
  statusAction: ApplicationStatusAction,
) {
  const parsedSourceType = MyApplicationSourceTypeSchema.parse(sourceType);
  const parsedStatusAction =
    MyApplicationStatusActionSchema.parse(statusAction);
  const normalizedSourceType =
    normalizeMyApplicationSourceType(parsedSourceType);
  const url = `/my-application/${encodeURIComponent(
    normalizedSourceType,
  )}/${encodeURIComponent(applicationId)}/change-status/${encodeURIComponent(
    parsedStatusAction,
  )}`;

  const result = await apiRequestWithSession(request, url, {
    method: "POST",
  });
  return result;
}

export async function postMyApplicationArchiveAction(
  request: Request,
  sourceType: string,
  applicationId: string,
  archiveAction: ApplicationArchiveAction,
) {
  const parsedSourceType = MyApplicationSourceTypeSchema.parse(sourceType);
  return moveToArchived(
    request,
    parsedSourceType,
    applicationId,
    archiveAction,
  );
}

export async function moveToArchived(
  request: Request,
  sourceType: ApplicationSourceType,
  applicationId: string,
  archiveAction: ApplicationArchiveAction,
) {
  const parsedSourceType = MyApplicationSourceTypeSchema.parse(sourceType);
  const normalizedSourceType = normalizeMyApplicationSourceType(
    parsedSourceType,
  );
  const normalizedArchiveAction = normalizeMyApplicationArchiveAction(
    archiveAction,
  );
  const url = `/my-application/${encodeURIComponent(
    normalizedSourceType,
  )}/${encodeURIComponent(applicationId)}/archive/${encodeURIComponent(
    normalizedArchiveAction,
  )}`;

  const result = await apiRequestWithSession(request, url, {
    method: "POST",
  });
  return result;
}
