import { BlogPreview } from "../components/blog-preview";

export function meta() {
  return [{ title: "Preview | True Khmer" }];
}

export default function BlogPreviewRoute() {
  return <BlogPreview />;
}
