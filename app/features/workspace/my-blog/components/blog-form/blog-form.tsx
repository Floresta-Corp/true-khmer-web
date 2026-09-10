import { useEffect } from "react";
import { useActionData } from "react-router";
import { toast } from "sonner";
import { readActionResult } from "~/lib/action-result";
import { resolveBlogAuthor } from "~/lib/blog-author";
import type {
  BlogCategoryWithUsageResponse,
  BlogPostResponse,
} from "~/types/api-client";
import { BlogEditorContent } from "../blog-editor/blog-editor-content";
import { BlogEditorToolbar } from "../blog-editor/blog-editor-toolbar";
import { BlogFormCover } from "./blog-form-cover";
import { BlogFormMeta } from "./blog-form-meta";
import { BlogFormTopBar } from "./blog-form-top-bar";
import { BlogModerationBanner } from "./blog-moderation-banner";
import { useBlogForm } from "./use-blog-form";

interface BlogFormProps {
  post?: BlogPostResponse;
  categories: BlogCategoryWithUsageResponse[];
  draftKey: string;
  /** The signed-in account; a saved post carries its own joined author. */
  viewer: { name: string; avatarKey: string | null };
}

export function BlogForm({
  post,
  categories,
  draftKey,
  viewer,
}: BlogFormProps) {
  const actionData = useActionData<{
    ok?: boolean;
    message?: string;
    error?: string;
  }>();
  const author = post ? resolveBlogAuthor(post) : viewer;
  const form = useBlogForm({ post, categories, draftKey, author });

  useEffect(() => {
    if (!actionData) return;
    const { ok, message } = readActionResult(actionData);
    if (ok) toast.success(message || "Blog saved successfully.");
    else toast.error(message || "Unable to save the blog post.");
  }, [actionData]);

  return (
    <div className="mx-auto max-w-[1180px] space-y-8 px-0 pt-0 pb-20 text-slate-950 dark:text-slate-100">
      <BlogFormTopBar form={form} slug={post?.slug} />

      <BlogModerationBanner post={post} />

      {form.isEditable ? <BlogEditorToolbar {...form.editor} /> : null}

      <div className="mx-auto max-w-[1140px] rounded-2xl border border-slate-100 bg-white px-6 pb-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="space-y-10 pt-4">
          <BlogFormCover form={form} />

          <BlogFormMeta form={form}>
            <BlogEditorContent embedded className="pb-20" {...form.editor} />
          </BlogFormMeta>
        </div>
      </div>
    </div>
  );
}
