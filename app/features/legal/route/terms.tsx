import type { Route } from "./+types/terms";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { LegalPage } from "../components/legal-page";
import { LEGAL_UPDATED } from "../lib/legal-info";
import { termsOfService } from "../lib/terms-of-service";

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "Terms of Service",
    description:
      "The agreement between you and True Khmer: who can join, the community rules, how content and applications work, and how disputes are handled.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "Terms of Service", path: "/terms" },
      ]),
    ],
  });
}

export function headers(_: Route.HeadersArgs) {
  return {
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
  };
}

export default function Terms() {
  return <LegalPage doc={termsOfService} updatedAt={LEGAL_UPDATED.terms} />;
}
