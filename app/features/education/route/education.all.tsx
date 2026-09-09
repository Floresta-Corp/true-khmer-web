import { EducationCatalog } from "../components/education-catalog";
import { educationCatalogLoader } from "../services/education-catalog.loader";
import type { Route } from "./+types/education.all";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";

export const loader = educationCatalogLoader;

export function meta(args: Route.MetaArgs) {
  const heading = args.data?.heading ?? "All courses";

  return pageMeta(args, {
    title: heading,
    description:
      "Browse every class on True Khmer — business, tech, design and trades, taught by experienced Cambodian professionals.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "Education", path: "/education" },
        { name: heading, path: "/education/all" },
      ]),
    ],
  });
}

export default function EducationCatalogRoute() {
  return <EducationCatalog />;
}
