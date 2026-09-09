import { siteUrl } from "~/lib/seo";
import { isIndexableOrigin, resolveSiteOrigin } from "~/lib/seo/origin.server";
import { CRAWLABLE_SECTIONS, PRIVATE_RULES } from "~/lib/seo/robots-policy";
import { textResponse } from "../lib/xml";

/**
 * `GET /robots.txt`.
 *
 * Generated rather than dropped in `public/` for two reasons: the `Sitemap:`
 * line has to name the origin actually being served, and a staging deployment
 * has to be able to say `Disallow: /` without a second copy of the file
 * drifting out of sync with the real one.
 */
export function robotsLoader({ request }: { request: Request }) {
  const origin = resolveSiteOrigin(request);

  if (!isIndexableOrigin(origin)) {
    // Belt and braces with the `X-Robots-Tag` the server entry sets: this stops
    // the crawl, and the header removes anything already indexed.
    return textResponse(
      [
        "# Non-production deployment - nothing here should be indexed.",
        "User-agent: *",
        "Disallow: /",
        "",
      ].join("\n"),
      // Short, so pointing a real production hostname at this build is not
      // stuck behind a day-long cache of the wrong answer.
      300,
    );
  }

  const body = [
    "User-agent: *",
    ...CRAWLABLE_SECTIONS.map((section) => `Allow: ${section}`),
    "",
    "# Signed-in areas, auth flows, authoring screens and resource routes.",
    ...PRIVATE_RULES.map((rule) => `Disallow: ${rule.path}`),
    "",
    "# Campaign parameters only ever produce a duplicate of a canonical page.",
    "Disallow: /*?*utm_",
    "Disallow: /*?*fbclid=",
    "Disallow: /*?*gclid=",
    "",
    `Sitemap: ${siteUrl(origin, "/sitemap.xml")}`,
    "",
  ].join("\n");

  return textResponse(body, 3600);
}
