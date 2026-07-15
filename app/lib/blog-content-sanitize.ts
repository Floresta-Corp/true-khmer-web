export const BLOG_CONTENT_EXTRA_ALLOWED_TAGS = ["figure", "figcaption"];

export const BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  figure: ["data-type", "data-display-width", "data-image-width", "style"],
  img: ["style"],
};
