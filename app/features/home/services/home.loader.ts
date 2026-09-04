import type { LoaderFunctionArgs } from "react-router";
import { getUser, getUserId } from "~/lib/server/session.server";
import { isResourceUnavailable } from "~/lib/server/api-client.server";
import { GetLaunchpadProjectsPaginated } from "~/api/launchpad/launchpad.server";
import {
  getPublicVolunteerOpportunities,
  getVolunteerOpportunities,
} from "~/api/volunteer/volunteer.server";
import { getUpcomingEvents } from "~/features/events/lib/events.server";
import { getPlumpiEvents } from "~/api/events/events.server";
import { EventListItemSchema } from "~/features/events/types/events";
import { getPublicQuestionPagination } from "~/api/forum/forum-question.server";
import { getPublicBlogPosts } from "~/api/blog/blog-public.server";
import { listPublicCourses } from "~/api/education/education.server";
import { toCourseSummary } from "~/features/education/lib/map-catalog";

const LAUNCHPAD_LIMIT = 6;
const VOLUNTEER_LIMIT = 6;
const DISCUSSION_LIMIT = 6;
const BLOG_POST_LIMIT = 6;
const EVENTS_POST_LIMIT = 4;
const COURSE_LIMIT = 4;

export async function homeLoader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  const [
    user,
    launchpads,
    volunteers,
    upcomingEvents,
    discussions,
    blogPosts,
    events,
    courses,
  ] = await Promise.all([
    getUser(request),
    loadLaunchpads(request),
    loadVolunteers(request, userId),
    safe(() => getUpcomingEvents(), []),
    loadDiscussions(request),
    loadBlogPosts(request),
    loadEvents(request),
    loadCourses(request),
  ]);

  return {
    user,
    launchpads,
    volunteers,
    upcomingEvents,
    discussions,
    blogPosts,
    events,
    courses,
  };
}

async function loadDiscussions(request: Request) {
  return safe(async () => {
    const result = await getPublicQuestionPagination(request, {
      limit: DISCUSSION_LIMIT,
      isTrending: true,
    });
    return result?.data?.questions ?? [];
  }, []);
}

async function loadLaunchpads(request: Request) {
  return safe(async () => {
    const result = await GetLaunchpadProjectsPaginated(request, {
      limit: LAUNCHPAD_LIMIT,
    });
    return result.launchpads;
  }, []);
}

async function loadVolunteers(request: Request, userId: string | null) {
  return safe(async () => {
    const filter = { limit: VOLUNTEER_LIMIT };
    const result = userId
      ? await getVolunteerOpportunities(request, filter)
      : await getPublicVolunteerOpportunities(request, filter);
    return result?.data?.opportunities ?? [];
  }, []);
}

async function loadBlogPosts(request: Request) {
  return safe(async () => {
    const result = await getPublicBlogPosts(request, {
      pageSize: BLOG_POST_LIMIT,
    });
    return result?.data?.data ?? [];
  }, []);
}

async function loadEvents(request: Request) {
  return safe(async () => {
    const result = await getPlumpiEvents(request, {
      limit: EVENTS_POST_LIMIT,
      status: "PUBLISHED",
      visibility: "LISTED",
      startDate: new Date().toISOString(),
      sortBy: "startAt",
      sortOrder: "asc",
    });

    return result.data.events.flatMap((event) => {
      const parsed = EventListItemSchema.safeParse(event);
      if (!parsed.success) {
        console.error("Skipped a malformed Plumpi event row:", parsed.error);
        return [];
      }
      return [parsed.data];
    });
  }, []);
}

async function loadCourses(request: Request) {
  return safe(async () => {
    const result = await listPublicCourses(request, {
      page: 1,
      limit: COURSE_LIMIT,
      sortBy: "newest",
    });
    return (result?.data?.courses ?? []).map(toCourseSummary);
  }, []);
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isResourceUnavailable(error, "a homepage section")) return fallback;
    throw error;
  }
}
