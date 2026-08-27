import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";

type Props = {
  total: number;
  totalPages?: number;
  pageSize: number;
  /** Plural noun used in the "Showing x of y" line. */
  itemLabel?: string;
};

/**
 * Shared `?page=` pagination for the workspace/myspace listing pages.
 */
export default function SpacePagination({
  total,
  totalPages: paginationTotalPages,
  pageSize,
  itemLabel = "items",
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.max(
    1,
    paginationTotalPages ?? Math.ceil(total / pageSize),
  );
  const rawPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.min(rawPage, totalPages) : 1;

  const showing = Math.min(currentPage * pageSize, total);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(nextPage));
      return next;
    });
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {showing} of{" "}
        <span className="font-semibold text-gray-900">{total}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </Button>
        {pageNumbers.map((page, i) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-gray-400"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              size="icon"
              variant={currentPage === page ? "default" : "outline"}
              className={
                currentPage === page
                  ? "h-8 w-8 bg-blue-600 text-white hover:bg-blue-700"
                  : "h-8 w-8"
              }
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </Button>
      </div>
    </div>
  );
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const siblings = 1;
  const boundary = 1;

  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();

  for (let i = 1; i <= boundary; i++) {
    pages.add(i);
    pages.add(totalPages - i + 1);
  }

  for (let i = currentPage - siblings; i <= currentPage + siblings; i++) {
    if (i >= 1 && i <= totalPages) {
      pages.add(i);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]);
  }

  return result;
}
