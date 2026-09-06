import { EducationCatalog } from "../components/education-catalog";
import { educationCatalogLoader } from "../services/education-catalog.loader";
import type { Route } from "./+types/education.all";

export const loader = educationCatalogLoader;

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.heading ?? "All Courses"} | True Khmer` },
    {
      name: "description",
      content:
        "Browse every class on True Khmer — business, tech, design and trades, taught by experienced Cambodian professionals.",
    },
  ];
}

export default function EducationCatalogRoute() {
  return <EducationCatalog />;
}
