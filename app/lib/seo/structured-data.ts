import { toIsoDate } from "./date";
import { siteUrl } from "./meta";
import { SITE } from "./site";
import { toDescription } from "./text";

/**
 * JSON-LD builders for the entities this platform actually publishes.
 *
 * Structured data is what turns a plain blue link into a result with a
 * thumbnail, a star rating, an event date or a Q&A accordion. Each builder
 * below maps one of our loaders' shapes onto the schema.org type Google
 * documents a rich result for — nothing speculative, because invalid or
 * unsupported markup is at best ignored and at worst a manual action.
 *
 * Entities are given stable `@id`s so they can reference each other across
 * pages: every article points at the same Organization node rather than
 * restating the publisher inline.
 */

type Json = Record<string, unknown>;

/** Drop the keys whose value never arrived, so no `null` reaches the markup. */
function compact(value: Json): Json {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => {
      if (v === null || v === undefined || v === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }),
  );
}

export function organizationId(origin: string) {
  return `${siteUrl(origin)}#organization`;
}

export function websiteId(origin: string) {
  return `${siteUrl(origin)}#website`;
}

/** The publisher every other entity on the site refers back to. */
export function organizationJsonLd(origin: string): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(origin),
    name: SITE.name,
    url: siteUrl(origin),
    logo: compact({
      "@type": "ImageObject",
      url: siteUrl(origin, SITE.logoPath),
      caption: SITE.name,
    }),
    description: SITE.description,
    slogan: SITE.tagline,
    sameAs: [...SITE.socialProfiles],
    areaServed: compact({ "@type": "Country", name: "Cambodia" }),
  });
}

/**
 * The site itself, with the search box Google may surface under the brand
 * result. `query-input` has to name a real, crawlable search URL — this one is
 * the forum search, which is the platform's only full-text entry point.
 */
export function webSiteJsonLd(origin: string): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(origin),
    name: SITE.name,
    alternateName: `${SITE.name} — ${SITE.tagline}`,
    url: siteUrl(origin),
    description: SITE.description,
    inLanguage: ["en", "km"],
    publisher: { "@id": organizationId(origin) },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl(origin, "/forum/search")}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export type Crumb = { name: string; path: string };

/**
 * The trail shown in place of the raw URL in search results.
 *
 * Worth emitting on every detail page: our URLs carry a `/detail/` segment and
 * an opaque id, which reads as noise in a SERP where competitors show
 * `Volunteer › Phnom Penh › Role`.
 */
export function breadcrumbJsonLd(origin: string, crumbs: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: siteUrl(origin, crumb.path),
    })),
  };
}

export type ArticleJsonLdInput = {
  origin: string;
  pathname: string;
  headline: string;
  description?: string | null;
  image?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  section?: string | null;
  keywords?: readonly string[];
  commentCount?: number | null;
  /** Rich-text body, used only for `wordCount`. */
  body?: string | null;
};

export function blogPostingJsonLd(input: ArticleJsonLdInput): Json {
  const url = siteUrl(input.origin, input.pathname);
  const wordCount = input.body
    ? input.body
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : null;

  return compact({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: input.headline.slice(0, 110),
    description: toDescription(input.description, 300),
    image: input.image ? [input.image] : undefined,
    datePublished: toIsoDate(input.publishedAt),
    dateModified: toIsoDate(input.updatedAt ?? input.publishedAt),
    author: input.authorName
      ? compact({ "@type": "Person", name: input.authorName })
      : { "@id": organizationId(input.origin) },
    publisher: { "@id": organizationId(input.origin) },
    articleSection: input.section,
    keywords: input.keywords?.length
      ? [...input.keywords].join(", ")
      : undefined,
    commentCount: input.commentCount ?? undefined,
    wordCount: wordCount || undefined,
    isAccessibleForFree: true,
    inLanguage: "en",
  });
}

export type EventJsonLdInput = {
  origin: string;
  pathname: string;
  name: string;
  description?: string | null;
  image?: string | null;
  startAt: string;
  endAt?: string | null;
  isOnline?: boolean;
  venueName?: string | null;
  venueAddress?: string | null;
  /** Cheapest sellable price, `0` for free entry. Leave undefined when the
      price is genuinely unknown -- `offers` is then omitted rather than
      advertising a price we do not have. */
  price?: number;
  currency?: string | null;
  isSoldOut?: boolean;
  organizerName?: string | null;
};

export function eventJsonLd(input: EventJsonLdInput): Json {
  const url = siteUrl(input.origin, input.pathname);

  const location = input.isOnline
    ? compact({ "@type": "VirtualLocation", url })
    : compact({
        "@type": "Place",
        name: input.venueName ?? "Venue to be announced",
        address: input.venueAddress
          ? compact({
              "@type": "PostalAddress",
              streetAddress: input.venueAddress,
              addressCountry: "KH",
            })
          : compact({ "@type": "PostalAddress", addressCountry: "KH" }),
      });

  return compact({
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    name: input.name,
    url,
    description: toDescription(input.description, 300),
    image: input.image ? [input.image] : undefined,
    startDate: toIsoDate(input.startAt),
    endDate: toIsoDate(input.endAt),
    eventAttendanceMode: input.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location,
    organizer: input.organizerName
      ? compact({ "@type": "Organization", name: input.organizerName })
      : { "@id": organizationId(input.origin) },
    offers:
      input.price === undefined
        ? undefined
        : compact({
            "@type": "Offer",
            url,
            price: input.price,
            priceCurrency: input.currency ?? "USD",
            availability: input.isSoldOut
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
          }),
  });
}

export type CourseJsonLdInput = {
  origin: string;
  pathname: string;
  name: string;
  description?: string | null;
  image?: string | null;
  instructorName?: string | null;
  categoryName?: string | null;
  level?: string | null;
  price?: number | null;
  rating?: number | null;
  ratingCount?: number | null;
};

export function courseJsonLd(input: CourseJsonLdInput): Json {
  const url = siteUrl(input.origin, input.pathname);

  return compact({
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    name: input.name,
    url,
    description: toDescription(input.description, 300),
    image: input.image ?? undefined,
    provider: { "@id": organizationId(input.origin) },
    inLanguage: "en",
    educationalLevel: input.level ?? undefined,
    about: input.categoryName ?? undefined,
    // A rating node with a zero count is invalid markup, so it only ships once
    // a course has actually been reviewed.
    aggregateRating:
      input.rating && input.ratingCount
        ? compact({
            "@type": "AggregateRating",
            ratingValue: input.rating,
            ratingCount: input.ratingCount,
            bestRating: 5,
            worstRating: 1,
          })
        : undefined,
    offers: compact({
      "@type": "Offer",
      url,
      price: input.price ?? 0,
      priceCurrency: "USD",
      category: (input.price ?? 0) > 0 ? "Paid" : "Free",
      availability: "https://schema.org/InStock",
    }),
    hasCourseInstance: compact({
      "@type": "CourseInstance",
      courseMode: "online",
      // No `courseWorkload`: schema.org specifies it as an ISO 8601 duration,
      // and a lesson count is not one. We do not aggregate lesson durations, so
      // the property is left off rather than filled with something a validator
      // rejects.
      instructor: input.instructorName
        ? compact({ "@type": "Person", name: input.instructorName })
        : undefined,
    }),
  });
}

export type QaAnswer = {
  body: string;
  authorName?: string | null;
  upvoteCount?: number | null;
  createdAt?: string | null;
  id?: string | null;
};

export type QaPageJsonLdInput = {
  origin: string;
  pathname: string;
  title: string;
  body: string;
  authorName?: string | null;
  createdAt?: string | null;
  upvoteCount?: number | null;
  answerCount?: number | null;
  acceptedAnswer?: QaAnswer | null;
  suggestedAnswers?: readonly QaAnswer[];
};

function answerNode(origin: string, url: string, answer: QaAnswer): Json {
  return compact({
    "@type": "Answer",
    text: toDescription(answer.body, 1000),
    url: answer.id ? `${url}#answer-${answer.id}` : url,
    upvoteCount: answer.upvoteCount ?? 0,
    dateCreated: toIsoDate(answer.createdAt),
    author: answer.authorName
      ? compact({ "@type": "Person", name: answer.authorName })
      : { "@id": organizationId(origin) },
  });
}

/**
 * A forum thread as a QAPage, which is the one rich result that shows a
 * question's answers directly in the SERP. Only emitted for a thread that has
 * at least one answer — a bare question does not qualify.
 */
export function qaPageJsonLd(input: QaPageJsonLdInput): Json {
  const url = siteUrl(input.origin, input.pathname);
  const suggested = input.suggestedAnswers ?? [];

  return compact({
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${url}#qapage`,
    mainEntity: compact({
      "@type": "Question",
      name: input.title,
      text: toDescription(input.body, 1000) || input.title,
      answerCount: input.answerCount ?? suggested.length,
      upvoteCount: input.upvoteCount ?? 0,
      dateCreated: toIsoDate(input.createdAt),
      url,
      author: input.authorName
        ? compact({ "@type": "Person", name: input.authorName })
        : { "@id": organizationId(input.origin) },
      acceptedAnswer: input.acceptedAnswer
        ? answerNode(input.origin, url, input.acceptedAnswer)
        : undefined,
      suggestedAnswer: suggested.map((answer) =>
        answerNode(input.origin, url, answer),
      ),
    }),
  });
}

export type PersonJsonLdInput = {
  origin: string;
  pathname: string;
  name: string;
  description?: string | null;
  image?: string | null;
  jobTitle?: string | null;
};

export function personJsonLd(input: PersonJsonLdInput): Json {
  const url = siteUrl(input.origin, input.pathname);

  return compact({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    mainEntity: compact({
      "@type": "Person",
      name: input.name,
      url,
      image: input.image ?? undefined,
      description: toDescription(input.description, 300),
      jobTitle: input.jobTitle ?? undefined,
      memberOf: { "@id": organizationId(input.origin) },
    }),
  });
}

export type OrganizationProfileJsonLdInput = {
  origin: string;
  pathname: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  sameAs?: readonly (string | null | undefined)[];
  sector?: string | null;
};

/** A community partner's own page, as its own Organization entity. */
export function partnerJsonLd(input: OrganizationProfileJsonLdInput): Json {
  const url = siteUrl(input.origin, input.pathname);

  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#partner`,
    name: input.name,
    url: input.website || url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    logo: input.logo ?? undefined,
    image: input.logo ?? undefined,
    description: toDescription(input.description, 300),
    knowsAbout: input.sector ?? undefined,
    sameAs: (input.sameAs ?? []).filter(
      (href): href is string => typeof href === "string" && href.length > 0,
    ),
  });
}

export type ItemListJsonLdInput = {
  origin: string;
  name: string;
  items: readonly { name: string; path: string }[];
};

/** A listing page's contents, so a hub page ranks as a collection rather than
    a wall of unattributed links. */
export function itemListJsonLd(input: ItemListJsonLdInput): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: siteUrl(input.origin, item.path),
    })),
  };
}
