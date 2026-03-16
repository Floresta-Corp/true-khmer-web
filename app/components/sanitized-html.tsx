import sanitize from "sanitize-html";
import { cn } from "~/lib/utils";

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: [
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
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitize.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

interface SanitizedHtmlProps {
  /** Raw HTML string to sanitize and render */
  html: string;
  /** Additional CSS class names */
  className?: string;
  /** HTML element to render as (default: "div") */
  as?: keyof React.JSX.IntrinsicElements;
}

export function SanitizedHtml({
  html,
  className,
  as: Tag = "div",
}: SanitizedHtmlProps) {
  const clean = sanitize(html, SANITIZE_OPTIONS);

  return (
    <Tag
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
