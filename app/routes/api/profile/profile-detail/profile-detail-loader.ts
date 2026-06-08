import { GetProfileById } from "~/services/profile/profile.server";
import type { Route as ProfileDetailRoute } from "project-types/profile/routes/+types/profile.$id";

export async function ProfileDetailLoader({
  request,
  params,
}: ProfileDetailRoute.LoaderArgs) {
  if (!params.id) {
    throw new Response("Profile ID is required", { status: 400 });
  }

  const result = await GetProfileById(request, params.id);
  return { profile: result.data.profile };
}
