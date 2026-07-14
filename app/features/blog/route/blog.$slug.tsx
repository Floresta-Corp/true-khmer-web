import { PublicBlogDetailPage } from "../components/public-blog-detail-page";
import {
  blogDetailLoader,
  headers as blogDetailHeaders,
} from "../services/blog-detail.loader";

export const loader = blogDetailLoader;
export const headers = blogDetailHeaders;

export function meta({ data }: { data?: { post: { title: string } } }) {
  return [
    {
      title: data
        ? `${data.post.title} | True Khmer Blog`
        : "Blog | True Khmer",
    },
  ];
}

export default function BlogDetailRoute() {
  return <PublicBlogDetailPage />;
}
