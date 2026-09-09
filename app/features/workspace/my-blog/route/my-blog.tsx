import { MyBlogListPage } from "../components/pages/my-blog-list-page";
import { MyBlogListSkeleton } from "../components/my-blog-list-skeleton";
import { myBlogAction } from "../services/my-blog.action";
import { myBlogLoader } from "../services/my-blog.loader";

export const loader = myBlogLoader;
export const action = myBlogAction;

export function meta() {
  return [{ title: "My Blogs | True Khmer" }];
}

export function HydrateFallback() {
  return <MyBlogListSkeleton />;
}

export default function MyBlogRoute() {
  return <MyBlogListPage />;
}
