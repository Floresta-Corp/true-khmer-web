import { z } from "zod";
import { GetProfileById, GetPostedContent } from "~/api/profile/profile.server";
import type { GetPostedContentResponse } from "~/features/profile/types";
import type { Route } from "project-types/profile/route/+types/profile.$id";

const ProfileIdSchema = z.string().min(1);
const SourceTypeSchema = z.enum(["forum", "volunteer", "project"]);
const CursorSchema = z.string().min(1).optional();

type SourceType = z.infer<typeof SourceTypeSchema>;

function normalizePosted(
  data: GetPostedContentResponse,
  sourceType: SourceType,
) {
  if (sourceType === "forum") {
    const d = data as Extract<
      GetPostedContentResponse,
      { sourceType: "forum" }
    >;
    return {
      sourceType: "forum" as const,
      questions: d.questions,
      opportunities: [] as Extract<
        GetPostedContentResponse,
        { sourceType: "volunteer" }
      >["opportunities"],
      launchpads: [] as Extract<
        GetPostedContentResponse,
        { sourceType: "project" }
      >["launchpads"],
      nextCursor: d.pagination.nextCursor,
      hasMore: d.pagination.hasMore,
    };
  }
  if (sourceType === "volunteer") {
    const d = data as Extract<
      GetPostedContentResponse,
      { sourceType: "volunteer" }
    >;
    return {
      sourceType: "volunteer" as const,
      questions: [] as Extract<
        GetPostedContentResponse,
        { sourceType: "forum" }
      >["questions"],
      opportunities: d.opportunities,
      launchpads: [] as Extract<
        GetPostedContentResponse,
        { sourceType: "project" }
      >["launchpads"],
      nextCursor: d.pagination.nextCursor,
      hasMore: d.pagination.hasMore,
    };
  }
  const d = data as Extract<
    GetPostedContentResponse,
    { sourceType: "project" }
  >;
  return {
    sourceType: "project" as const,
    questions: [] as Extract<
      GetPostedContentResponse,
      { sourceType: "forum" }
    >["questions"],
    opportunities: [] as Extract<
      GetPostedContentResponse,
      { sourceType: "volunteer" }
    >["opportunities"],
    launchpads: d.launchpads,
    nextCursor: d.nextCursor,
    hasMore: d.nextCursor !== null,
  };
}

export type NormalizedPosted = ReturnType<typeof normalizePosted>;

export async function profileLoader({ request, params }: Route.LoaderArgs) {
  const idResult = ProfileIdSchema.safeParse(params.id);
  if (!idResult.success) {
    throw new Response("Profile ID is required", { status: 400 });
  }

  const url = new URL(request.url);
  const sourceTypeResult = SourceTypeSchema.safeParse(
    url.searchParams.get("sourceType"),
  );
  const cursorResult = CursorSchema.safeParse(
    url.searchParams.get("cursor") ?? undefined,
  );

  const isClientFetch = url.searchParams.get("_intent") === "client";

  try {
    if (sourceTypeResult.success && isClientFetch) {
      const result = await GetPostedContent(
        request,
        idResult.data,
        sourceTypeResult.data,
        cursorResult.data,
        10,
      );
      return {
        kind: "posted" as const,
        posted: normalizePosted(result.data, sourceTypeResult.data),
      };
    }

    // SSR with a tab active: fetch profile + first page in parallel.
    if (sourceTypeResult.success) {
      const [profileResult, postedResult] = await Promise.all([
        GetProfileById(request, idResult.data),
        GetPostedContent(
          request,
          idResult.data,
          sourceTypeResult.data,
          undefined,
          10,
        ),
      ]);
      return {
        kind: "profile" as const,
        profile: profileResult.data.profile,
        initialPosted: normalizePosted(
          postedResult.data,
          sourceTypeResult.data,
        ),
      };
    }

    const profileResult = await GetProfileById(request, idResult.data);
    return { kind: "profile" as const, profile: profileResult.data.profile };
  } catch {
    return { kind: "profile" as const, profile: null };
  }
}
