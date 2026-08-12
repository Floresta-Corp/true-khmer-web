import type { Route } from "project-types/admin/manage-content/route/+types/manage-forum";

import { getAdminForumQuestion } from "~/api/admin/manage-forum/manage-forum.server";
import { getPublicCategories } from "~/api/forum/forum.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { questionSortBySchema } from "~/features/forum/types";
import {
  fromStatusParam,
  questionStatusFilterSchema,
} from "~/features/admin/manage-content/types";
import type {
  CategoryResponse,
  GetQuestionsResponse,
} from "~/types/api-client";

const LIMIT = 10;

export type ManageForumLoaderData = {
  data: Promise<GetQuestionsResponse>;
  categories: CategoryResponse[];
};

export async function manageForumLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const categoryId = url.searchParams.get("categoryId");
  const parsedSortBy = questionSortBySchema.safeParse(
    url.searchParams.get("sortBy"),
  );
  const parsedStatus = questionStatusFilterSchema.safeParse(
    fromStatusParam(url.searchParams.get("status")),
  );

  const questions = getAdminForumQuestion(request, auth.accessToken, {
    limit: LIMIT,
    cursor: cursor || undefined,
    categoryId: categoryId || undefined,
    sortBy: parsedSortBy.success ? parsedSortBy.data : "newest",
    status: parsedStatus.success ? parsedStatus.data : undefined,
    search: url.searchParams.get("search")?.trim() || undefined,
  });
  questions.catch(() => {});

  const categories = await getPublicCategories(request);

  return withAuthData(auth, {
    data: questions,
    categories: categories?.data?.categories ?? [],
  } satisfies ManageForumLoaderData);
}
