import type {
  CourseLearnerStats,
  CourseTab,
  CourseWithStats,
  MyCourse,
} from "~/features/course-listing/types";
import { displayStatusOf } from "~/features/course-listing/types";

/**
 * Placeholder courses for the workspace Course Listing.
 *
 * `courses/mine` is wired and takes precedence; these stand in only when it
 * returns nothing, so the screen can be reviewed against the design instead of
 * showing the empty state. The figures on the first row are the design's own
 * (1240 learners, 64/30/6 — 794 + 372 + 74 = 1240).
 */

const OWNER = "00000000-0000-4000-8000-000000000001";
const CATEGORY = "00000000-0000-4000-8000-0000000000c1";

function course(
  partial: Pick<MyCourse, "id" | "title" | "description" | "status"> &
    Partial<MyCourse>,
): MyCourse {
  return {
    categoryId: CATEGORY,
    coverImageKey: null,
    coverImageUrl: null,
    price: 0,
    createdBy: OWNER,
    updatedBy: null,
    publishedAt: null,
    publishedBy: null,
    unpublishedAt: null,
    unpublishedBy: null,
    rejectionNote: null,
    rejectedAt: null,
    rejectedBy: null,
    createdAt: "2026-07-02T09:00:00.000Z",
    updatedAt: "2026-08-19T09:00:00.000Z",
    ...partial,
  };
}

function stats(
  totalLearners: number,
  completed: number,
  inProgress: number,
  notStarted: number,
): CourseLearnerStats {
  const learners = (percent: number) =>
    Math.round((totalLearners * percent) / 100);
  return {
    totalLearners,
    completed: { percent: completed, learners: learners(completed) },
    inProgress: { percent: inProgress, learners: learners(inProgress) },
    notStarted: { percent: notStarted, learners: learners(notStarted) },
  };
}

export const MY_COURSES_FIXTURES: CourseWithStats[] = [
  {
    ...course({
      id: "11111111-1111-4111-8111-111111111111",
      title: "Digital Marketing for Small Shops",
      description:
        "Where to start and how to grow a small shop online, step by step.",
      status: "PUBLISHED",
      coverImageUrl: "/images/education/cover-marketing.jpg",
      publishedAt: "2026-07-20T09:00:00.000Z",
      publishedBy: OWNER,
    }),
    stats: stats(1240, 64, 30, 6),
  },
  {
    ...course({
      id: "22222222-2222-4222-8222-222222222222",
      title: "Positioning Is Not Marketing",
      description:
        "Find the one thing your shop is known for before you spend on ads.",
      status: "DRAFT",
      coverImageUrl: "/images/education/cover-website.jpg",
    }),
    stats: null,
  },
  {
    ...course({
      id: "33333333-3333-4333-8333-333333333333",
      title: "Brand Basics for Local Producers",
      description:
        "Naming, packaging and a look that travels from market stall to shelf.",
      status: "PENDING",
      coverImageUrl: "/images/education/cover-photography.jpg",
    }),
    stats: null,
  },
  {
    ...course({
      id: "44444444-4444-4444-8444-444444444444",
      title: "Bookkeeping Basics for Small Shops",
      description: "Track what comes in and what goes out, without software.",
      // Rejected is DRAFT carrying rejectedAt — see displayStatusOf.
      status: "DRAFT",
      coverImageUrl: "/images/education/cover-bookkeeping.jpg",
      rejectedAt: "2026-08-11T09:00:00.000Z",
      rejectedBy: OWNER,
      rejectionNote: "Please add a lesson on separating personal spending.",
    }),
    stats: null,
  },
  {
    ...course({
      id: "55555555-5555-4555-8555-555555555555",
      title: "Selling on Facebook and Telegram",
      description: "Turn messages into orders and keep customers coming back.",
      status: "PUBLISHED",
      coverImageUrl: "/images/education/cover-fintech.png",
      publishedAt: "2026-08-01T09:00:00.000Z",
      publishedBy: OWNER,
    }),
    stats: stats(486, 41, 44, 15),
  },
  {
    ...course({
      id: "66666666-6666-4666-8666-666666666666",
      title: "Spreadsheets for Shop Owners",
      description: "Build one sheet that answers what sold and what is left.",
      status: "UNPUBLISHED",
      coverImageUrl: "/images/education/cover-excel.jpg",
      unpublishedAt: "2026-08-14T09:00:00.000Z",
      unpublishedBy: OWNER,
    }),
    stats: null,
  },
];

/**
 * Applies the tab and search the loader would otherwise have pushed to the
 * API, so the placeholder list behaves like the real one.
 */
export function filterFixtures(
  tab: CourseTab,
  search: string,
): CourseWithStats[] {
  const term = search.trim().toLowerCase();

  return MY_COURSES_FIXTURES.filter((entry) => {
    const status = displayStatusOf(entry);

    const tabMatches =
      tab === "all" ||
      (tab === "draft" && status === "DRAFT") ||
      (tab === "in-review" && status === "PENDING") ||
      (tab === "published" && status === "PUBLISHED") ||
      (tab === "rejected" && status === "REJECTED");

    if (!tabMatches) return false;
    return !term || entry.title.toLowerCase().includes(term);
  });
}
