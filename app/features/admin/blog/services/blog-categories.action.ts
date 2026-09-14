import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.categories";
import {
  createBlogCategory,
  updateBlogCategory,
} from "~/api/admin/blog/blog.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { BLOG_CATEGORY_INTENTS } from "../types";

export async function blogCategoriesAction({ request }: Route.ActionArgs) {
  const { setCookie } = await requireAdmin(request);
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    if (intent === BLOG_CATEGORY_INTENTS.create) {
      const name = String(formData.get("name") ?? "").trim();
      if (!name) {
        return data(
          { ok: false, intent, message: "Category name is required." },
          { status: 400 },
        );
      }
      await createBlogCategory(request, { name, slug: name });
      return data(
        { ok: true, intent, message: "Category created successfully." },
        cookieHeader,
      );
    }

    if (intent === BLOG_CATEGORY_INTENTS.update) {
      const categoryId = String(formData.get("categoryId") ?? "").trim();
      const name = String(formData.get("name") ?? "").trim();
      if (!categoryId || !name) {
        return data(
          {
            ok: false,
            intent,
            message: categoryId
              ? "Category name is required."
              : "Category ID is required.",
          },
          { status: 400 },
        );
      }
      await updateBlogCategory(request, categoryId, { name });
      return data(
        { ok: true, intent, message: "Category updated successfully." },
        cookieHeader,
      );
    }

    if (intent === BLOG_CATEGORY_INTENTS.toggleVisibility) {
      const categoryId = String(formData.get("categoryId") ?? "").trim();
      if (!categoryId) {
        return data(
          { ok: false, intent, message: "Category ID is required." },
          { status: 400 },
        );
      }
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

    return data(
      { ok: false, intent, message: "Unknown category action." },
      { status: 400 },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return data(
        { ok: false, intent, message: error.message },
        { status: error.status },
      );
    }
    return data(
      { ok: false, intent, message: "Category action failed." },
      { status: 500 },
    );
  }
}
