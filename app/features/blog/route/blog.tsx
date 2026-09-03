import { PublicBlogListPage } from "../components/public-blog-list-page";
import { blogLoader, headers as blogHeaders } from "../services/blog.loader";

export const loader = blogLoader;
export const headers = blogHeaders;

export function meta() {
  return [{ title: "Khmer Voice | True Khmer" }];
}

export default function BlogRoute() {
  return <PublicBlogListPage />;
}
