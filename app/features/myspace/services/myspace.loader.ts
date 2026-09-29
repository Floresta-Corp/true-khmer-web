import type { Route } from "project-types/myspace/route/+types/myspace";
import type { Profile, RecentActivity } from "~/features/myspace/types";
import type { ProfileCertificate } from "~/features/education/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  collectCertificates,
  toProfileCertificate,
} from "~/api/education/education.server";
import { listMyClasses } from "~/api/education/my-classes.server";
import {
  GetMyCertificates,
  GetMyspaceMe,
  GetRecentActivity,
} from "~/api/myspace/myspace.server";

const COMPLETED_CLASSES_LIMIT = 50;

interface MyspaceLoaderData {
  me: Profile | null;
  userId: string | null;
  recentActivities: RecentActivity[];
  certificates: ProfileCertificate[];
}

export async function myspaceLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;
  const [meResult, activitiesResult, certificatesResult, classesResult] =
    await Promise.allSettled([
      GetMyspaceMe(request),
      GetRecentActivity(request),
      collectCertificates((params) => GetMyCertificates(request, params)),
      listMyClasses(request, {
        tab: "completed",
        limit: COMPLETED_CLASSES_LIMIT,
      }),
    ]);

  if (certificatesResult.status === "rejected") {
    console.warn(
      "[myspace] certificates unavailable; rendering without them",
      certificatesResult.reason,
    );
  }
  const instructorByCourseId = new Map(
    classesResult.status === "fulfilled"
      ? (classesResult.value?.data?.courses ?? []).map((course) => [
          course.courseId,
          course.instructor?.name ?? null,
        ])
      : [],
  );

  return withAuthData(auth, {
    userId,
    me: meResult.status === "fulfilled" ? meResult.value.data.profile : null,
    recentActivities:
      activitiesResult.status === "fulfilled"
        ? activitiesResult.value.data.activities
        : [],
    certificates:
      certificatesResult.status === "fulfilled"
        ? certificatesResult.value.map((record) =>
            toProfileCertificate(
              record,
              instructorByCourseId.get(record.courseId) ?? null,
            ),
          )
        : [],
  } satisfies MyspaceLoaderData);
}
