import { PublicBlogDetailPage } from "../components/public-blog-detail-page";
import {
  blogDetailLoader,
  headers as blogDetailHeaders,
} from "../services/blog-detail.loader";
import { blogCommentAction } from "../services/blog-comment.action";

export const loader = blogDetailLoader;
export const action = blogCommentAction;
export const headers = blogDetailHeaders;

export function meta({ data }: { data?: { post: { title: string } } }) {
  return [
    {
      title: data
        ? `${data.post.title} | True Khmer Blog`
        : "Khmer Voice | True Khmer",
    },
  ];
}

export default function BlogDetailRoute() {
  return <PublicBlogDetailPage />;
}
