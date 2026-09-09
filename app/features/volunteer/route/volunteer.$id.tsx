import { useEffect } from "react";
import { VolunteerDetailPage } from "../components/pages/volunteer-detail-page";
import { VolunteerDetailLoader } from "~/features/volunteer/services/volunteer-detail-loader";
import { VolunteerDetailAction } from "~/features/volunteer/services/volunteer-detail-action";
import type { Route } from "./+types/volunteer.$id";
import { useVolunteerSelectedRoles } from "~/stores/selected-volunteer-roles-store";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { resolveImageURL } from "~/lib/utils";

export const loader = VolunteerDetailLoader;
export const action = VolunteerDetailAction;

export function meta(args: Route.MetaArgs) {
  const volunteer = args.loaderData?.volunteer;
  const origin = metaOrigin(args);

  if (!volunteer) {
    return pageMeta(args, {
      title: "Volunteer opportunity",
      description: "This opportunity could not be found.",
      noindex: true,
    });
  }

  const path = `/volunteer/detail/${volunteer.id}`;

  return pageMeta(args, {
    title: volunteer.title,
    description:
      volunteer.overview ||
      `${volunteer.title} — a ${volunteer.category.name} volunteer role in ${volunteer.location.name}.`,
    image: resolveImageURL(volunteer.coverImageKey) || null,
    jsonLd: [
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name: "Volunteer", path: "/volunteer" },
        { name: volunteer.title, path },
      ]),
    ],
  });
}

export default function VolunteerOpportunityDetail() {
  const clearAll = useVolunteerSelectedRoles((s) => s.clearAll);

  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  return <VolunteerDetailPage />;
}
