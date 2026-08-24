import { useState } from "react";
import { Link, useLoaderData, useNavigate, useNavigation } from "react-router";
import { ChevronLeft } from "lucide-react";
import { SanitizedHtml } from "~/components/sanitized-html";
import {
  BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES,
  BLOG_CONTENT_EXTRA_ALLOWED_TAGS,
} from "~/lib/blog-content-sanitize";
import { formatDate } from "~/lib/time";
import type { blogDetailLoader } from "../services/blog-detail.loader";
import BackToButton from "~/components/back-to-button";

export function PublicBlogDetailPage() {
  const { post, relatedPosts } = useLoaderData<typeof blogDetailLoader>();
  const [shareLabel, setShareLabel] = useState("Share");
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isGoingBack = navigation.state !== "idle";

  function handleGoBack() {
    if (isGoingBack) return;
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/blog");
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url });
      } catch {
        // The native share sheet was dismissed.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("Copied");
      window.setTimeout(() => setShareLabel("Share"), 1800);
    } catch {
      setShareLabel("Share");
    }
  }

  return (
    <main className="bg-white pt-6 pb-14 font-sans sm:pt-7 lg:pt-8 lg:pb-16 dark:bg-slate-950">
      <div className="site-container px-5">
        <div className="mb-3 hidden sm:block">
          <BackToButton to="/blog" />
        </div>

        {post.coverImageUrl ? (
          <figure className="relative mt-4 overflow-hidden rounded-[16px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:mt-5 sm:rounded-[12px]">
            <button
              type="button"
              onClick={handleGoBack}
              disabled={isGoingBack}
              aria-label="Go back"
              className="absolute top-4 left-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-[6px] transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              decoding="async"
              className="aspect-16/9 w-full object-cover sm:aspect-auto sm:h-[432px]"
            />
            {post.coverImageCaption ? (
              <figcaption className="bg-white px-5 py-3 text-center text-xs text-slate-500 italic dark:bg-slate-950 dark:text-slate-400">
                {post.coverImageCaption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <div className="mb-3 sm:hidden">
            <button
              type="button"
              onClick={handleGoBack}
              disabled={isGoingBack}
              className="group inline-flex items-center gap-1.5 py-0.5 text-[14px] font-medium text-slate-500"
            >
              <ChevronLeft className="h-[18px] w-[18px]" />
              <span>Back</span>
            </button>
          </div>
        )}

        {post.isFeatured || post.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {post.isFeatured ? (
              <span className="rounded-full bg-blue-500 px-4 py-1.5 text-[10px] font-semibold tracking-[0.5px] text-white uppercase">
                Featured
              </span>
            ) : null}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-semibold tracking-[0.5px] text-[#0082e1] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <h1
          className={`${post.isFeatured || post.tags.length > 0 ? "mt-6" : "mt-10"} text-[26px] leading-[1.08] font-semibold tracking-tight text-[#243d95] sm:text-[52px] sm:leading-[1.02] dark:text-slate-100`}
        >
          {post.title}
        </h1>

        <div className="mt-8 flex items-end justify-between gap-4 border-t border-slate-200 pt-6 dark:border-white/10">
          <div>
            <p className="text-[14px] font-medium text-slate-900 dark:text-slate-100">
              {post.authorName}
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              {formatDate(post.publishedAt || post.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 px-4 text-[12px] font-medium text-slate-500 transition hover:border-blue-500 hover:text-blue-500 dark:border-white/15"
          >
            {shareLabel}
          </button>
        </div>

        <article className="mt-12">
          <SanitizedHtml
            html={post.content}
            className="blog-rich-text max-w-none"
            extraAllowedTags={BLOG_CONTENT_EXTRA_ALLOWED_TAGS}
            extraAllowedAttributes={BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES}
          />
        </article>

        {relatedPosts.length > 0 ? (
          <section className="mt-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[32px] font-semibold tracking-tight text-[#243d95] dark:text-slate-100">
                  Recommended for You
                </h2>
                <p className="mt-2 text-[14px] text-slate-500">
                  More stories from the community
                </p>
              </div>
              <Link
                to="/blog"
                className="text-[12px] font-semibold text-[#0082e1] hover:underline"
              >
                View all stories +
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group block overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 hover:-translate-y-1 hover:border-[#1c97d4]/30 dark:border-white/10 dark:bg-slate-950"
                >
                  <img
                    src={
                      relatedPost.coverImageUrl ||
                      "/images/hero-background-image.webp"
                    }
                    alt={relatedPost.coverImageAlt || relatedPost.title}
                    className="h-[206px] w-full object-cover"
                  />
                  <div className="px-8 pt-6 pb-8">
                    <h3 className="text-xl leading-tight font-semibold tracking-tight text-[#243d95] transition-colors group-hover:text-blue-500 dark:text-slate-100">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-4 line-clamp-3 text-[14px] leading-5 text-slate-600 dark:text-slate-400">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
