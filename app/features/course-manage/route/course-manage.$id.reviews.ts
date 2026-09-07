import { courseReviewsLoader } from "~/features/course-manage/services/course-reviews.loader";

/** Resource route: the Review tab's fetcher target. No UI of its own. */
export const loader = courseReviewsLoader;
