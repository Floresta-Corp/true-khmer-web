import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { getMyApplicationDetailResponse } from "~/services/myspace/server/my-application.server";
import { GetMyApplicationDetailResponseSchema } from "~/services/myspace/types/my-application-type";

type MyApplicationDetailLoaderData = {
  application: Record<string, unknown>;
  applicationId: string;
  applicationTitle: string;
  sourceType: string;
  statusLabel: string;
};

export async function myApplicationDetailLoader({
  request,
  params,
}: {
  request: Request;
  params: { sourceType?: string; id?: string };
}) {
  const auth = await requireUser(request);

  const sourceType = params.sourceType;
  const applicationId = params.id;

  if (!sourceType || !applicationId) {
    throw new Response("Application not found", { status: 404 });
  }

  const normalizedSourceType =
    sourceType === "project" ? "projects" : sourceType;
  if (
    normalizedSourceType !== "volunteer" &&
    normalizedSourceType !== "projects"
  ) {
    throw new Response("Application not found", { status: 404 });
  }

  const detailResult = await getMyApplicationDetailResponse(
    request,
    normalizedSourceType,
    applicationId,
  );

  const parsed = GetMyApplicationDetailResponseSchema.parse(detailResult.data);

  const applicationTitle =
    parsed.application.title ||
    parsed.application.opportunity.title ||
    "Application";

  const statusLabel = parsed.application.status.toUpperCase();

  const payload = {
    application: parsed.application,
    applicationId,
    applicationTitle,
    sourceType: normalizedSourceType,
    statusLabel,
  } satisfies MyApplicationDetailLoaderData;

  return withAuthData(auth, payload);
}
