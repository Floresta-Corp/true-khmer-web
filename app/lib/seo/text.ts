import { META_DESCRIPTION_MAX } from "./site";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
};

/**
 * Flatten rich text into the plain sentence a meta description needs.
 *
 * Blog posts, courses and events all store their body as editor HTML. Feeding
 * that straight into `<meta name="description">` puts markup in the SERP
 * snippet, so tags are dropped, entities decoded and whitespace collapsed.
 * Block boundaries become spaces rather than vanishing, otherwise the last word
 * of one paragraph fuses with the first of the next.
 */
export function stripHtml(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|tr|section)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      return NAMED_ENTITIES[name.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cut text to `max` characters on a word boundary.
 *
 * Search engines truncate mid-word with no ellipsis, which reads as a broken
 * page. Trimming here keeps the snippet a complete thought.
 */
export function truncate(
  value: string | null | undefined,
  max = META_DESCRIPTION_MAX,
): string {
  const text = (value ?? "").trim();
  if (text.length <= max) return text;

  const hardCut = text.slice(0, max - 1);
  const lastSpace = hardCut.lastIndexOf(" ");
  // A single word longer than the limit has no boundary to fall back to.
  const body = lastSpace > max * 0.6 ? hardCut.slice(0, lastSpace) : hardCut;

  return `${body.replace(/[\s,;:.!?-]+$/, "")}…`;
}

/** Rich text straight to a finished meta description. */
export function toDescription(
  value: string | null | undefined,
  max = META_DESCRIPTION_MAX,
): string {
  return truncate(stripHtml(value), max);
}

/** Looks like `DSC08947-scaled` or `IMG_2031.jpg` rather than a description. */
const FILENAME_LIKE = /^[\w-]+$/;

/**
 * Pick usable alt text for a social card image.
 *
 * Uploaders routinely leave the alt as whatever the camera called the file, and
 * `og:image:alt` is read aloud by screen readers and shown when an image fails
 * to load -- "DSC08947-scaled" is worse there than the page's own title. A
 * single word with no spaces is taken to be a filename; anything a person
 * actually wrote is left alone.
 */
export function imageAlt(
  provided: string | null | undefined,
  fallback: string,
): string {
  const alt = provided?.trim();
  if (!alt) return fallback;

  const stem = alt.replace(/\.[a-z0-9]{2,5}$/i, "");
  return FILENAME_LIKE.test(stem) ? fallback : alt;
}
