import type { Route as EditProfileRoute } from "project-types/myspace/routes/+types/edit-profile";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import { GetMyspaceMe } from "~/services/myspace/server/me.server";
import type { Profile } from "~/services/myspace/types";

interface EditProfileLoaderData {
  me: Profile | null;
  userId: string | null;
}

export async function EditProfileLoader({
  request,
}: EditProfileRoute.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);
  const meResult = await GetMyspaceMe(request);

  return {
    userId,
    me: meResult.data.profile,
  } satisfies EditProfileLoaderData;
}
