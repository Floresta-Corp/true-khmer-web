import type { Route } from "./+types/privacy";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { LegalPage } from "../components/legal-page";
import { LEGAL_UPDATED } from "../lib/legal-info";
import { privacyPolicy } from "../lib/privacy-policy";

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "Privacy Policy",
    description:
      "How True Khmer collects, uses, shares and protects your personal information — and the choices and rights you have over it.",
    jsonLd: [
      breadcrumbJsonLd(metaOrigin(args), [
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy" },
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

export default function Privacy() {
  return <LegalPage doc={privacyPolicy} updatedAt={LEGAL_UPDATED.privacy} />;
}
