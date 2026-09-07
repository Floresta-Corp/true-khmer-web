import { z } from "zod";
import {
  GetProfileById,
  GetPostedContent,
  GetProfileCertificates,
} from "~/api/profile/profile.server";
import type { GetPostedContentResponse } from "~/features/profile/types";
import type { ProfileCertificate } from "~/features/education/types";
import {
  collectCertificates,
  toProfileCertificate,
} from "~/api/education/education.server";
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

async function loadSharedCertificates(
  request: Request,
  userId: string,
): Promise<ProfileCertificate[]> {
  try {
    const records = await collectCertificates((params) =>
      GetProfileCertificates(request, userId, params),
    );
    return records.map(toProfileCertificate);
  } catch (error) {
    console.warn(
      `[profile] certificates for ${userId} unavailable; rendering without them`,
      error,
    );
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
