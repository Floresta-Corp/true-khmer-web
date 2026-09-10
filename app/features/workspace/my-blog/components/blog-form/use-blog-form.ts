import { useCallback } from "react";
import { useNavigation, useSubmit } from "react-router";
import type {
  BlogCategoryWithUsageResponse,
  BlogPostResponse,
} from "~/types/api-client";
import { useBlogTextEditor } from "../blog-editor/use-blog-editor";
import {
  BLOG_PREVIEW_STORAGE_KEY,
  isEditableBlogStatus,
  MY_BLOG_ACTIONS,
  type BlogPreviewDraft,
  type MyBlogActionType,
} from "../../types";
import { useBlogAutosave } from "./use-blog-autosave";
import { getDisplayTitle, useBlogFields } from "./use-blog-fields";

function hasMeaningfulContent(html: string): boolean {
  const stripped = html.replace(/<[^>]*>/g, "").trim();
  if (stripped.length >= 20) return true;
  return /<(img|iframe|video|blockquote|pre|ul|ol|h[1-6])[\s>]/i.test(html);
}

interface UseBlogFormOptions {
  post?: BlogPostResponse;
  categories: BlogCategoryWithUsageResponse[];
  draftKey: string;
  /** The account this blog is published under. */
  author: { name: string; avatarKey: string | null };
}

export function useBlogForm({
  post,
  categories,
  draftKey,
  author,
}: UseBlogFormOptions) {
  const submit = useSubmit();
  const navigation = useNavigation();

  const status = post?.status ?? "DRAFT";
  const isEditable = isEditableBlogStatus(status);

  const {
    content,
    fields,
    isUploadingCover,
    refs,
    resizeTextarea,
    setContent,
    setters,
    showImageCreditEditor,
  } = useBlogFields({ post, draftKey });

  const editor = useBlogTextEditor({
    value: content,
    onChange: setContent,
    editable: isEditable,
  });

  const { tagInput: _tagInput, ...autosavedFields } = fields;

  const buildFormData = useCallback(
    (intent: MyBlogActionType = MY_BLOG_ACTIONS.save) => {
      const formData = new FormData();
      formData.set("intent", intent);
      formData.set("title", fields.title || "Untitled Draft");
      formData.set("excerpt", fields.excerpt);
      formData.set("authorRole", fields.authorRole);
      formData.set("tags", JSON.stringify(fields.tags));
      formData.set("categoryId", fields.categoryId);
      formData.set("coverImageKey", fields.coverImageKey ?? "");
      formData.set("coverImageAlt", fields.coverImageAlt);
      formData.set("coverImageCaption", fields.coverImageCaption);
      formData.set("content", content);
      return formData;
    },
    [content, fields],
  );

  const { autosaveLabel, autosaveStatus, isAutosaving, savedPostIdRef } =
    useBlogAutosave({
      // `tagInput` is the in-progress keystrokes of the tag box, not saved data.
      payload: { ...autosavedFields, content },
      buildFormData,
      draftKey,
      postId: post?.id,
      savedAt: post?.updatedAt,
      enabled: isEditable,
    });

  const openPreview = useCallback(() => {
    const draft: BlogPreviewDraft = {
      title: getDisplayTitle(fields.title) || "Untitled Draft",
      excerpt: fields.excerpt,
      authorName: author.name,
      authorAvatarKey: author.avatarKey,
      authorRole: fields.authorRole,
      tags: fields.tags,
      categoryName: categories.find(
        (category) => category.id === fields.categoryId,
      )?.name,
      coverImageUrl: fields.coverImageUrl || undefined,
      coverImageAlt: fields.coverImageAlt,
      coverImageCaption: fields.coverImageCaption,
      content,
      previewDate: new Date().toISOString(),
      editorUrl: window.location.href,
    };
    window.localStorage.setItem(
      BLOG_PREVIEW_STORAGE_KEY,
      JSON.stringify(draft),
    );
    window.open("/workspace/khmer-voices/preview", "_blank");
  }, [author, categories, content, fields]);

  const runIntent = useCallback(
    (intent: MyBlogActionType, extraFields?: Record<string, string>) => {
      const formData = buildFormData(intent);
      // Autosave may have created the draft before this submit; sending its id
      // keeps a manual save from creating a second post.
      const savedPostId = post?.id ?? savedPostIdRef.current;
      if (savedPostId) formData.set("postId", savedPostId);
      for (const [key, value] of Object.entries(extraFields ?? {})) {
        formData.set(key, value);
      }
      submit(formData, { method: "post" });
    },
    [buildFormData, post?.id, savedPostIdRef, submit],
  );

  const isSubmittable = Boolean(
    fields.title.trim() &&
    fields.coverImageUrl.trim() &&
    hasMeaningfulContent(content),
  );

  return {
    author,
    autosaveLabel,
    autosaveStatus,
    categories,
    content,
    editor,
    fields,
    isEditable,
    isAutosaving,
    isSubmittable,
    isSubmitting: navigation.state === "submitting",
    isUploadingCover,
    openPreview,
    refs,
    resizeTextarea,
    runIntent,
    setters,
    showImageCreditEditor,
    status,
  };
}

export type BlogFormState = ReturnType<typeof useBlogForm>;
