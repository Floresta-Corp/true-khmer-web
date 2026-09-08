import type { Route } from "./+types/not-found";
import { NotFound } from "../components/not-found";
import { notFoundLoader } from "../services/not-found.loader";

export const loader = notFoundLoader;

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Page Not Found - True Khmer" },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFoundRoute() {
  return <NotFound />;
}
