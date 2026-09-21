import SpacePagination from "~/components/space-pagination";

type Props = {
  total: number;
  totalPages?: number;
  pageSize: number;
};

export default function PostingPagination(props: Props) {
  return <SpacePagination {...props} itemLabel="postings" />;
}
