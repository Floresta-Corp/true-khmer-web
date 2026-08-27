import type { Route } from "project-types/course-builder/route/+types/course-builder";
import { getCourseCategories } from "~/api/education/education.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import type { CategoryOption } from "~/features/course-builder/types";

/** Only teaching a course needs the builder, so the route is behind a session. */
export async function courseBuilderLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const result = await getCourseCategories(request);

  const categories: CategoryOption[] = (result?.data?.categories ?? []).map(
    (category) => ({ value: category.id, label: category.name }),
  );

  return withAuthData(auth, { categories });
}
