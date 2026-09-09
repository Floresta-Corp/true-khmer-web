import type { Route } from "./+types/not-found";
import { NotFound } from "../components/not-found";
import { notFoundLoader } from "../services/not-found.loader";
import { pageMeta } from "~/lib/seo";

export const loader = notFoundLoader;

export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: "Page not found",
    description: "The page you were looking for does not exist.",
    noindex: true,
  });
}

export default function NotFoundRoute() {
  return <NotFound />;
}
