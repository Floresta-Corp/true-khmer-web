import { courseStudentsLoader } from "~/features/course-manage/services/course-students.loader";

/** Resource route: the Students tab's fetcher target. No UI of its own. */
export const loader = courseStudentsLoader;
