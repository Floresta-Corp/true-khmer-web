import { Button } from "~/components/ui/button";

type Props = {
  total: number;
  showing: number;
};

export default function PostingPagination({ total, showing }: Props) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {showing} of{" "}
        <span className="font-semibold text-gray-900">{total}</span> postings
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="icon" className="h-8 w-8">
          ‹
        </Button>
        <Button
          size="icon"
          className="h-8 w-8 bg-blue-600 text-white hover:bg-blue-700"
        >
          1
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          2
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          ›
        </Button>
      </div>
    </div>
  );
}
