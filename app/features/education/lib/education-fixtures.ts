import type {
  ActiveLesson,
  CourseCategory,
  CourseDetail,
  CourseQuiz,
  CourseReview,
  CourseSection,
  CourseSummary,
  LearnerSnapshot,
  LessonType,
} from "~/features/education/types";

/**
 * Placeholder data for Education Center resources the API does not expose yet.
 *
 * Backed by the API today:
 *   - GET /v1/education-center/categories       → category row
 *   - GET /v1/education-center/courses/:id      → title, description, cover, price
 *
 * Missing, and therefore served from this module: the public catalog listing,
 * instructor/rating/level/enrolment figures, the learner's own progress, the
 * curriculum, quizzes and certificates.
 *
 * Each loader in `../services` composes the real response with the helpers
 * below. When an endpoint lands, replace the fixture call in that loader.
 */

const PLACEHOLDER_AVATAR = "/images/avatar_placeholder.webp";

/**
 * Instructor portraits taken from the design project's own assets, keyed by the
 * person they actually show. Real instructors resolve from their user profile.
 */
const INSTRUCTOR_AVATARS: Record<string, string> = {
  "Sreymom Ly": "/images/education/instructors/sreymom-ly.jpg",
  "Bopha Chea": "/images/education/instructors/bopha-chea.jpg",
  "Kosal Em": "/images/education/instructors/kosal-em.jpg",
  "Phalla Sok": "/images/education/instructors/phalla-sok.jpg",
  "Vichea Chhun": "/images/education/instructors/vichea-chhun.jpg",
};

function instructor(name: string, coursesPublished: number) {
  return {
    id: null,
    name,
    avatarUrl: INSTRUCTOR_AVATARS[name] ?? PLACEHOLDER_AVATAR,
    coursesPublished,
  };
}

/** The category row on the hub, in the design's order. */
export const FALLBACK_CATEGORIES: CourseCategory[] = [
  { id: "business", name: "Business", slug: "business", iconKey: "Briefcase" },
  {
    id: "academics",
    name: "Academics",
    slug: "academics",
    iconKey: "BookOpen",
  },
  { id: "tech", name: "Tech", slug: "tech", iconKey: "ChevronsLeftRight" },
  { id: "design", name: "Design", slug: "design", iconKey: "Palette" },
  { id: "health", name: "Health", slug: "health", iconKey: "Heart" },
  {
    id: "agriculture",
    name: "Agriculture",
    slug: "agriculture",
    iconKey: "Sprout",
  },
  { id: "languages", name: "Languages", slug: "languages", iconKey: "Globe" },
  {
    id: "finance",
    name: "Finance",
    slug: "finance",
    iconKey: "CircleDollarSign",
  },
  {
    id: "marketing",
    name: "Marketing",
    slug: "marketing",
    iconKey: "Megaphone",
  },
  { id: "trades", name: "Trades", slug: "trades", iconKey: "LineChart" },
];

/**
 * Demo covers pulled from the design project's own assets. Real courses supply
 * `coverImageUrl` from the API; these only stand in for the fixture rows.
 */
const COVERS = {
  website: "/images/education/cover-website.jpg",
  aiTools: "/images/education/cover-ai-tools.jpg",
  motorbike: "/images/education/cover-motorbike.jpg",
  laravel: "/images/education/cover-laravel-bakong.jpg",
  excel: "/images/education/cover-excel.jpg",
  photography: "/images/education/cover-photography.jpg",
  fintech: "/images/education/cover-fintech.png",
  houseplants: "/images/education/cover-houseplants.jpg",
  marketing: "/images/education/cover-marketing.jpg",
  bookkeeping: "/images/education/cover-bookkeeping.jpg",
} as const;

export const CATALOG_COURSES: CourseSummary[] = [
  {
    id: "c1",
    title: "Build Your First Website",
    description:
      "Go from a blank page to a live site — design, build and launch, one step at a time.",
    categoryId: "tech",
    categoryName: "Technology",
    coverImageUrl: COVERS.website,
    instructor: instructor("Vichea Chhun", 6),
    rating: 4.5,
    ratingCount: 1,
    level: "Intermediate",
    lessonCount: 18,
    studentCount: 3410,
    isNew: true,
    price: 0,
    isSaved: false,
  },
  {
    id: "c2",
    title: "ChatGPT & AI Tools - From Beginner to Expert",
    description:
      "Prompting, workflows and the judgement to know when the model is wrong.",
    categoryId: "academics",
    categoryName: "Academics",
    coverImageUrl: COVERS.aiTools,
    instructor: instructor("Kosal Em", 3),
    rating: 4.8,
    ratingCount: 1,
    level: "Advance",
    lessonCount: 16,
    studentCount: 2860,
    isNew: false,
    price: 0,
    isSaved: false,
  },
  {
    id: "c3",
    title: "Basic Motorbike Maintenance",
    description:
      "Chain, brakes, oil and tyres — the checks that keep a bike on the road.",
    categoryId: "trades",
    categoryName: "Skills",
    coverImageUrl: COVERS.motorbike,
    instructor: instructor("Phalla Sok", 7),
    rating: 4.8,
    ratingCount: 1,
    level: "Beginner",
    lessonCount: 8,
    studentCount: 2340,
    isNew: false,
    price: 0,
    isSaved: false,
  },
  {
    id: "c4",
    title: "Laravel 12: Bakong Payment Integration",
    description:
      "Wire KHQR payments into a Laravel storefront, from client keys to a confirmed order.",
    categoryId: "tech",
    categoryName: "Technology",
    coverImageUrl: COVERS.laravel,
    instructor: instructor("Sreymom Ly", 9),
    rating: 4.7,
    ratingCount: 1,
    level: "Advance",
    lessonCount: 22,
    studentCount: 2210,
    isNew: false,
    price: 0,
    isSaved: true,
  },
  {
    id: "c5",
    title: "Excel for Beginners",
    description:
      "Formulas, tables and charts — turn a messy export into a decision.",
    categoryId: "business",
    categoryName: "Business",
    coverImageUrl: COVERS.excel,
    instructor: instructor("Bopha Chea", 9),
    rating: 4.6,
    ratingCount: 12,
    level: "Beginner",
    lessonCount: 24,
    studentCount: 1980,
    isNew: true,
    price: 0,
    isSaved: false,
  },
  {
    id: "c6",
    title: "Product Photography with Your Phone",
    description:
      "Light, framing and manual settings that make a product shot look studio-made.",
    categoryId: "design",
    categoryName: "Design",
    coverImageUrl: COVERS.photography,
    instructor: instructor("Sreymom Ly", 9),
    rating: 4.7,
    ratingCount: 8,
    level: "Intermediate",
    lessonCount: 15,
    studentCount: 1640,
    isNew: false,
    price: 0,
    isSaved: false,
  },
  {
    id: "c7",
    title: "Digital Banking & Fintech Basics",
    description:
      "How payments, wallets and KHQR actually move money behind the screen.",
    categoryId: "finance",
    categoryName: "Finance",
    coverImageUrl: COVERS.fintech,
    instructor: instructor("Kosal Em", 3),
    rating: 4.4,
    ratingCount: 21,
    level: "Beginner",
    lessonCount: 12,
    studentCount: 1520,
    isNew: false,
    price: 0,
    isSaved: false,
  },
  {
    id: "c8",
    title: "Houseplant Care Basics",
    description:
      "Watering, light and the yellow-leaf problem every new plant owner hits.",
    categoryId: "agriculture",
    categoryName: "Agriculture",
    coverImageUrl: COVERS.houseplants,
    instructor: instructor("Phalla Sok", 7),
    rating: 4.5,
    ratingCount: 5,
    level: "Beginner",
    lessonCount: 9,
    studentCount: 1180,
    isNew: true,
    price: 0,
    isSaved: false,
  },
  {
    id: "c9",
    title: "Digital Marketing for Small Shops",
    description:
      "Reach nearby customers on a small budget — pages, posts and a plan you can keep up with.",
    categoryId: "business",
    categoryName: "Business",
    coverImageUrl: COVERS.marketing,
    instructor: instructor("Bopha Chea", 9),
    rating: 4.7,
    ratingCount: 1,
    level: "Beginner",
    lessonCount: 15,
    studentCount: 1240,
    isNew: true,
    price: 0,
    isSaved: false,
  },
  {
    id: "c10",
    title: "Rice Field Water Management",
    description:
      "Irrigate on a schedule that suits your plot, from planting through to harvest.",
    categoryId: "agriculture",
    categoryName: "Agriculture",
    // The design's aerial irrigation photo is not among the project's assets.
    coverImageUrl: null,
    instructor: instructor("Phalla Sok", 7),
    rating: 4.6,
    ratingCount: 1,
    level: "Intermediate",
    lessonCount: 10,
    studentCount: 860,
    isNew: false,
    price: 0,
    isSaved: false,
  },
  {
    id: "c11",
    title: "Intro to Spreadsheets for Everyday",
    description:
      "Track takings, stock and costs with formulas you will actually reuse.",
    categoryId: "business",
    categoryName: "Business",
    coverImageUrl: COVERS.bookkeeping,
    instructor: instructor("Kosal Em", 3),
    rating: 4.8,
    ratingCount: 1,
    level: "Beginner",
    lessonCount: 12,
    studentCount: 2105,
    isNew: false,
    price: 0,
    isSaved: false,
  },
];

/** The four cards under "Trending Classes". */
export const TRENDING_COURSES = CATALOG_COURSES.slice(0, 4);

/** The four cards under "Recently Added". */
export const RECENT_COURSES = CATALOG_COURSES.slice(4, 8);

/**
 * The four cards under "All Courses". A teaser row like the two above it —
 * "View all" leads to the full catalogue — so it is its own selection rather
 * than a superset of them.
 */
export const ALL_COURSES = [
  ...CATALOG_COURSES.slice(8, 11),
  CATALOG_COURSES[0],
];

/** Search topic chips shown under the hero greeting. */
export const HERO_TOPICS = [
  "Time management tips",
  "Tips for finding a mentor",
  "Career Development",
];

export function buildLearnerSnapshot(displayName: string): LearnerSnapshot {
  return {
    displayName,
    dayStreak: 7,
    goalTitle: "Web Developer",
    goalPercent: 80,
    continueCourseTitle: "Intro to AI Lessons",
    continuePercent: 75,
    platformRating: 4.8,
    platformReviewCount: 120,
  };
}

const REVIEWS: CourseReview[] = [
  {
    id: "r1",
    name: "Phalla Sok",
    avatarUrl: PLACEHOLDER_AVATAR,
    rating: 5,
    comment:
      "Clear and to the point. I applied the checklist the same week and it held up.",
  },
  {
    id: "r2",
    name: "Vichea Chhun",
    avatarUrl: PLACEHOLDER_AVATAR,
    rating: 4,
    comment:
      "Good pacing. I would have liked one more worked example near the end.",
  },
  {
    id: "r3",
    name: "Bopha Chea",
    avatarUrl: PLACEHOLDER_AVATAR,
    rating: 5,
    comment:
      "The examples are local, which made the whole thing much easier to follow.",
  },
  {
    id: "r4",
    name: "Kosal Em",
    avatarUrl: PLACEHOLDER_AVATAR,
    rating: 5,
    comment: "Worth the time. The final quiz is a fair check on the material.",
  },
  {
    id: "r5",
    name: "Sreymom Ly",
    avatarUrl: PLACEHOLDER_AVATAR,
    rating: 4,
    comment: "Solid introduction — I came in with no background and kept up.",
  },
];

const SECTION_TITLES = [
  "Getting started",
  "Core concepts",
  "Putting it into practice",
];

const LESSON_TEMPLATES: Array<{
  title: string;
  type: LessonType;
  duration: string;
}> = [
  { title: "Welcome and course overview", type: "video", duration: "04:12" },
  { title: "How this course is structured", type: "video", duration: "06:38" },
  { title: "Course workbook", type: "pdf", duration: "10 pages" },
  { title: "The vocabulary you'll need", type: "video", duration: "12:05" },
  { title: "Walking through a real example", type: "video", duration: "15:47" },
  {
    title: "Interview: lessons from the field",
    type: "audio",
    duration: "22:19",
  },
  { title: "Building your first plan", type: "video", duration: "18:30" },
  { title: "Common mistakes to avoid", type: "video", duration: "09:54" },
  { title: "Templates and further reading", type: "pdf", duration: "6 pages" },
  { title: "Measuring what you built", type: "video", duration: "11:22" },
  { title: "Q&A with the instructor", type: "audio", duration: "16:40" },
  { title: "Where to go next", type: "video", duration: "07:15" },
];

/** The first two lessons are pre-completed so progress states are visible. */
const PRE_COMPLETED_LESSONS = 2;

/**
 * Spreads `lessonCount` lessons across three sections so the curriculum length
 * agrees with the lesson count shown on the course card.
 */
function buildCurriculum(
  courseId: string,
  lessonCount: number,
): CourseSection[] {
  const total = Math.max(1, lessonCount);
  const perSection = Math.ceil(total / SECTION_TITLES.length);

  let created = 0;
  const sections: CourseSection[] = [];

  for (const [index, title] of SECTION_TITLES.entries()) {
    const remaining = total - created;
    if (remaining <= 0) break;

    const size = Math.min(perSection, remaining);
    const lessons = Array.from({ length: size }, (_, offset) => {
      const position = created + offset;
      const template = LESSON_TEMPLATES[position % LESSON_TEMPLATES.length];
      return {
        id: `${courseId}-l${position + 1}`,
        title: template.title,
        type: template.type,
        duration: template.duration,
        isPreview: position < 2,
        isComplete: position < PRE_COMPLETED_LESSONS,
      };
    });

    created += size;
    sections.push({ id: `${courseId}-s${index + 1}`, title, lessons });
  }

  return sections;
}

const LESSON_OUTCOMES = [
  "Name the parts of the process and what each one is for",
  "Recognise the trade-offs behind the choices in the example",
  "Apply the same steps to a problem of your own",
  "Know which mistakes cost the most time to undo",
];

const LESSON_DESCRIPTION =
  "This chapter walks through the material end to end, pausing on the decisions that matter most. Follow along with the workbook — the exercises at the end feed directly into the final quiz.";

/** Courses coming from the API carry no lesson count, so assume a short one. */
const DEFAULT_LESSON_COUNT = 9;

/**
 * Everything the detail screen needs beyond what `GET /courses/:id` returns.
 * `base` carries the fields that did come from the API.
 */
export function enrichCourseDetail(base: CourseSummary): CourseDetail {
  const lessonCount =
    base.lessonCount > 0 ? base.lessonCount : DEFAULT_LESSON_COUNT;
  const curriculum = buildCurriculum(base.id, lessonCount);
  const lessons = curriculum.flatMap((section) => section.lessons);
  const completed = lessons.filter((lesson) => lesson.isComplete).length;

  return {
    ...base,
    lessonCount: lessons.length,
    meta: [
      { label: "DURATION", value: "4h 20m" },
      { label: "LESSONS", value: `${lessons.length} lessons` },
      { label: "LEVEL", value: base.level },
      { label: "RATING", value: base.rating.toFixed(1), isRating: true },
    ],
    outcomes: [
      "Work through the subject from the ground up, with no prior background assumed",
      "Practise on examples drawn from organisations working in Cambodia",
      "Finish with templates you can reuse on your own projects",
      "Earn a certificate once you pass the final quiz",
    ],
    curriculum,
    reviews: REVIEWS,
    reviewCount: 128,
    enrolledCount: base.studentCount,
    isEnrolled: true,
    progressPercent:
      lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100),
    status: "PUBLISHED",
  };
}

/** Expands a curriculum lesson into the copy the learning screen renders. */
export function buildActiveLesson(
  course: CourseDetail,
  lessonId: string | null,
): ActiveLesson | null {
  const flattened = course.curriculum.flatMap((section) =>
    section.lessons.map((lesson) => ({ section, lesson })),
  );
  if (flattened.length === 0) return null;

  const position = Math.max(
    0,
    flattened.findIndex((entry) => entry.lesson.id === lessonId),
  );
  const { section, lesson } = flattened[position];

  return {
    ...lesson,
    sectionId: section.id,
    sectionTitle: section.title,
    index: position + 1,
    heading: lesson.title,
    description: LESSON_DESCRIPTION,
    outcomes: LESSON_OUTCOMES,
    posterUrl: course.coverImageUrl,
    elapsed: "00:00",
  };
}

export function buildCourseQuiz(courseId: string): CourseQuiz {
  return {
    id: `${courseId}-quiz`,
    courseId,
    passMark: 70,
    questions: [
      {
        id: "q1",
        question: "What should you settle before choosing any channel or tool?",
        options: [
          { id: "q1a", label: "The budget you have available" },
          { id: "q1b", label: "The outcome you are trying to produce" },
          { id: "q1c", label: "The team members who will do the work" },
          { id: "q1d", label: "The deadline you have been given" },
        ],
        correctOptionId: "q1b",
      },
      {
        id: "q2",
        question:
          "Which measure tells you the most about whether the work is landing?",
        options: [
          { id: "q2a", label: "How many people saw it" },
          { id: "q2b", label: "How often it was shared" },
          { id: "q2c", label: "How many people took the action you wanted" },
          { id: "q2d", label: "How long it took to produce" },
        ],
        correctOptionId: "q2c",
      },
      {
        id: "q3",
        question: "When is the right moment to review your assumptions?",
        options: [
          { id: "q3a", label: "Only once the project has finished" },
          { id: "q3b", label: "At fixed points while the work is running" },
          { id: "q3c", label: "Whenever someone raises an objection" },
          { id: "q3d", label: "Never — changing course wastes effort" },
        ],
        correctOptionId: "q3b",
      },
      {
        id: "q4",
        question: "What makes an example worth learning from?",
        options: [
          { id: "q4a", label: "It comes from a well-known organisation" },
          { id: "q4b", label: "It produced a large result" },
          { id: "q4c", label: "Its constraints resemble the ones you face" },
          { id: "q4d", label: "It is recent" },
        ],
        correctOptionId: "q4c",
      },
      {
        id: "q5",
        question: "Which mistake tends to cost the most time to undo?",
        options: [
          { id: "q5a", label: "Building on a goal nobody agreed to" },
          { id: "q5b", label: "Choosing the wrong colour palette" },
          { id: "q5c", label: "Publishing slightly later than planned" },
          { id: "q5d", label: "Using a tool you are unfamiliar with" },
        ],
        correctOptionId: "q5a",
      },
    ],
  };
}
