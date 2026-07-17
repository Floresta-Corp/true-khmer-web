import {
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Link, useFetcher, useLocation, useRevalidator } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import CategoriesPicker from "../categories-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateForumQuestionInputSchema,
  type CreateForumQuestionInput,
  type CategoriesPicker as CategoryOption,
} from "~/features/forum/types";
import type { QuestionResponse } from "~/types/api-client";
import type { ForumPostFormFieldErrors } from "~/features/forum/services/forum.validation";
import { Textarea } from "~/components/ui/textarea";
import { resolveImageURL } from "~/lib/utils";

interface AskQuestionDialogProps {
  categories: CategoryOption[];
  isEditing?: boolean;
  isAuthenticated?: boolean;
  data?: QuestionResponse | null;
  trigger?: React.ReactNode;
}

export default function AskQuestionDialog({
  categories,
  isEditing,
  isAuthenticated = false,
  data,
  trigger,
}: AskQuestionDialogProps) {
  const location = useLocation();
  const revalidator = useRevalidator();

  const form = useForm<CreateForumQuestionInput>({
    resolver: zodResolver(CreateForumQuestionInputSchema),
    defaultValues: {
      title: data?.title ?? "",
      body: data?.body ?? "",
      categoryId: data?.category?.id ?? categories[0]?.id ?? "",
      tags: data?.tags?.map((t) => t.name).filter(Boolean) ?? [],
      status: "PUBLISHED",
      imageKey: data?.imageKey ?? null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const watchedTitle = watch("title");
  const watchedBody = watch("body");
  const watchedCategoryId = watch("categoryId");
  const hasRequiredInput = Boolean(
    watchedTitle?.trim() && watchedBody?.trim() && watchedCategoryId,
  );
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    () => data?.tags?.map((tag) => tag.name).filter(Boolean) ?? [],
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImageKey, setExistingImageKey] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const wasSubmitting = useRef(false);
  // const [searchParams, setSearchParams] = useSearchParams();
  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  const submittedTags = useMemo(() => {
    const typed = tagInput.trim();
    const combined = typed ? [...tags, typed] : tags;
    // Ensure we never submit more than 5 tags
    return combined.slice(0, 5).filter(Boolean);
  }, [tags, tagInput]);

  // Keep react-hook-form tags in sync with local tags state
  useEffect(() => {
    setValue("tags", submittedTags);
  }, [submittedTags, setValue]);

  const fetcher = useFetcher();
  const isBusy = fetcher.state !== "idle" || isSubmitting;
  const fetcherReady = useRef(false);

  const onSubmit = (values: CreateForumQuestionInput) => {
    const fd = new FormData();
    if (isEditing) {
      fd.append("questionId", String(data?.id ?? ""));
    }
    fd.append("status", values.status);
    fd.append("categoryId", values.categoryId);
    fd.append("title", values.title);
    fd.append("body", values.body);
    (values.tags ?? []).forEach((tag) => fd.append("tags", tag));

    if (removeExistingImage) {
      fd.append("removeImage", "true");
    } else if (existingImageKey && !selectedFile) {
      fd.append("imageKey", existingImageKey);
    }

    if (selectedFile) {
      fd.append("image", selectedFile);
    }

    fetcher.submit(fd, {
      method: isEditing ? "PATCH" : "POST",
      encType: "multipart/form-data",
    });
  };

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
    }
    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;
      const result = fetcher.data as any;
      const isSuccess =
        result?.ok === true ||
        result?.data?.ok === true ||
        result?.question != null ||
        result?.data?.question != null;
      const hasFieldErrors =
        result?.fieldErrors &&
        Object.values(result.fieldErrors).some((value) => Boolean(value));

      if (isSuccess) {
        setOpen(false);
        revalidator.revalidate();
        toast.success(
          result?.message ??
            (isEditing
              ? "Question updated successfully!"
              : "Question posted successfully!"),
        );
        reset();
        if (preview && !existingImageKey) {
          URL.revokeObjectURL(preview);
        }
        setPreview(null);
        setSelectedFile(null);
        setExistingImageKey(null);
        setRemoveExistingImage(false);
      } else if (hasFieldErrors) {
        Object.entries(result.fieldErrors || {}).forEach(([key, value]) => {
          setError(key as any, { type: "server", message: String(value) });
        });
        toast.error(result?.message ?? "Please check the form and try again.");
      } else {
        toast.error(
          result?.message ?? "Failed to post question. Please try again.",
        );
      }
    }
  }, [
    fetcher.state,
    fetcher.data,
    isEditing,
    revalidator,
    reset,
    setError,
    preview,
    existingImageKey,
  ]);

  useEffect(() => {
    if (open) {
      reset({
        title: data?.title ?? "",
        body: data?.body ?? "",
        categoryId: data?.category?.id ?? categories[0]?.id ?? "",
        tags: data?.tags?.map((t) => t.name).filter(Boolean) ?? [],
        status: "PUBLISHED",
        imageKey: data?.imageKey ?? null,
      });
      setTags(data?.tags?.map((tag) => tag.name).filter(Boolean) ?? []);
      setTagInput("");
      // reset file selection and previews when opening
      setSelectedFile(null);
      setRemoveExistingImage(false);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      // set existing image preview when editing
      if (isEditing && data?.imageKey) {
        setExistingImageKey(data.imageKey);
        setPreview(resolveImageURL(data.imageKey));
      } else {
        setExistingImageKey(null);
      }
    }
  }, [data, open, isEditing, reset, categories]);

  useEffect(() => {
    return () => {
      if (preview && !existingImageKey) URL.revokeObjectURL(preview);
    };
  }, [preview, existingImageKey]);

  const addTag = (rawValue: string) => {
    const nextTag = rawValue.trim();

    if (!nextTag) {
      return;
    }

    // Prevent adding more than 5 tags
    if (tags.length >= 5) {
      toast.error("You can add up to 5 tags only.");
      return;
    }

    setTags((currentTags) => {
      if (
        currentTags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())
      ) {
        return currentTags;
      }

      return [...currentTags, nextTag];
    });
    setTagInput("");
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag(tagInput);
      return;
    }

    if (event.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((currentTags) => currentTags.slice(0, -1));
    }
  };

  if (!isAuthenticated && !isEditing) {
    if (trigger) {
      return <Link to={loginHref}>{trigger}</Link>;
    }

    return (
      <Link
        to={loginHref}
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca] sm:w-auto"
      >
        <Plus size={24} />
        Ask question
      </Link>
    );
  }

  // use fetcher.submit for server actions

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={"default"}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca] sm:w-auto"
          >
            <Plus size={24} />
            Ask question
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
        className="flex max-h-[90dvh] max-w-[calc(100%-1rem)] flex-col gap-4 overflow-hidden rounded-2xl border border-[#e2e8f0] p-4 shadow-lg sm:max-h-[90vh] sm:max-w-130 sm:p-6"
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3.75 right-3.75 h-7 w-7 rounded-sm p-0 text-[#364153]/70 hover:bg-transparent hover:text-[#364153] sm:h-6 sm:w-6"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <div className="flex shrink-0 flex-col gap-1.5">
          <DialogTitle className="text-lg leading-7 font-semibold text-[#0f1729]">
            {isEditing ? "Edit question" : "Ask question"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal text-[#6a7282]">
            Share knowledge with the community
          </DialogDescription>
        </div>

        <div className="-mx-4 shrink-0 border-t border-[#e2e8f0] sm:-mx-6" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          key={data?.id ?? "create-question"}
          className="flex min-h-0 flex-1 flex-col gap-2"
          method={isEditing ? "patch" : "post"}
        >
          <input type="hidden" name="status" value="PUBLISHED" />
          {isEditing ? (
            <input type="hidden" name="questionId" value={data?.id ?? ""} />
          ) : null}
          <div className="scrollbar-hide -mx-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 sm:-mx-6 sm:px-6">
            <div className="flex flex-col gap-2">
              <Label className="text-xs leading-4.5 font-medium text-[#364153]">
                Question title
                <span className="ml-1 text-red-600">*</span>
              </Label>
              <Input
                {...register("title")}
                placeholder="What are the best resources for learning Khmer business law?"
                aria-invalid={Boolean(errors.title)}
                className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-red-500"
              />
              {errors.title ? (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs leading-4.5 font-medium text-[#364153]">
                Category
                <span className="ml-1 text-red-600">*</span>
              </Label>
              <CategoriesPicker
                name="categoryId"
                categories={categories}
                defaultValue={data?.category?.id}
                required
                onChange={(c) => setValue("categoryId", c.id)}
              />
              {errors.categoryId ? (
                <p className="text-xs text-red-600">
                  {errors.categoryId.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs leading-4.5 font-medium text-[#364153]">
                Discussion Details
                <span className="ml-1 text-red-600">*</span>
              </Label>
              <Textarea
                {...register("body")}
                placeholder="What are the best resources for learning Khmer business law?"
                aria-invalid={Boolean(errors.body)}
                className="h-30 max-w-full overflow-x-auto rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm text-wrap text-[#344256] outline-none placeholder:text-[#9eacc0] focus:border-[#2f6fe4] aria-invalid:border-red-500"
                rows={1}
              />
              {errors.body ? (
                <p className="text-xs text-red-600">{errors.body.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs leading-4.5 font-medium text-[#364153]">
                Add Media (Photo/Video)
              </Label>
              {preview ? (
                <div className="mt-2 flex gap-2">
                  <div className="group relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-[#d1d5db] bg-transparent focus-within:border-[#2f6fe4] hover:border-[#2f6fe4] sm:w-56">
                    <img
                      src={preview}
                      alt={existingImageKey ? "existing image" : "preview"}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (existingImageKey) {
                          setRemoveExistingImage(true);
                          setExistingImageKey(null);
                        }
                        if (preview && !existingImageKey) {
                          URL.revokeObjectURL(preview);
                        }
                        setSelectedFile(null);
                        setPreview(null);
                      }}
                      className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[#64748b] hover:bg-white"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="images-upload"
                  className="group flex aspect-video w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#d1d5db] bg-transparent px-4 text-center focus-within:border-[#2f6fe4] hover:border-[#2f6fe4] sm:w-56"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2f6fe4] shadow-sm">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-[#9eacc0]">
                      ADD MEDIA
                    </span>
                  </div>
                  <input
                    id="images-upload"
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (preview && !existingImageKey) {
                        URL.revokeObjectURL(preview);
                      }
                      setSelectedFile(file);
                      setPreview(file ? URL.createObjectURL(file) : null);
                      setRemoveExistingImage(false);
                    }}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs leading-4.5 font-medium text-[#364153]">
                Tags
              </Label>

              <input type="hidden" {...register("tags")} />
              <Input
                placeholder={
                  tags.length >= 5
                    ? "Maximum 5 tags added"
                    : "Type a tag and press Enter"
                }
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                aria-invalid={Boolean(errors.tags)}
                disabled={tags.length >= 5}
                className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-red-500"
              />
              {errors.tags ? (
                <p className="text-xs text-red-600">{errors.tags.message}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  {Math.max(0, 5 - tags.length)} tag
                  {Math.max(0, 5 - tags.length) === 1 ? "" : "s"} left
                </p>
              )}
            </div>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="inline-flex rounded-md bg-[#edf2f7] px-2.5 py-1 text-xs font-medium text-[#344256]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setTags((currentTags) =>
                          currentTags.filter(
                            (currentTag) => currentTag !== tag,
                          ),
                        )
                      }
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[#64748b] hover:bg-[#d6deea] hover:text-[#0f1729]"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3.5 pt-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="min-h-9 w-full flex-1 shrink-0 rounded-lg border-[#e1e7ef] px-3 text-sm font-medium text-[#1d283a] sm:h-9 sm:min-h-0 sm:w-auto sm:flex-none"
                disabled={isBusy}
              >
                Cancel
              </Button>
            </DialogClose>
            {isEditing ? (
              <Button
                type="submit"
                disabled={isBusy || !hasRequiredInput}
                className="min-h-10 w-full flex-1 shrink-0 rounded-lg border-[#D1D9E6] text-sm font-medium text-[#344256] sm:h-9 sm:min-h-0 sm:w-auto sm:flex-none"
              >
                {isBusy ? "Updating..." : "Update question"}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isBusy || !hasRequiredInput}
                className="min-h-10 w-full flex-1 shrink-0 rounded-lg bg-[#2F6FE4] text-sm font-medium text-white hover:bg-[#1F62DF] sm:h-9 sm:min-h-0 sm:w-auto sm:flex-none"
              >
                {isBusy ? "Posting..." : "Post question"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
