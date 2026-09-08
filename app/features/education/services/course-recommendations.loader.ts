import {
  listCourseRecommendations,
  listPublicCourses,
} from "~/api/education/education.server";
import type { PublicCourseListItem } from "~/api/education/education.server";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import {
  loadSavedCourseIds,
  withSaveState,
} from "~/features/education/services/course-saves.loader";
import type { CourseSummary } from "~/features/education/types";

export const RECOMMENDED_LIMIT = 4;

interface RecommendationSubject {
  id: string;
  categoryId: string;
}

/**
 * Merges candidate lists into one ordered, de-duplicated set.
 *
 * The lists arrive in preference order, so a Map keyed by id both drops the
 * courses two queries have in common and keeps the earlier list's picks ahead
 * of the later ones'.
 */
function mergeCandidates(
  lists: (PublicCourseListItem[] | undefined)[],
  excludeIds: Set<string>,
  limit: number,
) {
  const picked = new Map<string, PublicCourseListItem>();

  for (const list of lists) {
    for (const item of list ?? []) {
      if (excludeIds.has(item.id) || picked.has(item.id)) continue;
      picked.set(item.id, item);
      if (picked.size >= limit) return [...picked.values()];
    }
  }

  return [...picked.values()];
}

/**
 * The catalogue stand-in for the recommendations endpoint.
 *
 * Same-category first, then the most popular courses, then the newest. The
 * category alone left the row empty for any course that is the only one in its
 * category, and an empty row renders nothing at all — so the section was
 * invisible rather than merely short.
 */
async function loadCatalogueCandidates(
  request: Request,
  subject: RecommendationSubject,
  limit: number,
  excludeIds: Set<string>,
) {
  /* One over the limit on every query: the course being viewed is filtered out
     afterwards, so each list has to be able to spare it. */
  const fetchLimit = limit + 1;

  const [sameCategoryRes, popularRes, newestRes] = await Promise.all([
    listPublicCourses(request, {
      limit: fetchLimit,
      categoryId: subject.categoryId,
      sortBy: "newest",
    }),
    listPublicCourses(request, { limit: fetchLimit, sortBy: "popular" }),
    listPublicCourses(request, { limit: fetchLimit, sortBy: "newest" }),
  ]);

  return mergeCandidates(
    [
      sameCategoryRes?.data?.courses,
      popularRes?.data?.courses,
      newestRes?.data?.courses,
    ],
    excludeIds,
    limit,
  );
}

/**
 * The "Recommended for you" set for a course page.
 *
 * The API ranks the row, so whatever it serves is the row — a short answer
 * means the catalogue holds nothing more worth showing, and topping that up
 * would only spend three more queries to learn the same thing. The catalogue
 * stands in for one case alone: an API that predates the endpoint, which
 * answers `null` rather than a list.
 */
export async function loadCourseRecommendations(
  request: Request,
  subject: RecommendationSubject,
  limit = RECOMMENDED_LIMIT,
): Promise<CourseSummary[]> {
  const [recommendedRes, savedCourseIds] = await Promise.all([
    listCourseRecommendations(request, subject.id, { limit }),
    loadSavedCourseIds(request),
  ]);

  /* Never recommend the course the viewer is already on, whichever list it
     came from. */
  const excludeIds = new Set([subject.id]);
  const served = recommendedRes?.data?.courses;

  const candidates = served
    ? mergeCandidates([served], excludeIds, limit)
    : await loadCatalogueCandidates(request, subject, limit, excludeIds);

  return withSaveState(candidates.map(toCourseSummary), savedCourseIds);
}
