import type { Route } from "project-types/my-classes/route/+types/my-classes";
import { listMyClasses } from "~/api/education/my-classes.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  MyClassTabSchema,
  type MyClass,
  type MyClassCounts,
  type MyClassesPagination,
  type MyClassesStats,
} from "~/features/my-classes/types";

const PAGE_SIZE = 12;

const EMPTY_COUNTS: MyClassCounts = {
  learning: 0,
  "in-progress": 0,
  saved: 0,
  completed: 0,
};

const EMPTY_STATS: MyClassesStats = {
  inProgress: 0,
  completed: 0,
  timeLearnedSeconds: 0,
  certificates: 0,
};

export async function myClassesLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const url = new URL(request.url);
  const tab = MyClassTabSchema.catch("learning").parse(
    url.searchParams.get("tab") ?? "learning",
  );
  const search = url.searchParams.get("search")?.trim() ?? "";
  const rawPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const result = await listMyClasses(request, {
    tab,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const courses: MyClass[] = result?.data?.courses ?? [];
  const pagination: MyClassesPagination = result?.data?.pagination ?? {
    page,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  return withAuthData(auth, {
    courses,
    counts: result?.data?.counts ?? EMPTY_COUNTS,
    stats: result?.data?.stats ?? EMPTY_STATS,
    pagination,
    tab,
    search,
    pageSize: PAGE_SIZE,
  });
}
