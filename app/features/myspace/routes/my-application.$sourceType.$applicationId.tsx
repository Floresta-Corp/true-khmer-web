import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import { getMyApplicationDetailResponse } from "~/services/myspace/server/my-application.server";
import MyApplicationDetailPage from "../pages/my-application-detail-page";
import type { Route } from "./+types/my-application.$sourceType.$applicationId";

type MyApplicationDetailLoaderData = {
  application: Record<string, unknown>;
  applicationId: string;
  applicationTitle: string;
  sourceType: string;
  statusLabel: string;
  userId: string | null;
};

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireAuthenticatedUser(request);

  const sourceType = params.sourceType;
  const applicationId = params.applicationId;

  if (!sourceType || !applicationId) {
    throw new Response("Application not found", { status: 404 });
  }

  const normalizedSourceType =
    sourceType === "project" ? "projects" : sourceType;
  if (normalizedSourceType !== "volunteer" && normalizedSourceType !== "projects") {
    throw new Response("Application not found", { status: 404 });
  }
  const [detailResult, userId] = await Promise.all([
    getMyApplicationDetailResponse(
      request,
      normalizedSourceType,
      applicationId,
    ),
    getUserId(request),
  ]);

  const rawApplication = detailResult.data as Record<string, unknown> & {
    application?: Record<string, unknown>;
    data?: Record<string, unknown>;
    title?: string;
    status?: string;
    sourceType?: string;
  };
  const application =
    rawApplication.application ?? rawApplication.data ?? rawApplication;
  const applicationTitle =
    (application.title as string | undefined) ??
    (application.opportunity as { title?: string } | undefined)?.title ??
    "Application";
  const statusLabel = String(application.status ?? "ACTIVE").toUpperCase();

  return {
    application,
    applicationId,
    applicationTitle,
    sourceType: normalizedSourceType,
    statusLabel,
    userId: userId || null,
  } satisfies MyApplicationDetailLoaderData;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.applicationTitle ?? "Application Detail";

  return [{ title: `${title} | True Khmer` }];
}

export default function MyApplicationDetailRoute() {
  return <MyApplicationDetailPage />;
}
