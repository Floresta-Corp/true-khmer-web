import type { LoaderFunctionArgs } from "react-router";
import { requireUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import { getMyApplicationDetailResponse } from "~/services/myspace/server/my-application.server";
import type {
  ApplicationDetail,
  MyApplicationRequestSourceType,
} from "~/services/myspace/types";
import { MyApplicationRequestSourceTypeSchema } from "~/services/myspace/types";

export type MyApplicationDetailLoaderData = {
  application: ApplicationDetail;
  postingId: string;
  applicationTitle: string;
  sourceType: MyApplicationRequestSourceType;
  statusLabel: string;
  userId: string | null;
};

export async function MyApplicationDetailLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  await requireUser(request);

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

  const [detailResult, userId] = await Promise.all([
    getMyApplicationDetailResponse(request, parsedSourceType.data, postingId),
    getUserId(request),
  ]);

  const application = detailResult.data.application;

  return {
    application,
    postingId,
    applicationTitle: application.title || "Application",
    sourceType: parsedSourceType.data,
    statusLabel: application.status,
    userId: userId || null,
  } satisfies MyApplicationDetailLoaderData;
}
