export function formatDurationLong(seconds: number) {
  const totalMinutes = Math.round(Math.max(0, seconds) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatRemaining(course: {
  remainingSeconds: number | null;
  remainingSecondsEstimated: boolean;
  lessonCount: number;
  lessonsCompleted: number;
}) {
  const remainingLessons = Math.max(
    0,
    course.lessonCount - course.lessonsCompleted,
  );

  if (course.remainingSeconds === null) {
    if (remainingLessons === 0) return null;
    return `${remainingLessons} lesson${remainingLessons === 1 ? "" : "s"} left`;
  }

  if (course.remainingSeconds === 0) return null;

  const minutes = Math.round(course.remainingSeconds / 60);
  const prefix = course.remainingSecondsEstimated ? "~" : "";

  if (minutes < 100) return `${prefix}${minutes} min left`;
  return `${prefix}${formatDurationLong(course.remainingSeconds)} left`;
}
