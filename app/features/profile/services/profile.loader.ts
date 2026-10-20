import { z } from "zod";
import {
  GetProfileById,
  GetPostedContent,
  GetProfileCertificates,
} from "~/api/profile/profile.server";
import {
  ProfileRestrictedCodeSchema,
  type GetPostedContentResponse,
  type ProfileRestrictedCode,
} from "~/features/profile/types";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import type { ProfileCertificate } from "~/features/education/types";
import {
  collectCertificates,
  toProfileCertificate,
} from "~/api/education/education.server";
import { getReportReasons } from "~/api/reporting/reporting.server";
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

function emptyPosted(sourceType: SourceType): NormalizedPosted {
  return {
    sourceType,
    questions: [],
    opportunities: [],
    launchpads: [],
    nextCursor: null,
    hasMore: false,
  } as NormalizedPosted;
}

/**
 * The API answers 403 with a visibility code when the member's Profile
 * Visibility settings don't include this viewer. Anything else is a real
 * failure and is rethrown.
 */
function readRestrictedCode(error: unknown): ProfileRestrictedCode | null {
  if (!(error instanceof ProtectedApiError) || error.status !== 403) {
    return null;
  }
  const parsed = ProfileRestrictedCodeSchema.safeParse(error.code);
  return parsed.success ? parsed.data : null;
}

/** Posted items for a tab; hidden contributions come back empty, not as an error. */
async function loadPosted(
  request: Request,
  userId: string,
  sourceType: SourceType,
  cursor?: string,
) {
  try {
    const result = await GetPostedContent(
      request,
      userId,
      sourceType,
      cursor,
      10,
    );
    return {
      posted: normalizePosted(result.data, sourceType),
      restricted: null,
    };
  } catch (error) {
    const restricted = readRestrictedCode(error);
    if (!restricted) throw error;
    return { posted: emptyPosted(sourceType), restricted };
  }
}

async function loadSharedCertificates(
  request: Request,
  userId: string,
): Promise<ProfileCertificate[]> {
  try {
    const records = await collectCertificates((params) =>
      GetProfileCertificates(request, userId, params),
    );
    return records.map((record) => toProfileCertificate(record));
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

  // Needed by the report dialog behind each question card's actions menu.
  const reportReasons = isClientFetch ? null : await getReportReasons(request);

  try {
    if (sourceTypeResult.success && isClientFetch) {
      const { posted, restricted } = await loadPosted(
        request,
        idResult.data,
        sourceTypeResult.data,
        cursorResult.data,
      );
      return {
        kind: "posted" as const,
        posted,
        restricted,
      };
    }

    const [profileResult, postedResult, certificates] = await Promise.all([
      GetProfileById(request, idResult.data),
      sourceTypeResult.success
        ? loadPosted(request, idResult.data, sourceTypeResult.data)
        : Promise.resolve(null),
      loadSharedCertificates(request, idResult.data),
    ]);

    return {
      kind: "profile" as const,
      profile: profileResult.data.profile,
      access: profileResult.data.access,
      certificates,
      reportReasons,
      ...(postedResult ? { initialPosted: postedResult.posted } : {}),
    };
  } catch (error) {
    const restricted = readRestrictedCode(error);
    if (restricted) {
      return {
        kind: "restricted" as const,
        code: restricted,
        profileId: idResult.data,
      };
    }

    return {
      kind: "profile" as const,
      profile: null,
      access: null,
      certificates: [],
      reportReasons: null,
    };
  }
}
