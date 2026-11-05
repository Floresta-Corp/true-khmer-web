import { useLoaderData, useNavigate, useNavigation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { InfiniteScrollTrigger } from "~/components/infinite-scroll-trigger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { blogLoader } from "../services/blog.loader";
import { BlogCategoryNav } from "./blog-category-nav";
import { BlogFeaturedPanel, PublicBlogHero } from "./public-blog-hero";
import { PublicBlogCard } from "./public-blog-card";
import { PublicBlogGridSkeleton } from "./public-blog-list-skeleton";

const BLOGS_PAGE_SIZE = 6;

function buildBlogUrl(input: {
  page?: number;
  category?: string;
  search?: string;
  sort?: "newest" | "oldest";
}) {
  const params = new URLSearchParams();
  if (input.page && input.page > 1) params.set("page", String(input.page));
  if (input.category) params.set("category", input.category);
  if (input.search) params.set("search", input.search);
  if (input.sort && input.sort !== "newest") params.set("sort", input.sort);
  const query = params.toString();
  return query ? `/khmer-voices?${query}` : "/khmer-voices";
}

export function PublicBlogListPage() {
  const {
    categories,
    activeCategory,
    featuredPost,
    posts,
    search,
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
  const pendingParams = navigation.location
    ? new URLSearchParams(navigation.location.search)
    : null;
  const isNavigatingToList =
    navigation.state !== "idle" &&
    navigation.location?.pathname === "/khmer-voices";

  const isLoadingMore =
    isNavigatingToList && Number(pendingParams?.get("page") || "1") > page;

  const isChangingFilters = isNavigatingToList && !isLoadingMore;

  const isChangingCategory =
    isChangingFilters &&
    (pendingParams?.get("category") || null) !== (activeCategory?.slug || null);

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

  const gridKey = `${activeCategory?.slug ?? "all"}-${search}-${sort}`;

  function handleLoadMore() {
    if (!hasMore || isLoadingMore) return;
    navigate(
      buildBlogUrl({
        page: page + 1,
        category: activeCategory?.slug,
        search,
        sort,
      }),
      { preventScrollReset: true },
    );
  }

  const featured = {
    featuredPost,
    featuredCategoryName: featuredCategoryName ?? null,
    isLoadingFeatured: isChangingCategory,
  };

  return (
    <>
      <PublicBlogHero
        {...featured}
        search={search}
        category={activeCategory?.slug ?? null}
        sort={sort}
      />
      <main className="bg-white pt-10 pb-14 font-sans lg:pt-12 lg:pb-16 dark:bg-slate-950">
        <div className="site-container">
          {/* The hero hides its featured panel below lg, so show it here. */}
          {featuredPost || isChangingCategory ? (
            <div className="mb-8 h-80 sm:h-90 lg:hidden">
              <BlogFeaturedPanel
                {...featured}
                className="rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
              />
            </div>
          ) : null}

          {!featuredPost && !isChangingCategory && !search ? (
            <div className="mb-8 rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
              <h2 className="text-4xl font-semibold tracking-tight text-[#243d95] dark:text-slate-100">
                No published blog posts yet
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                Published stories will appear here automatically.
              </p>
            </div>
          ) : null}

          <motion.div
            className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : 0.1,
              ease: "easeOut",
            }}
          >
            <BlogCategoryNav
              categories={categories}
              activeCategory={activeCategory}
              buildHref={(slug) =>
                buildBlogUrl({ category: slug, search, sort })
              }
            />

            <div className="flex shrink-0 items-center gap-2 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              <span>Sort by:</span>
              <Select
                value={sort}
                onValueChange={(value: "newest" | "oldest") =>
                  navigate(
                    buildBlogUrl({
                      category: activeCategory?.slug,
                      search,
                      sort: value,
                    }),
                    { preventScrollReset: true },
                  )
                }
              >
                <SelectTrigger
                  aria-label="Sort blog posts"
                  className="h-auto w-auto min-w-28 cursor-pointer gap-2 border border-transparent px-3 py-1 text-sm font-semibold text-blue-500 shadow-none ring-1 ring-blue-500/20 hover:ring-blue-500/40 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-none dark:bg-slate-800"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="newest"
                    className="data-[state=checked]:text-500 cursor-pointer data-[state=checked]:text-blue-500 [&_svg]:data-[state=checked]:text-blue-500"
                  >
                    Newest First
                  </SelectItem>
                  <SelectItem
                    value="oldest"
                    className="data-[state=checked]:text-500 cursor-pointer data-[state=checked]:text-blue-500 [&_svg]:data-[state=checked]:text-blue-500"
                  >
                    Oldest First
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isChangingFilters ? (
              <motion.div
                key={`skeleton-${gridKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              >
                <PublicBlogGridSkeleton count={BLOGS_PAGE_SIZE} />
              </motion.div>
            ) : posts.length > 0 ? (
              <motion.div
                key={gridKey}
                className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
            ) : featuredPost || search ? (
              <motion.div
                key={`empty-${gridKey}`}
                className="mt-14 rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-14 text-center text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              >
                {search
                  ? `No voices matched "${search}".`
                  : "No blog posts matched this filter."}
              </motion.div>
            ) : null}
          </AnimatePresence>
          {!isChangingFilters ? (
            <div className="mt-8">
              {/* Keyed by page so the observer re-attaches after each load and
                fires again if the sentinel is still on screen. */}
              <InfiniteScrollTrigger
                key={page}
                hasMore={hasMore}
                isLoading={isLoadingMore}
                onTrigger={handleLoadMore}
              />
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
