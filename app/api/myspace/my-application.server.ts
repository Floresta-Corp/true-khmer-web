import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicationArchiveAction,
  ApplicationSourceType,
  ApplicationStatusAction,
  MyApplicationArchiveActionResponse,
  GetMyApplicationDetailResponse,
  GetMyApplicationResponse,
  MyApplicationFilter,
  MyApplicationListType,
  MyApplicationStatusActionResponse,
} from "~/features/myspace/types";
import {
  MyApplicationRequestSourceTypeSchema,
  MyApplicationArchiveActionSchema,
  MyApplicationStatusActionSchema,
  GetMyApplicationResponseSchema,
  GetMyApplicationDetailResponseSchema,
  MyApplicationArchiveActionResponseSchema,
  MyApplicationStatusActionResponseSchema,
} from "~/features/myspace/types";

export interface MyApplicationQueryParams {
  type?: MyApplicationListType;
  filter?: MyApplicationFilter;
}

export async function getMyApplicationResponse(
  request: Request,
  queryParams: MyApplicationQueryParams,
) {
  const searchParams = new URLSearchParams();
  if (queryParams.type) {
    searchParams.set("type", queryParams.type);
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
  return {
    ...result,
    data: GetMyApplicationResponseSchema.parse(result.data),
  };
}

export async function getMyApplicationDetailResponse(
  request: Request,
  sourceType: ApplicationSourceType,
  postingId: string,
) {
  const url = `/my-application/${encodeURIComponent(
    sourceType,
  )}/${encodeURIComponent(postingId)}`;

  const result = await apiRequestWithSession<GetMyApplicationDetailResponse>(
    request,
    url,
    {
      method: "GET",
    },
  );
  return {
    ...result,
    data: GetMyApplicationDetailResponseSchema.parse(result.data),
  };
}

export async function postMyApplicationChangeStatus(
  request: Request,
  sourceType: ApplicationSourceType,
  applicationId: string,
  statusAction: ApplicationStatusAction,
) {
  const parsedSourceType =
    MyApplicationRequestSourceTypeSchema.parse(sourceType);
  const parsedStatusAction =
    MyApplicationStatusActionSchema.parse(statusAction);
  const url = `/my-application/${encodeURIComponent(
    parsedSourceType,
  )}/${encodeURIComponent(applicationId)}/change-status/${encodeURIComponent(
    parsedStatusAction,
  )}`;

  const result = await apiRequestWithSession<MyApplicationStatusActionResponse>(
    request,
    url,
    {
      method: "POST",
    },
  );
  return {
    ...result,
    data: MyApplicationStatusActionResponseSchema.parse(result.data),
  };
}

export async function postMyApplicationArchiveAction(
  request: Request,
  sourceType: ApplicationSourceType,
  opportunityId: string,
  archiveAction: ApplicationArchiveAction,
) {
  const parsedSourceType =
    MyApplicationRequestSourceTypeSchema.parse(sourceType);
  const parsedArchiveAction =
    MyApplicationArchiveActionSchema.parse(archiveAction);
  const url = `/my-application/${encodeURIComponent(
    parsedSourceType,
  )}/${encodeURIComponent(opportunityId)}/archive/${encodeURIComponent(
    parsedArchiveAction,
  )}`;

  const result =
    await apiRequestWithSession<MyApplicationArchiveActionResponse>(
      request,
      url,
      {
        method: "POST",
      },
    );
  return {
    ...result,
    data: MyApplicationArchiveActionResponseSchema.parse(result.data),
  };
}
