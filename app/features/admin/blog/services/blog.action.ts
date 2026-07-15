import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog";
import {
  createBlogCategory,
  deleteBlogPost,
  setBlogPostFeatured,
  updateBlogCategory,
} from "~/api/admin/blog/blog.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

export async function blogAction({ request }: Route.ActionArgs) {
  const { setCookie } = await requireAdmin(request);
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    if (intent === "createCategory") {
      const name = String(formData.get("name") ?? "").trim();
      if (!name) {
        return data(
          { ok: false, message: "Category name is required" },
          { status: 400 },
        );
      }
      await createBlogCategory(request, { name, slug: name });
      return data(
        { ok: true, intent, message: "Category created successfully." },
        cookieHeader,
      );
    }

    if (intent === "toggleCategoryVisibility") {
      const categoryId = String(formData.get("categoryId") ?? "");
      const isVisible = formData.get("isVisible") === "true";
      await updateBlogCategory(request, categoryId, { isVisible });
      return data(
        {
          ok: true,
          intent,
          message: `Category ${isVisible ? "shown" : "hidden"} successfully.`,
        },
        cookieHeader,
      );
    }

    if (intent === "updateCategory") {
      const categoryId = String(formData.get("categoryId") ?? "").trim();
      const name = String(formData.get("name") ?? "").trim();
      if (!categoryId) {
        return data(
          { ok: false, message: "Category ID is required", categoryId },
          { status: 400 },
        );
      }
      if (!name) {
        return data(
          { ok: false, message: "Category name is required", categoryId },
          { status: 400 },
        );
      }
      await updateBlogCategory(request, categoryId, { name });
      return data(
        {
          ok: true,
          intent,
          message: "Category updated successfully.",
          categoryId,
        },
        cookieHeader,
      );
    }

    if (intent === "delete") {
      const postId = String(formData.get("postId") ?? "");
      await deleteBlogPost(request, postId);
      return data(
        { ok: true, intent, message: "Blog deleted successfully." },
        cookieHeader,
      );
    }

    if (intent === "feature") {
      const postId = String(formData.get("postId") ?? "");
      const isFeatured = formData.get("isFeatured") === "true";
      await setBlogPostFeatured(request, postId, { isFeatured });
      return data(
        { ok: true, intent, message: "Featured blog updated successfully." },
        cookieHeader,
      );
    }

    return data(
      { ok: false, message: "Unknown action intent" },
      { status: 400 },
    );
  } catch (err) {
    if (err instanceof ProtectedApiError) {
      return data({ ok: false, message: err.message }, { status: err.status });
    }
    return data({ ok: false, message: "Action failed" }, { status: 500 });
  }
}
