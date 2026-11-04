import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { AuthorAvatar } from "~/components/author-avatar";
import HeaderSearch from "~/components/header-search";
import { Skeleton } from "~/components/ui/skeleton";
import { resolveBlogAuthor } from "~/lib/blog-author";
import { formatDate } from "~/lib/time";
import { cn } from "~/lib/utils";
import type { PublicBlogPostListingItemResponse } from "~/types/api-client";

const easings = {
  enter: "easeInOut" as const,
  smooth: "easeInOut" as const,
};

const FALLBACK_BLOG_IMAGE = "/images/hero-background-image.webp";
const EMPTY_HERO_IMAGE = "/images/Inspiration.jpg";

// The editor's loader guards auth and bounces guests through login.
const WRITE_ARTICLE_PATH = "/workspace/khmer-voices/new";

type FeaturedProps = {
  featuredPost: PublicBlogPostListingItemResponse | null;
  featuredCategoryName: string | null;
  isLoadingFeatured: boolean;
};

function BlogFeaturedOverlay({
  post,
  categoryName,
}: {
  post: PublicBlogPostListingItemResponse;
  categoryName: string | null;
}) {
  const author = resolveBlogAuthor(post);

  return (
    <>
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-6 text-white sm:px-8 sm:pb-7 lg:px-9 lg:pb-8">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-white uppercase">
            Featured
          </span>
          {categoryName ? (
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-white uppercase ring-1 ring-white/20 backdrop-blur-[6px]">
              {categoryName}
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 line-clamp-2 text-[22px] leading-[1.15] font-semibold tracking-tight text-white sm:text-[26px] lg:text-[28px]">
          {post.title}
        </h2>
        <div className="mt-4 flex items-center gap-2.5">
          {author.avatarKey ? (
            <AuthorAvatar
              name={author.name}
              avatarKey={author.avatarKey}
              className="h-8 w-8"
            />
          ) : null}
          <div>
            <p className="text-[13px] font-semibold text-white">
              {author.name}
            </p>
            <p className="text-[12px] text-white/75">
              {formatDate(post.publishedAt || post.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/** Featured post card, shared by the desktop hero and the mobile list. */
export function BlogFeaturedPanel({
  featuredPost,
  featuredCategoryName,
  isLoadingFeatured,
  className,
}: FeaturedProps & { className?: string }) {
  const frame = cn(
    "relative z-0 block h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-900",
    className,
  );

  if (isLoadingFeatured) {
    return (
      <div aria-hidden className={frame}>
        <Skeleton className="absolute inset-0 size-full rounded-none" />
      </div>
    );
  }

  if (!featuredPost) {
    return (
      <div className={frame}>
        <img
          src={EMPTY_HERO_IMAGE}
          alt="Cambodians gathered with flags in front of the Royal Palace"
          loading="eager"
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <Link
      to={`/khmer-voices/${featuredPost.slug}`}
      className={cn("group", frame)}
    >
      <img
        src={featuredPost.coverImageUrl || FALLBACK_BLOG_IMAGE}
        alt={featuredPost.coverImageAlt || featuredPost.title}
        loading="eager"
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
      />
      <BlogFeaturedOverlay
        post={featuredPost}
        categoryName={featuredCategoryName}
      />
    </Link>
  );
}

function BlogHeroImage({ dur, ...featured }: FeaturedProps & { dur: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 * dur, ease: easings.enter }}
      className="relative h-full w-full py-4"
    >
      <BlogFeaturedPanel
        {...featured}
        className="rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
      />
    </motion.div>
  );
}

function BlogWriteLink({ to, dur }: { to: string; dur: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -12,
        transition: { duration: 0.2 * dur, ease: "easeInOut" as const },
      }}
      transition={{
        duration: 0.5 * dur,
        delay: 0.35 * dur,
        ease: easings.enter,
      }}
      className="text-sm text-slate-500"
    >
      Have a story to share?{" "}
      <Link
        to={to}
        className="group relative inline-flex items-center gap-1 font-semibold text-[#2463eb] transition-colors hover:text-[#1d56d2]"
      >
        <span className="relative">
          Write an article
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-center scale-x-0 bg-[#2463eb] transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:bg-[#1d56d2]" />
        </span>

        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </motion.p>
  );
}

export function PublicBlogHero({
  search,
  ...featured
}: FeaturedProps & { search: string }) {
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2, ease: "easeInOut" as const },
      }}
      transition={{ duration: 0.4 * dur, ease: "easeInOut" as const }}
      className="relative w-full overflow-hidden bg-white"
    >
      <div className="site-container grid grid-cols-1 items-stretch gap-8 pt-10 pb-2 sm:pt-12 sm:pb-3 lg:grid-cols-12 lg:gap-5 lg:py-5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.2, ease: "easeInOut" as const },
          }}
          transition={{ duration: 0.7 * dur, ease: easings.enter }}
          className="flex flex-col items-start gap-4 py-2 text-left sm:gap-5 lg:col-span-5 lg:min-h-90 lg:justify-center"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#32A8FF] uppercase sm:text-xs">
            <img
              src="/home-explore-blog.png"
              className="size-10 object-contain sm:size-12 lg:size-14"
              alt=""
            />
            Khmer Voices
          </span>

          <h1 className="text-[28px] leading-[1.12] font-bold tracking-[-0.03em] text-slate-900 sm:text-[34px] sm:leading-[1.08] lg:text-[38px]">
            <span className="text-[#32A8FF]">Share your story</span> with the
            Khmer community.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -16,
              transition: { duration: 0.2, ease: "easeInOut" as const },
            }}
            transition={{
              duration: 0.6 * dur,
              delay: 0.15 * dur,
              ease: easings.enter,
            }}
            className="max-w-lg text-[14px] leading-6 text-slate-500 sm:text-base sm:leading-7"
          >
            Stories, interviews and ideas on business, careers, culture and
            building in Cambodia.
          </motion.p>

          {/* Keyed so the input resets when the URL's search changes. */}
          <HeaderSearch
            key={search}
            inputPlaceholder="Search voices..."
            searchBaseUrl="/khmer-voices"
            defaultSearch={search}
            dur={dur}
          />

          <BlogWriteLink to={WRITE_ARTICLE_PATH} dur={dur} />
        </motion.div>

        <div className="hidden w-full items-stretch lg:col-span-7 lg:flex">
          <BlogHeroImage dur={dur} {...featured} />
        </div>
      </div>
    </motion.section>
  );
}
