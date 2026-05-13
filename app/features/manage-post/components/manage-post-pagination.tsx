import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";

type Props = {
  total: number;
  showing: number;
};

export default function PostingPagination({ total, showing }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? "1");
  const totalPages = Math.ceil(total / 10);

  const goToPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(page));
      return prev;
    });
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {showing} of{" "}
        <span className="font-semibold text-gray-900">{total}</span> postings
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
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
          const page = i + 1;
          return (
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
          );
        })}
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
