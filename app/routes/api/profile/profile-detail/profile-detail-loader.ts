import { z } from "zod";
import {
  GetProfileById,
  GetPostedContent,
} from "~/services/profile/profile.server";
import type { Route as ProfileDetailRoute } from "project-types/profile/routes/+types/profile.$id";

const ProfileIdSchema = z.string().min(1);
const ProfileSourceTypeSchema = z.enum(["forum", "volunteer", "project"]);
const CursorSchema = z.string().min(1).optional();

export async function ProfileDetailLoader({
  request,
  params,
}: ProfileDetailRoute.LoaderArgs) {
  const idResult = ProfileIdSchema.safeParse(params.id);
  if (!idResult.success) {
    throw new Response("Profile ID is required", { status: 400 });
  }

  const url = new URL(request.url);
  const sourceTypeResult = ProfileSourceTypeSchema.safeParse(
    url.searchParams.get("sourceType"),
  );
  const cursorResult = CursorSchema.safeParse(
    url.searchParams.get("cursor") ?? undefined,
  );

  try {
    if (sourceTypeResult.success) {
      const cursor = cursorResult.success ? cursorResult.data : undefined;
      const result = await GetPostedContent(
        request,
        idResult.data,
        sourceTypeResult.data,
        cursor,
        10,
      );

      return {
        kind: "posted" as const,
        postedContent: { ...result.data, sourceType: sourceTypeResult.data },
      };
    }

    const result = await GetProfileById(request, idResult.data);
    return { kind: "profile" as const, profile: result.data.profile };
  } catch {
    return { kind: "profile" as const, profile: null };
  }
}
