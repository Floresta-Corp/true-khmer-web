import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { GetTrendingTagsResponse } from "../types";

export async function getTrendingTags(request: Request) {
    const result = await apiRequestWithSession<GetTrendingTagsResponse>(
        request,
        "/forum/questions/trending-tags",
        {
            method: "GET",
        },
    );

    return result;
}