import type { GetQuestionpaginationResponse } from "~/services/forum/types";
import { apiRequestWithSession } from "./server/api-client.server";

export async function getQuestionPagination(
  request: Request,
  Query: {
    limit?: number;
    cursor?: string;
  },
) {
  const params = new URLSearchParams();
  if (Query.limit != null) params.set("limit", String(Query.limit));
  if (Query.cursor) params.set("cursor", Query.cursor);

  const path = `/forum/question/get-questions-page${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const result = await apiRequestWithSession<GetQuestionpaginationResponse>(
    request,
    path,
    {
      method: "GET",
    },
  );

  return result;
}
