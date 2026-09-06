import type { Route } from "project-types/myspace/route/+types/myspace";
import type { Profile, RecentActivity } from "~/features/myspace/types";
import type { ProfileCertificate } from "~/features/education/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  GetMyCertificates,
  GetMyspaceMe,
  GetRecentActivity,
} from "~/api/myspace/myspace.server";

interface MyspaceLoaderData {
  me: Profile | null;
  userId: string | null;
  recentActivities: RecentActivity[];
  certificates: ProfileCertificate[];
}

export async function myspaceLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;
  const [meResult, activitiesResult, certificatesResult] =
    await Promise.allSettled([
      GetMyspaceMe(request),
      GetRecentActivity(request),
      GetMyCertificates(request, { limit: 20 }),
    ]);

  return withAuthData(auth, {
    userId,
    me: meResult.status === "fulfilled" ? meResult.value.data.profile : null,
    recentActivities:
      activitiesResult.status === "fulfilled"
        ? activitiesResult.value.data.activities
        : [],
    /* Every certificate they hold, shared or not — this is their own space,
       and an unshared one is exactly what they need to see to act on it. The
       public profile gets the shared subset, filtered by the API. */
    certificates:
      certificatesResult.status === "fulfilled"
        ? certificatesResult.value.data.certificates.map(toProfileCertificate)
        : [],
  } satisfies MyspaceLoaderData);
}

function toProfileCertificate(certificate: {
  id: string;
  courseId: string;
  courseTitle: string;
  certificateNo: string;
  completedAt: string;
  sharedToProfile: boolean;
}): ProfileCertificate {
  return {
    id: certificate.id,
    courseId: certificate.courseId,
    courseTitle: certificate.courseTitle,
    certificateNo: certificate.certificateNo,
    completedAt: certificate.completedAt,
    sharedToProfile: certificate.sharedToProfile,
  };
}
