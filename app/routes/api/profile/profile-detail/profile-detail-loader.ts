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

  try {
    if (
      sourceType === "forum" ||
      sourceType === "volunteer" ||
      sourceType === "project"
    ) {
      const cursor = url.searchParams.get("cursor") ?? undefined;
      const result = await GetPostedContent(
        request,
        params.id,
        sourceType,
        cursor,
        10,
      );

      return {
        kind: "posted" as const,
        postedContent: { ...result.data, sourceType },
      };
    }

    const result = await GetProfileById(request, params.id);
    return { kind: "profile" as const, profile: result.data.profile };
  } catch {
    return { kind: "profile" as const, profile: null };
  }
}
