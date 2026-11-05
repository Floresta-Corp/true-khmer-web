import type { Route } from "project-types/blog/route/+types/blog.$slug";
import { isBlogLikeAction } from "../types";
import { blogCommentAction } from "./blog-comment.action";
import { blogLikeAction } from "./blog-like.action";

/** The detail route has one action; this sends likes and comments apart. */
export async function blogDetailAction(args: Route.ActionArgs) {
  const formData = await args.request.clone().formData();
  const actionType = String(formData.get("actionType") ?? "").trim();

  if (isBlogLikeAction(actionType)) {
    return blogLikeAction(args.request, formData);
  }

  return blogCommentAction(args);
}
