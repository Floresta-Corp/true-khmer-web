import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
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
  await requireAuthenticatedUser(request);

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

  const { data } = await getMyApplicationDetailResponse(
    request,
    normalizedSourceType,
    applicationId,
  );

  const parsed = GetMyApplicationDetailResponseSchema.parse(data);

  const applicationTitle =
    parsed.application.title ||
    parsed.application.opportunity.title ||
    "Application";

  const statusLabel = parsed.application.status.toUpperCase();

  return {
    application: parsed.application,
    applicationId,
    applicationTitle,
    sourceType: normalizedSourceType,
    statusLabel,
  } satisfies MyApplicationDetailLoaderData;
}
