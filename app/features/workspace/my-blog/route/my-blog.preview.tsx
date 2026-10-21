import { useLoaderData } from "react-router";
import { BlogPreview } from "../components/blog-preview";
import { myBlogPreviewClientLoader } from "../services/my-blog-preview.loader";

// No server loader, so React Router runs this on hydration and server-renders
// HydrateFallback until it resolves.
export const clientLoader = myBlogPreviewClientLoader;

export function meta() {
  return [{ title: "Preview | True Khmer" }];
}

export function HydrateFallback() {
  return null;
}

export default function MyBlogPreviewRoute() {
  const { draft } = useLoaderData<typeof myBlogPreviewClientLoader>();
  return <BlogPreview draft={draft} />;
}
