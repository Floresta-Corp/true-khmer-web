import { Link, useLoaderData, useNavigate, useNavigation } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { formatDate } from "~/lib/time";
import type { blogLoader } from "../services/blog.loader";
import { PublicBlogCard } from "./public-blog-card";

const FALLBACK_BLOG_IMAGE = "/images/hero-background-image.jpg";

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
      <div className="mx-auto max-w-[1328px] px-5 lg:px-8">
        {featuredPost ? (
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="group relative block overflow-hidden rounded-[12px] bg-slate-100"
          >
            <img
              src={featuredPost.coverImageUrl || FALLBACK_BLOG_IMAGE}
              alt={featuredPost.coverImageAlt || featuredPost.title}
              className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.015] sm:h-[360px] md:h-[420px] lg:h-[480px] xl:h-[520px]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/10" />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full max-w-[720px] px-6 pb-6 text-white sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 xl:max-w-[760px] xl:px-12 xl:pb-12">
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#1c97d4] px-5 py-2 text-xs font-semibold tracking-[0.05em] text-white uppercase">
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
              </div>
            </div>
          </Link>
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

        <div className="mt-14 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <nav
            className="flex flex-wrap items-center gap-3"
            aria-label="Blog categories"
          >
            <Link
              to={buildBlogUrl({ sort })}
              className={`inline-flex items-center rounded-full px-6 py-2.5 text-sm leading-5 font-semibold transition ${
                activeCategory
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
                  : "bg-[#1c97d4] text-white shadow-[0_10px_15px_-3px_rgba(28,151,212,0.22),0_4px_6px_-4px_rgba(28,151,212,0.22)]"
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
                    ? "bg-[#1c97d4] text-white shadow-[0_10px_15px_-3px_rgba(28,151,212,0.22),0_4px_6px_-4px_rgba(28,151,212,0.22)]"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.1em] text-slate-500 uppercase">
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
                className="h-auto w-auto min-w-28 gap-1 border-0 bg-transparent px-0 py-1 text-sm font-semibold tracking-normal text-[#1c97d4] normal-case shadow-none focus-visible:ring-0 dark:bg-transparent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PublicBlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : featuredPost ? (
          <div className="mt-14 rounded-[24px] border border-slate-200 bg-slate-50 px-6 py-14 text-center text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            No blog posts matched this filter.
          </div>
        ) : null}

        {hasMore ? (
          <div className="mt-14">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex w-full items-center justify-center rounded-[12px] border border-slate-200 bg-white p-4 text-center text-[14px] font-medium text-slate-700 transition-colors hover:border-[#1c97d4]/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
