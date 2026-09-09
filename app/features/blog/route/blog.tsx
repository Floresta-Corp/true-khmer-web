import type { Route } from "./+types/blog";
import { PublicBlogListPage } from "../components/public-blog-list-page";
import { blogLoader, headers as blogHeaders } from "../services/blog.loader";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";

export const loader = blogLoader;
export const headers = blogHeaders;

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "Khmer voices",
    description:
      "Stories, interviews and ideas from the Khmer community — on business, careers, culture and building in Cambodia.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "Khmer voices", path: "/khmervoices" },
      ]),
    ],
  });
}

export default function BlogRoute() {
  return <PublicBlogListPage />;
}
