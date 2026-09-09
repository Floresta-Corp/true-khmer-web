import type { Route } from "project-types/myspace/route/+types/edit-profile";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  GetMyspaceMe,
  GetCountries,
  GetCities,
  GetMyCertificates,
} from "~/api/myspace/myspace.server";
import {
  collectCertificates,
  toProfileCertificate,
} from "~/api/education/education.server";
import { listMyClasses } from "~/api/education/my-classes.server";
import type {
  City,
  Profile,
  Country,
  EditProfileCertificate,
  EditProfileCertificateOption,
} from "~/features/myspace/types";

const COMPLETED_CLASSES_LIMIT = 50;

interface EditProfileLoaderData {
  me: Profile | null;
  userId: string | null;
  countries: Country[];
  cities: City[];
  certificates: EditProfileCertificate[];
  certificateOptions: EditProfileCertificateOption[];
}

export async function editProfileLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams.toString());
  const auth = await requireUser(request);
  const userId = auth.user.id;
  const meResult = await GetMyspaceMe(request);

  const countryId =
    searchParams.get("countryId") ||
    meResult.data.profile?.profile?.country?.id ||
    "";

  const countriesResult = await GetCountries(request);
  const citiesResult = countryId
    ? await GetCities(request, countryId)
    : { data: { cities: [] } };

  /* Both lists are decoration next to the form, so each degrades to empty on
     its own rather than taking the form down with it. */
  const [certificatesResult, classesResult] = await Promise.allSettled([
    collectCertificates((params) => GetMyCertificates(request, params)),
    listMyClasses(request, {
      tab: "completed",
      limit: COMPLETED_CLASSES_LIMIT,
    }),
  ]);

  if (certificatesResult.status === "rejected") {
    console.warn(
      "[edit-profile] certificates unavailable; rendering without them",
      certificatesResult.reason,
    );
  }

  if (classesResult.status === "rejected") {
    console.warn(
      "[edit-profile] completed classes unavailable; rendering without them",
      classesResult.reason,
    );
  }

  const completedCourses =
    classesResult.status === "fulfilled"
      ? (classesResult.value?.data?.courses ?? [])
      : [];

  const categoryByCourseId = new Map(
    completedCourses.map((course) => [course.courseId, course.categoryName]),
  );

  const certificates: EditProfileCertificate[] =
    certificatesResult.status === "fulfilled"
      ? certificatesResult.value.map((record) => ({
          ...toProfileCertificate(record),
          categoryName: categoryByCourseId.get(record.courseId) ?? null,
        }))
      : [];

  /* Anything the member has earned but is not showing yet. Completed classes
     are the source rather than issued certificates, so a course whose
     certificate page was never opened still shows up here. */
  const sharedCourseIds = new Set(
    certificates
      .filter((certificate) => certificate.sharedToProfile)
      .map((certificate) => certificate.courseId),
  );

  const certificateOptions: EditProfileCertificateOption[] = completedCourses
    .filter(
      (course) =>
        course.certificateEarned && !sharedCourseIds.has(course.courseId),
    )
    .map((course) => ({
      courseId: course.courseId,
      courseTitle: course.title,
      categoryName: course.categoryName,
    }));

  return withAuthData(auth, {
    userId,
    me: meResult.data.profile,
    countries: countriesResult.data.countries || [],
    cities: citiesResult.data.cities || [],
    certificates,
    certificateOptions,
  } satisfies EditProfileLoaderData);
}
