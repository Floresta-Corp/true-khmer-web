import { useCallback, useEffect, useRef, useState } from "react";
import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  CircleUserRound,
  LayoutGrid,
  Loader2,
  MoreVertical,
  Tags,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import type {
  BlogCategoryWithUsageResponse,
  BlogPostResponse,
} from "~/types/api-client";
import { BlogEditorContent } from "./blog-editor/blog-editor-content";
import { BlogEditorToolbar } from "./blog-editor/blog-editor-toolbar";
import { useBlogTextEditor } from "./blog-editor/use-blog-editor";
import { uploadBlogImage } from "../lib/upload-blog-image";
import {
  BLOG_AUTOSAVE_STORAGE_PREFIX,
  BLOG_PREVIEW_STORAGE_KEY,
  BLOG_TAG_LIMIT,
  type BlogPreviewDraft,
} from "../types";

const AUTOSAVE_DEBOUNCE_MS = 900;

function hasMeaningfulContent(html: string): boolean {
  const stripped = html.replace(/<[^>]*>/g, "").trim();
  if (stripped.length >= 20) return true;
  return /<(img|iframe|video|blockquote|pre|ul|ol|h[1-6])[\s>]/i.test(html);
}

function isPublishable(input: {
  title: string;
  authorName: string;
  coverImageUrl: string;
  content: string;
}) {
  return Boolean(
    input.title.trim() &&
    input.authorName.trim() &&
    input.coverImageUrl.trim() &&
    hasMeaningfulContent(input.content),
  );
}

function getDisplayTitle(title?: string | null) {
  return title === "Untitled Draft" ? "" : title || "";
}

interface BlogFormProps {
  post?: BlogPostResponse;
  categories: BlogCategoryWithUsageResponse[];
  draftKey: string;
}

export function BlogForm({ post, categories, draftKey }: BlogFormProps) {
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData<{ ok?: boolean; message?: string }>();

  const [title, setTitle] = useState(getDisplayTitle(post?.title));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [authorName, setAuthorName] = useState(post?.authorName ?? "");
  const [authorRole, setAuthorRole] = useState(post?.authorRole ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? "");
  const placement = post?.placement ?? "HOME";
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
  const [isCoverUrlDialogOpen, setIsCoverUrlDialogOpen] = useState(false);
  const [coverUrlDraft, setCoverUrlDraft] = useState("");
  const [content, setContent] = useState(post?.content ?? "");
  const status = post?.status ?? "DRAFT";
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [autosaveLabel, setAutosaveLabel] = useState("Autosave ready");
  const isSubmitting = navigation.state === "submitting";

  const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  const excerptInputRef = useRef<HTMLTextAreaElement | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const lastAutosavePayloadRef = useRef<string | null>(null);
  const currentPostIdRef = useRef<string | undefined>(post?.id);
  const autosaveReadyRef = useRef(!!post);

  const editor = useBlogTextEditor({ value: content, onChange: setContent });

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

  useEffect(() => {
    if (actionData?.ok === true) {
      toast.success(actionData.message || "Blog saved successfully.");
    } else if (actionData?.ok === false) {
      toast.error(actionData.message || "Unable to save the blog post.");
    }
  }, [actionData]);

  // Restore an unsaved local draft (e.g. after a refresh) when creating a new post.
  useEffect(() => {
    if (post) {
      autosaveReadyRef.current = true;
      return;
    }

    const raw = window.localStorage.getItem(
      `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
    );
    if (!raw) {
      autosaveReadyRef.current = true;
      return;
    }

    try {
      const restored = JSON.parse(raw) as {
        title?: string;
        excerpt?: string;
        authorName?: string;
        authorRole?: string;
        tags?: string[];
        categoryId?: string;
        coverImageKey?: string | null;
        coverImageUrl?: string;
        coverImageAlt?: string;
        coverImageCaption?: string;
        content?: string;
      };
      if (restored.title) setTitle(restored.title);
      if (restored.excerpt) setExcerpt(restored.excerpt);
      if (restored.authorName) setAuthorName(restored.authorName);
      if (restored.authorRole) setAuthorRole(restored.authorRole);
      if (restored.tags) setTags(restored.tags);
      if (restored.categoryId) setCategoryId(restored.categoryId);
      if (restored.coverImageKey) setCoverImageKey(restored.coverImageKey);
      if (restored.coverImageUrl) setCoverImageUrl(restored.coverImageUrl);
      if (restored.coverImageAlt) setCoverImageAlt(restored.coverImageAlt);
      if (restored.coverImageCaption) {
        setCoverImageCaption(restored.coverImageCaption);
        setShowImageCreditEditor(true);
      }
      if (restored.content) setContent(restored.content);
      setAutosaveLabel("Draft restored");
    } catch {
      // Ignore malformed local draft data.
    }

    autosaveReadyRef.current = true;
  }, [draftKey]);

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

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagInput);
      return;
    }
    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function removeTag(tagToRemove: string) {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const uploaded = await uploadBlogImage(file);
      setCoverImageKey(uploaded.imageKey);
      setCoverImageUrl(uploaded.publicUrl ?? "");
      if (!coverImageAlt.trim()) {
        setCoverImageAlt(file.name.replace(/\.[^.]+$/, ""));
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload cover image.",
      );
    } finally {
      setIsUploadingCover(false);
    }
  }

  function handleOpenCoverUrlDialog() {
    setCoverUrlDraft(coverImageUrl);
    setIsCoverUrlDialogOpen(true);
  }

  function handleApplyCoverUrl() {
    const nextUrl = coverUrlDraft.trim();
    if (!nextUrl) {
      toast.error("Enter an image URL before applying.");
      return;
    }

    const isLocalUrl = nextUrl.startsWith("/");
    const isRemoteUrl = (() => {
      try {
        const parsed = new URL(nextUrl);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    })();

    if (!isLocalUrl && !isRemoteUrl) {
      toast.error("Use a full https:// URL or a local image path.");
      return;
    }

    setCoverImageKey(nextUrl);
    setCoverImageUrl(nextUrl);
    if (!coverImageAlt.trim()) {
      setCoverImageAlt("Cover image");
    }
    setIsCoverUrlDialogOpen(false);
  }

  function handleGoBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/tk-admin/blog");
  }

  function buildFormData(nextStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    const formData = new FormData();
    formData.set("title", title || "Untitled Draft");
    formData.set("excerpt", excerpt);
    formData.set("authorName", authorName);
    formData.set("authorRole", authorRole);
    formData.set("tags", JSON.stringify(tags));
    formData.set("categoryId", categoryId);
    formData.set("placement", placement);
    formData.set("coverImageKey", coverImageKey ?? "");
    formData.set("coverImageAlt", coverImageAlt);
    formData.set("coverImageCaption", coverImageCaption);
    formData.set("content", content);
    formData.set("status", nextStatus);
    return formData;
  }

  function submitForm(nextStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    submit(buildFormData(nextStatus), { method: "post" });
  }

  function handlePublishClick() {
    if (!isPublishable({ title, authorName, coverImageUrl, content })) {
      toast.error(
        "Title, author, cover image, and blog body content are required to publish.",
      );
      return;
    }
    setIsPublishConfirmOpen(true);
  }

  const handleOpenPreview = useCallback(() => {
    const draft: BlogPreviewDraft = {
      title: getDisplayTitle(title) || "Untitled Draft",
      excerpt,
      authorName,
      authorRole,
      tags,
      categoryName: categories.find((category) => category.id === categoryId)
        ?.name,
      coverImageUrl: coverImageUrl || undefined,
      coverImageAlt,
      coverImageCaption,
      content,
      previewDate: new Date().toISOString(),
      editorUrl: window.location.href,
    };
    window.localStorage.setItem(
      BLOG_PREVIEW_STORAGE_KEY,
      JSON.stringify(draft),
    );
    window.open("/tk-admin/blog/preview", "_blank");
  }, [
    authorName,
    authorRole,
    categories,
    categoryId,
    content,
    coverImageAlt,
    coverImageCaption,
    coverImageUrl,
    excerpt,
    tags,
    title,
  ]);

  // Local draft persistence + server autosave for drafts.
  useEffect(() => {
    if (post && post.status !== "DRAFT") return;
    if (!autosaveReadyRef.current) return;

    setAutosaveLabel("Saving draft...");

    const timeout = window.setTimeout(async () => {
      const payload = {
        title,
        excerpt,
        authorName,
        authorRole,
        tags,
        categoryId,
        coverImageKey,
        coverImageUrl,
        coverImageAlt,
        coverImageCaption,
        content,
      };
      const serialized = JSON.stringify(payload);
      window.localStorage.setItem(
        `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
        serialized,
      );

      const hasMeaningfulDraft = Boolean(
        title.trim() ||
        excerpt.trim() ||
        content.trim() ||
        coverImageUrl.trim(),
      );

      if (!currentPostIdRef.current && !hasMeaningfulDraft) {
        setAutosaveLabel("Autosave ready");
        return;
      }

      if (serialized === lastAutosavePayloadRef.current) return;
      lastAutosavePayloadRef.current = serialized;

      try {
        const formData = buildFormData("DRAFT");
        if (currentPostIdRef.current) {
          formData.set("postId", currentPostIdRef.current);
        }

        const response = await fetch("/api/moderator/blog/autosave", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (!response.ok || !result?.ok) {
          throw new Error(result?.error || "Autosave failed");
        }

        if (result.postId && !currentPostIdRef.current) {
          currentPostIdRef.current = String(result.postId);
        }

        const savedAt = result.updatedAt
          ? new Date(String(result.updatedAt))
          : new Date();
        setAutosaveLabel(`Saved ${savedAt.toLocaleTimeString()}`);

        if (result.redirectTo && !post?.id) {
          window.localStorage.removeItem(
            `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
          );
          navigate(String(result.redirectTo), { replace: true });
        }
      } catch (error) {
        setAutosaveLabel("Saved locally");
        console.error("Blog autosave fell back to local storage", error);
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [
    authorName,
    authorRole,
    categoryId,
    content,
    coverImageAlt,
    coverImageCaption,
    coverImageKey,
    coverImageUrl,
    draftKey,
    excerpt,
    navigate,
    post,
    tags,
    title,
  ]);

  const primaryAction =
    status === "PUBLISHED"
      ? { label: "Save Changes", onClick: () => submitForm("PUBLISHED") }
      : status === "ARCHIVED"
        ? { label: "Restore Draft", onClick: () => submitForm("DRAFT") }
        : { label: "Publish", onClick: handlePublishClick };

  const statusLabel =
    status === "PUBLISHED"
      ? "Published"
      : status === "ARCHIVED"
        ? "Archived"
        : "Draft";

  const statusStyle =
    status === "PUBLISHED"
      ? {
          badge:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
          dot: "bg-emerald-500",
        }
      : status === "ARCHIVED"
        ? {
            badge:
              "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
            dot: "bg-rose-500",
          }
        : {
            badge:
              "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
            dot: "bg-sky-500",
          };

  return (
    <div className="mx-auto max-w-[1180px] space-y-8 px-0 pt-0 pb-20 text-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={handleGoBack}
            className="rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>

          <div
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-bold tracking-widest uppercase ${statusStyle.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {statusLabel}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {autosaveLabel}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenPreview}
            className="h-10 border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Preview
          </Button>
          {status === "PUBLISHED" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => submitForm("ARCHIVED")}
              disabled={isSubmitting}
              className="h-10 border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Unpublish
            </Button>
          ) : null}
          <Button
            type="button"
            onClick={primaryAction.onClick}
            disabled={isSubmitting}
            className="h-10 bg-blue-600 px-6 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {primaryAction.label}
          </Button>
        </div>
      </div>

      <BlogEditorToolbar {...editor} />

      <div className="mx-auto max-w-[1140px] rounded-2xl border border-slate-100 bg-white px-6 pb-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <input
          ref={coverImageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleCoverUpload}
          className="hidden"
        />

        <div className="space-y-10 pt-4">
          <div className="mx-auto max-w-[1120px] space-y-4">
            {coverImageUrl ? (
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-950/60">
                <img
                  src={coverImageUrl}
                  alt={title || "Blog cover"}
                  className="max-h-[520px] w-full object-cover"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-lg"
                      className="absolute top-4 right-4 rounded-full bg-white/92 text-[#181818] shadow-sm hover:bg-white"
                      aria-label="Open image options"
                    >
                      <MoreVertical className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onSelect={() => coverImageInputRef.current?.click()}
                    >
                      Change image
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleOpenCoverUrlDialog}>
                      Change by URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setShowImageCreditEditor(true)}
                    >
                      {coverImageCaption
                        ? "Edit image credit"
                        : "Add image credit"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => {
                        setCoverImageKey(null);
                        setCoverImageUrl("");
                        setCoverImageCaption("");
                        setShowImageCreditEditor(false);
                      }}
                    >
                      Remove image
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex min-h-[440px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950/50">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-slate-400 dark:text-slate-500">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-9 w-9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2.5" />
                    <path d="m7.5 14 2.8-2.8a1.5 1.5 0 0 1 2.1 0L16.5 15" />
                    <path d="m14 13 1-1a1.5 1.5 0 0 1 2.1 0l2.4 2.4" />
                    <circle cx="9" cy="9" r="1.2" />
                  </svg>
                </div>
                <p className="text-[16px] font-medium text-slate-700 dark:text-slate-300">
                  {isUploadingCover
                    ? "Uploading cover image..."
                    : "Add a cover photo"}
                </p>
                <p className="mt-3 text-[14px] text-slate-500 dark:text-slate-400">
                  Will be cropped to a 3:2 aspect ratio
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => coverImageInputRef.current?.click()}
                    className="h-12 rounded-[14px] border-slate-200 bg-white px-6 text-base text-slate-700 shadow-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenCoverUrlDialog}
                    className="h-12 rounded-[14px] border-slate-200 bg-white px-6 text-base text-slate-700 shadow-none hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    URL
                  </Button>
                </div>
              </div>
            )}

            {showImageCreditEditor || coverImageCaption ? (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Image credit
                </p>
                <Input
                  type="text"
                  value={coverImageCaption}
                  onChange={(event) => setCoverImageCaption(event.target.value)}
                  className="mt-1 border-0 bg-transparent px-0 text-sm text-slate-500 italic shadow-none focus-visible:ring-0 dark:bg-transparent dark:text-slate-400"
                  placeholder="Photo by / Source"
                />
              </div>
            ) : null}
          </div>

          <Dialog
            open={isCoverUrlDialogOpen}
            onOpenChange={setIsCoverUrlDialogOpen}
          >
            <DialogContent className="max-w-[520px] rounded-[24px] p-6">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Add cover image URL
                </DialogTitle>
                <DialogDescription>
                  Paste a direct image link or a local image path.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <label
                  htmlFor="cover-image-url"
                  className="text-sm font-semibold text-foreground"
                >
                  Image URL
                </label>
                <Input
                  id="cover-image-url"
                  type="text"
                  value={coverUrlDraft}
                  onChange={(event) => setCoverUrlDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleApplyCoverUrl();
                    }
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setIsCoverUrlDialogOpen(false);
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="min-h-12 rounded-xl px-4 text-base"
                  autoFocus
                />
              </div>
              <DialogFooter className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCoverUrlDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleApplyCoverUrl}>
                  Apply URL
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="mx-auto max-w-[760px] space-y-5">
            <div className="space-y-5">
              <Textarea
                ref={titleInputRef}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  resizeTextarea(event.currentTarget);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" || event.shiftKey) return;
                  event.preventDefault();
                  excerptInputRef.current?.focus();
                }}
                rows={1}
                className="blog-compose-title min-h-0 w-full resize-none border-0 bg-transparent px-0 text-slate-950 outline-none placeholder:text-slate-400 focus:outline-none dark:bg-transparent dark:text-white dark:placeholder:text-slate-500"
                placeholder="Title"
              />
              <Textarea
                ref={excerptInputRef}
                value={excerpt}
                onChange={(event) => {
                  setExcerpt(event.target.value);
                  resizeTextarea(event.currentTarget);
                }}
                rows={1}
                className="blog-compose-subtitle min-h-0 w-full resize-none border-0 bg-transparent px-0 text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none dark:bg-transparent dark:text-slate-300 dark:placeholder:text-slate-500"
                placeholder="Add a subtitle..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex min-h-11 max-w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                <CircleUserRound className="h-4.5 w-4.5 shrink-0 text-slate-400" />
                <Input
                  type="text"
                  value={authorName}
                  onChange={(event) => setAuthorName(event.target.value)}
                  className="h-auto border-0 bg-transparent px-0 text-sm text-slate-700 shadow-none focus-visible:ring-0 dark:bg-transparent dark:text-slate-300"
                  placeholder="Author's Name"
                />
              </div>
              <div className="flex h-11 min-w-[220px] items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <span className="inline-flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-(--blog-primary)/15 text-(--blog-primary)">
                  <LayoutGrid className="h-3.5 w-3.5" />
                </span>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-auto min-w-0 border-0 bg-transparent px-0 text-blue-800 shadow-none focus:ring-0 dark:bg-transparent dark:text-blue-300">
                    <SelectValue
                      placeholder={
                        categories.length > 0
                          ? "Select category"
                          : "No categories yet"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex min-h-11 basis-full flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 xl:min-w-[220px] xl:flex-1 xl:basis-auto dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                <span className="inline-flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                  <Tags className="h-3.5 w-3.5" />
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-amber-200 bg-amber-100 px-3 text-sm font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/40 dark:text-amber-200"
                  >
                    {tag}
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => removeTag(tag)}
                      className="size-4 rounded-full hover:bg-amber-500/20"
                      aria-label={`Remove ${tag} tag`}
                    >
                      x
                    </Button>
                  </span>
                ))}
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => tagInput.trim() && addTag(tagInput)}
                  className="h-auto min-w-[120px] flex-1 border-0 bg-transparent px-0 text-sm leading-none text-amber-800 shadow-none focus-visible:ring-0 dark:bg-transparent dark:text-amber-300"
                  placeholder={
                    tags.length >= BLOG_TAG_LIMIT
                      ? "Maximum 5 tags"
                      : "Add a tag"
                  }
                  disabled={tags.length >= BLOG_TAG_LIMIT}
                />
              </div>
            </div>

            <div className="pt-2">
              <BlogEditorContent embedded className="pb-20" {...editor} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isPublishConfirmOpen}
        onClose={() => setIsPublishConfirmOpen(false)}
        onConfirm={() => {
          setIsPublishConfirmOpen(false);
          submitForm("PUBLISHED");
        }}
        title="Publish Blog"
        message="Publish this blog now? It will become visible on the public website."
        confirmText="Publish"
        cancelText="Cancel"
      />
    </div>
  );
}
