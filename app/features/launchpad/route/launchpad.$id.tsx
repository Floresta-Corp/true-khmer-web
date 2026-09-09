import { useEffect } from "react";
import { launchpadDetailLoader } from "../services/launchpad-detail.loader";
import type { Route } from "./+types/launchpad.$id";
import LaunchpadDetailPage from "../components/pages/launchpad-detail-page";
import { useLaunchpadSelectedRoles } from "~/stores/selected-launchpad-roles-store";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { resolveImageURL } from "~/lib/utils";

export const loader = launchpadDetailLoader;

export function meta(args: Route.MetaArgs) {
  const project = args.loaderData?.project;
  const origin = metaOrigin(args);

  if (!project) {
    return pageMeta(args, {
      title: "Project",
      description: "This project could not be found.",
      noindex: true,
    });
  }

  const path = `/launchpad/detail/${project.id}`;

  return pageMeta(args, {
    title: project.name,
    description:
      project.description ||
      `${project.name} — a ${project.category.name} project in ${project.city.name} looking for people.`,
    image: resolveImageURL(project.coverKey ?? project.logoKey) || null,
    jsonLd: [
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name: "Launchpad", path: "/launchpad" },
        { name: project.name, path },
      ]),
    ],
  });
}

export default function LaunchpadDetail({ params }: Route.ComponentProps) {
  const clearAll = useLaunchpadSelectedRoles((s) => s.clearAll);

  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  return <LaunchpadDetailPage />;
}
