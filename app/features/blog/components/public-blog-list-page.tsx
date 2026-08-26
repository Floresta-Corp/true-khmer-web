import { Link, useLoaderData, useNavigate, useNavigation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { formatDate } from "~/lib/time";
import { cn } from "~/lib/utils";
import type { blogLoader } from "../services/blog.loader";
import { PublicBlogCard } from "./public-blog-card";

const FALLBACK_BLOG_IMAGE = "/images/hero-background-image.webp";

const BLOGS_PAGE_SIZE = 6;

function buildBlogUrl(input: {
  page?: number;
  category?: string;
  sort?: "newest" | "oldest";
}) {
  const params = new URLSearchParams();
  if (input.page && input.page > 1) params.set("page", String(input.page));
  if (input.category) params.set("category", input.category);
  if (input.sort && input.sort !== "newest") params.set("sort", input.sort);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function PublicBlogListPage() {
  const {
    categories,
    activeCategory,
    featuredPost,
    posts,
    sort,
    page,
    hasMore,
  } = useLoaderData<typeof blogLoader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const prefersReducedMotion = useReducedMotion();
  const featuredCategoryName =
    activeCategory?.name ||
    (featuredPost?.categoryId
      ? categories.find((category) => category.id === featuredPost.categoryId)
          ?.name
      : null);
  const isLoadingMore =
    navigation.state !== "idle" &&
    navigation.location?.pathname === "/blog" &&
    Number(new URLSearchParams(navigation.location.search).get("page") || "1") >
      page;

  const cardVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 24,
        scale: prefersReducedMotion ? 1 : 0.98,
      },
      show: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: prefersReducedMotion ? 0 : 0.35,
          ease: "easeOut" as const,
          delay: prefersReducedMotion ? 0 : (index % BLOGS_PAGE_SIZE) * 0.05,
        },
      }),
      exit: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : -12,
        transition: { duration: prefersReducedMotion ? 0 : 0.15 },
      },
    }),
    [prefersReducedMotion],
  );

  const gridKey = `${activeCategory?.slug ?? "all"}-${sort}`;

  function handleLoadMore() {
    if (!hasMore || isLoadingMore) return;
    navigate(
      buildBlogUrl({
        page: page + 1,
        category: activeCategory?.slug,
        sort,
      }),
      { preventScrollReset: true },
    );
  }

  return (
    <main className="bg-white py-14 font-sans lg:py-16 dark:bg-slate-950">
      <div className="site-container">
        {featuredPost ? (
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: "easeOut",
            }}
          >
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group relative block overflow-hidden rounded-xl bg-slate-100"
            >
              <img
                src={featuredPost.coverImageUrl || FALLBACK_BLOG_IMAGE}
                alt={featuredPost.coverImageAlt || featuredPost.title}
                className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-[1.015] sm:h-90 md:h-105 lg:h-120 xl:h-130"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/10" />
              <div className="absolute inset-0 flex items-end">
                <motion.div
                  className="w-full max-w-180 px-6 pb-6 text-white sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 xl:max-w-190 xl:px-12 xl:pb-12"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.45,
                    delay: prefersReducedMotion ? 0 : 0.18,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center rounded-full bg-blue-500 px-5 py-2 text-xs font-semibold tracking-[0.05em] text-white uppercase">
                      Featured
                    </span>
                    {featuredCategoryName ? (
                      <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold tracking-[0.05em] text-white uppercase ring-1 ring-white/15 backdrop-blur-[6px]">
                        {featuredCategoryName}
                      </span>
                    ) : null}
                  </div>
                  <h1 className="mt-4 line-clamp-4 text-[30px] leading-[1.05] font-semibold tracking-tight text-white sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[54px]">
                    {featuredPost.title}
                  </h1>
                  <div className="mt-5 sm:mt-6">
                    <p className="text-[14px] font-semibold text-white">
                      {featuredPost.authorName}
                    </p>
                    <p className="mt-1 text-[12px] text-white/80">
                      {formatDate(
                        featuredPost.publishedAt || featuredPost.createdAt,
                      )}
                    </p>
                  </div>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
            <h1 className="text-4xl font-semibold tracking-tight text-[#243d95] dark:text-slate-100">
              No published blog posts yet
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Published stories will appear here automatically.
            </p>
          </div>
        )}

        <motion.div
          className="mt-14 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            delay: prefersReducedMotion ? 0 : 0.1,
            ease: "easeOut",
          }}
        >
          <nav
            className="flex flex-wrap items-center gap-3"
            aria-label="Blog categories"
          >
            <Link
              to={buildBlogUrl({ sort })}
              className={`inline-flex items-center rounded-full px-6 py-2.5 text-sm leading-5 font-semibold transition ${
                activeCategory
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
                  : "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              }`}
            >
              All blogs
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={buildBlogUrl({ category: category.slug, sort })}
                className={`inline-flex items-center rounded-full px-6 py-2.5 text-sm leading-5 font-semibold transition ${
                  activeCategory?.id === category.id
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm font-semibold tracking-widest text-slate-500 uppercase">
            <span>Sort by:</span>
            <Select
              value={sort}
              onValueChange={(value: "newest" | "oldest") =>
                navigate(
                  buildBlogUrl({
                    category: activeCategory?.slug,
                    sort: value,
                  }),
                  { preventScrollReset: true },
                )
              }
            >
              <SelectTrigger
                aria-label="Sort blog posts"
                className="ring-0.5 h-auto w-auto min-w-28 cursor-pointer gap-2 border border-transparent px-3 py-1 text-sm font-semibold text-blue-500 shadow-none ring-blue-500/20 hover:ring-blue-500/40 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-none dark:bg-slate-800"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="cursor-pointer">
                  Newest First
                </SelectItem>
                <SelectItem value="oldest" className="cursor-pointer">
                  Oldest First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {posts.length > 0 ? (
            <motion.div
              key={gridKey}
              className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3"
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  custom={index}
                  className="h-full"
                >
                  <PublicBlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : featuredPost ? (
            <motion.div
              key={`empty-${gridKey}`}
              className="mt-14 rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-14 text-center text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            >
              No blog posts matched this filter.
            </motion.div>
          ) : null}
        </AnimatePresence>

        {hasMore ? (
          <div className="mt-14">
            <motion.button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              whileHover={
                prefersReducedMotion || isLoadingMore ? {} : { y: -2 }
              }
              whileTap={
                prefersReducedMotion || isLoadingMore ? {} : { scale: 0.99 }
              }
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center text-[14px] font-medium text-slate-700 transition-colors hover:border-[#1c97d4]/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {isLoadingMore ? (
                <>
                  <Loader2
                    className={cn(
                      "size-4",
                      !prefersReducedMotion && "animate-spin",
                    )}
                  />
                  Loading...
                </>
              ) : (
                "Load more"
              )}
            </motion.button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
