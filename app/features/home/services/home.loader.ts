import type { LoaderFunctionArgs } from "react-router";
import { getUser, getUserId } from "~/lib/server/session.server";
import { isResourceUnavailable } from "~/lib/server/api-client.server";
import { GetLaunchpadProjectsPaginated } from "~/api/launchpad/launchpad.server";
import {
  getPublicVolunteerOpportunities,
  getVolunteerOpportunities,
} from "~/api/volunteer/volunteer.server";
import { getUpcomingEvents } from "~/features/events/lib/events.server";
import { getPublicQuestionPagination } from "~/api/forum/forum-question.server";
import { getPublicBlogPosts } from "~/api/blog/blog-public.server";

const LAUNCHPAD_LIMIT = 6;
const VOLUNTEER_LIMIT = 6;
const DISCUSSION_LIMIT = 6;
const BLOG_POST_LIMIT = 6;

export async function homeLoader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  const [user, launchpads, volunteers, upcomingEvents, discussions, blogPosts] =
    await Promise.all([
      getUser(request),
      loadLaunchpads(request),
      loadVolunteers(request, userId),
      safe(() => getUpcomingEvents(), []),
      loadDiscussions(request),
      loadBlogPosts(request),
    ]);

  return {
    user,
    launchpads,
    volunteers,
    upcomingEvents,
    discussions,
    blogPosts,
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

/**
 * The homepage is a set of independent sections, so a failing one shows its
 * fallback rather than blanking the page. An unavailable service logs a single
 * line; anything else — an auth or validation fault — still throws, because
 * those are bugs rather than outages.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isResourceUnavailable(error, "a homepage section")) return fallback;
    throw error;
  }
}
