import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { BlogPostResponse } from "~/types/api-client";
import { BLOG_AUTOSAVE_STORAGE_PREFIX, BLOG_TAG_LIMIT } from "../../types";

export function getDisplayTitle(title?: string | null) {
  return title === "Untitled Draft" ? "" : title || "";
}

interface UseBlogFieldsOptions {
  post?: BlogPostResponse;
  draftKey: string;
}

/** Every editable field of the composer, plus the local-draft restore. */
export function useBlogFields({ post, draftKey }: UseBlogFieldsOptions) {
  const [didRestoreDraft, setDidRestoreDraft] = useState(false);
  const [title, setTitle] = useState(getDisplayTitle(post?.title));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [authorRole, setAuthorRole] = useState(post?.authorRole ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? "");
  const [coverImageKey, setCoverImageKey] = useState<string | null>(
    post?.coverImageKey ?? null,
  );
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(post?.coverImageAlt ?? "");
  const [coverImageCaption, setCoverImageCaption] = useState(
    post?.coverImageCaption ?? "",
  );
  const [showImageCreditEditor, setShowImageCreditEditor] = useState(
    Boolean(post?.coverImageCaption),
  );
  const [content, setContent] = useState(post?.content ?? "");
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  const excerptInputRef = useRef<HTMLTextAreaElement | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const restoredRef = useRef(false);

  const resizeTextarea = useCallback((element: HTMLTextAreaElement | null) => {
    if (!element) return;
    element.style.height = "0px";
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resizeTextarea(titleInputRef.current);
  }, [resizeTextarea, title]);

  useEffect(() => {
    resizeTextarea(excerptInputRef.current);
  }, [resizeTextarea, excerpt]);

  // Restore an unsaved local draft (e.g. after a refresh) when creating a post.
  useEffect(() => {
    if (post || restoredRef.current) return;
    restoredRef.current = true;

    const raw = window.localStorage.getItem(
      `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
    );
    if (!raw) return;

    try {
      const restored = JSON.parse(raw) as Record<string, unknown>;
      const readText = (key: string) =>
        typeof restored[key] === "string" ? (restored[key] as string) : "";

      if (readText("title")) setTitle(readText("title"));
      if (readText("excerpt")) setExcerpt(readText("excerpt"));
      if (readText("authorRole")) setAuthorRole(readText("authorRole"));
      if (Array.isArray(restored.tags)) setTags(restored.tags as string[]);
      if (readText("categoryId")) setCategoryId(readText("categoryId"));
      if (readText("coverImageKey"))
        setCoverImageKey(readText("coverImageKey"));
      if (readText("coverImageUrl"))
        setCoverImageUrl(readText("coverImageUrl"));
      if (readText("coverImageAlt"))
        setCoverImageAlt(readText("coverImageAlt"));
      if (readText("coverImageCaption")) {
        setCoverImageCaption(readText("coverImageCaption"));
        setShowImageCreditEditor(true);
      }
      if (readText("content")) setContent(readText("content"));
      setDidRestoreDraft(true);
    } catch {
      // Ignore malformed local draft data.
    }
  }, [draftKey, post]);

  const addTag = useCallback(
    (rawValue: string) => {
      const value = rawValue.trim();
      if (!value) return;
      if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
        setTagInput("");
        return;
      }
      if (tags.length >= BLOG_TAG_LIMIT) {
        toast.error(`You can add up to ${BLOG_TAG_LIMIT} tags`);
        return;
      }
      setTags((prev) => [...prev, value]);
      setTagInput("");
    },
    [tags],
  );

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  return {
    content,
    didRestoreDraft,
    setContent,
    fields: {
      authorRole,
      categoryId,
      coverImageAlt,
      coverImageCaption,
      coverImageKey,
      coverImageUrl,
      excerpt,
      tagInput,
      tags,
      title,
    },
    isUploadingCover,
    refs: { coverImageInputRef, excerptInputRef, titleInputRef },
    resizeTextarea,
    setters: {
      addTag,
      removeTag,
      setAuthorRole,
      setCategoryId,
      setCoverImageAlt,
      setCoverImageCaption,
      setCoverImageKey,
      setCoverImageUrl,
      setExcerpt,
      setIsUploadingCover,
      setShowImageCreditEditor,
      setTagInput,
      setTitle,
    },
    showImageCreditEditor,
  };
}
