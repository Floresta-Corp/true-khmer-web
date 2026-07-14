import sanitize from "sanitize-html";
import { cn } from "~/lib/utils";

const BASE_ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "ul",
  "ol",
  "li",
  "b",
  "i",
  "strong",
  "em",
  "u",
  "s",
  "strike",
  "a",
  "blockquote",
  "pre",
  "code",
  "span",
  "div",
  "sub",
  "sup",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "img",
];

const BASE_ALLOWED_ATTRIBUTES: sanitize.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height"],
  "*": ["class", "style"],
};

const ALLOWED_INLINE_STYLES: sanitize.IOptions["allowedStyles"] = {
  "*": {
    "text-align": [/^(?:left|center|right|justify)$/],
  },
  figure: {
    width: [/^(?:100|[1-9]?\d(?:\.\d+)?)%$/],
  },
  img: {
    width: [/^(?:auto|\d+(?:\.\d+)?(?:px|%|rem))$/],
    height: [/^(?:auto|\d+(?:\.\d+)?(?:px|%|rem))$/],
  },
};

interface SanitizedHtmlProps {
  /** Raw HTML string to sanitize and render */
  html: string;
  /** Additional CSS class names */
  className?: string;
  /** HTML element to render as (default: "div") */
  as?: keyof React.JSX.IntrinsicElements;
  /** Extra tags to allow on top of the base allow-list (e.g. figure/figcaption) */
  extraAllowedTags?: string[];
  /** Extra per-tag attributes to allow on top of the base allow-list */
  extraAllowedAttributes?: Record<string, string[]>;
}

export function SanitizedHtml({
  html,
  className,
  as: Tag = "div",
  extraAllowedTags,
  extraAllowedAttributes,
}: SanitizedHtmlProps) {
  const allowedTags = extraAllowedTags
    ? [...BASE_ALLOWED_TAGS, ...extraAllowedTags]
    : BASE_ALLOWED_TAGS;

  const allowedAttributes = extraAllowedAttributes
    ? mergeAllowedAttributes(BASE_ALLOWED_ATTRIBUTES, extraAllowedAttributes)
    : BASE_ALLOWED_ATTRIBUTES;

  const clean = sanitize(html, {
    allowedTags,
    allowedAttributes,
    allowedStyles: ALLOWED_INLINE_STYLES,
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitize.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });

  return (
    <Tag
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

function mergeAllowedAttributes(
  base: sanitize.IOptions["allowedAttributes"],
  extra: Record<string, string[]>,
): sanitize.IOptions["allowedAttributes"] {
  const merged: Record<string, string[]> = {
    ...(base as Record<string, string[]>),
  };
  for (const [tag, attrs] of Object.entries(extra)) {
    merged[tag] = [...new Set([...(merged[tag] ?? []), ...attrs])];
  }
  return merged;
}
