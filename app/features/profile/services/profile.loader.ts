import { z } from "zod";
import {
  GetProfileById,
  GetPostedContent,
  GetProfileCertificates,
} from "~/api/profile/profile.server";
import type { GetPostedContentResponse } from "~/features/profile/types";
import type { ProfileCertificate } from "~/features/education/types";
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

/**
 * The certificates this member shows on their profile.
 *
 * Swallows its own failures: the API already filters to the shared ones, and
 * a certificates endpoint that is down should cost the profile its Certificates
 * card, not the whole page.
 */
async function loadSharedCertificates(
  request: Request,
  userId: string,
): Promise<ProfileCertificate[]> {
  try {
    const result = await GetProfileCertificates(request, userId, { limit: 20 });
    return result.data.certificates.map((certificate) => ({
      id: certificate.id,
      courseId: certificate.courseId,
      courseTitle: certificate.courseTitle,
      certificateNo: certificate.certificateNo,
      completedAt: certificate.completedAt,
      sharedToProfile: certificate.sharedToProfile,
    }));
  } catch {
    return [];
  }
}

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
      const [profileResult, postedResult, certificates] = await Promise.all([
        GetProfileById(request, idResult.data),
        GetPostedContent(
          request,
          idResult.data,
          sourceTypeResult.data,
          undefined,
          10,
        ),
        loadSharedCertificates(request, idResult.data),
      ]);
      return {
        kind: "profile" as const,
        profile: profileResult.data.profile,
        certificates,
        initialPosted: normalizePosted(
          postedResult.data,
          sourceTypeResult.data,
        ),
      };
    }

    const [profileResult, certificates] = await Promise.all([
      GetProfileById(request, idResult.data),
      loadSharedCertificates(request, idResult.data),
    ]);
    return {
      kind: "profile" as const,
      profile: profileResult.data.profile,
      certificates,
    };
  } catch {
    return { kind: "profile" as const, profile: null, certificates: [] };
  }
}
