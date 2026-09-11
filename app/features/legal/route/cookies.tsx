import type { Route } from "./+types/cookies";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { LegalPage } from "../components/legal-page";
import { cookiePolicy } from "../lib/cookie-policy";
import { LEGAL_UPDATED } from "../lib/legal-info";

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "Cookie Policy",
    description:
      "Every cookie True Khmer sets, what it is for and how long it lasts — and the analytics and advertising cookies we do not use.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "Cookie Policy", path: "/cookies" },
      ]),
    ],
  });
}

export function headers(_: Route.HeadersArgs) {
  return {
    // Same reason as every other page under app-layout: the document carries
    // the SSR'd, per-user navbar, so it must never enter a shared cache.
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
  };
}

export default function Cookies() {
  return <LegalPage doc={cookiePolicy} updatedAt={LEGAL_UPDATED.cookies} />;
}
