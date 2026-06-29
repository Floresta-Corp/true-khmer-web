import type { Route } from "project-types/myspace/route/+types/my-application.$sourceType.$postingId";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { getMyApplicationDetailResponse } from "~/api/myspace/my-application.server";
import type {
  ApplicationDetail,
  MyApplicationRequestSourceType,
} from "~/features/myspace/types";
import { MyApplicationRequestSourceTypeSchema } from "~/features/myspace/types";

export type MyApplicationDetailLoaderData = {
  application: ApplicationDetail;
  postingId: string;
  applicationTitle: string;
  sourceType: MyApplicationRequestSourceType;
  statusLabel: string;
  userId: string | null;
};

export async function myApplicationDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const sourceType = params.sourceType;
  const postingId = params.postingId;

  if (!sourceType || !postingId) {
    throw new Response("Application not found", { status: 404 });
  }

  const normalizedSourceType =
    sourceType === "project" ? "projects" : sourceType;
  const parsedSourceType =
    MyApplicationRequestSourceTypeSchema.safeParse(normalizedSourceType);

  if (!parsedSourceType.success) {
    throw new Response("Application not found", { status: 404 });
  }

  const detailResult = await getMyApplicationDetailResponse(
    request,
    parsedSourceType.data,
    postingId,
  );

  const application = detailResult.data.application;

  const payload = {
    application,
    postingId,
    applicationTitle: application.title || "Application",
    sourceType: parsedSourceType.data,
    statusLabel: application.status,
    userId: auth.user.id || null,
  } satisfies MyApplicationDetailLoaderData;

  return withAuthData(auth, payload);
}
