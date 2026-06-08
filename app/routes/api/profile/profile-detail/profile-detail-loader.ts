import {
  GetProfileById,
  GetPostedContent,
} from "~/services/profile/profile.server";
import type { Route as ProfileDetailRoute } from "project-types/profile/routes/+types/profile.$id";

export async function ProfileDetailLoader({
  request,
  params,
}: ProfileDetailRoute.LoaderArgs) {
  if (!params.id) {
    throw new Response("Profile ID is required", { status: 400 });
  }

  const url = new URL(request.url);
  const sourceType = url.searchParams.get("sourceType");

  if (
    sourceType === "forum" ||
    sourceType === "volunteer" ||
    sourceType === "project"
  ) {
    const result = await GetPostedContent(request, params.id, sourceType);
    return { kind: "posted" as const, postedContent: result.data };
  }

  const result = await GetProfileById(request, params.id);
  return { kind: "profile" as const, profile: result.data.profile };
}
