import type { Route } from "project-types/blog/route/+types/blog.$slug";
import { resolveBlogAuthor } from "~/lib/blog-author";
import { imageAlt, metaOrigin, pageMeta, SITE } from "~/lib/seo";
import { blogPostingJsonLd, breadcrumbJsonLd } from "~/lib/seo/structured-data";
import { PublicBlogDetailPage } from "../components/public-blog-detail-page";
import {
  blogDetailLoader,
  headers as blogDetailHeaders,
} from "../services/blog-detail.loader";
import { blogCommentAction } from "../services/blog-comment.action";

export const loader = blogDetailLoader;
export const action = blogCommentAction;
export const headers = blogDetailHeaders;

export function meta(args: Route.MetaArgs) {
  const post = args.data?.post;
  const origin = metaOrigin(args);

  if (!post) {
    return pageMeta(args, {
      title: "Khmer voices",
      description: SITE.description,
      // The loader redirects a missing slug to /khmervoices, so this only renders on
      // a failed load -- not a page to leave in the index.
      noindex: true,
    });
  }

  const path = `/khmervoices/${post.slug}`;
  const author = resolveBlogAuthor(post);

  return pageMeta(args, {
    title: post.title,
    // The excerpt is the author's own summary, which beats a machine-cut
    // sentence from the body; the body is the fallback when there is none.
    description: post.excerpt || post.content,
    type: "article",
    image: post.coverImageUrl
      ? {
          url: post.coverImageUrl,
          alt: imageAlt(post.coverImageAlt, post.title),
        }
      : null,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [author.name],
      section: post.categoryName ?? null,
      tags: post.tags,
    },
    jsonLd: [
      blogPostingJsonLd({
        origin,
        pathname: path,
        headline: post.title,
        description: post.excerpt,
        image: post.coverImageUrl,
        authorName: author.name,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        section: post.categoryName ?? null,
        keywords: post.tags,
        commentCount: post.commentCount,
        body: post.content,
      }),
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name: "Khmer voices", path: "/khmervoices" },
        { name: post.title, path },
      ]),
    ],
  });
}

export default function BlogDetailRoute() {
  return <PublicBlogDetailPage />;
}
