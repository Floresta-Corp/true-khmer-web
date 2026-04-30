import { apiRequestWithOptionalSession, apiRequestWithSession } from "~/lib/server/api-client.server";
import type { GetTrendingTagsResponse } from "../forum-types";

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

export async function getPublicTrendingTags(request: Request) {
    const result = await apiRequestWithOptionalSession<GetTrendingTagsResponse>(
        request,
        "/forum/public/questions/trending-tags",
        {
            method: "GET",
        },
    );

    return result;
}