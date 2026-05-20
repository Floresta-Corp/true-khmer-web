import {
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
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
} from "~/services/forum/types/question-type";
import type {
  CategoriesPicker as CategoryOption,
  Question,
} from "~/services/forum/forum-types";
import type { ForumPostFormFieldErrors } from "~/services/forum/validation";
import { Textarea } from "~/components/ui/textarea";
import { resolveImageURL } from "~/lib/utils";

interface AskQuestionDialogProps {
  categories: CategoryOption[];
  isEditing?: boolean;
  isAuthenticated?: boolean;
  data?: Question | null;
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
      categoryId: data?.category?.id ?? "",
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
    formState: { errors, isSubmitting },
  } = form;
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
  const submittedTags = (() => {
    const typed = tagInput.trim();
    const combined = typed ? [...tags, typed] : tags;
    // Ensure we never submit more than 5 tags
    return combined.slice(0, 5).filter(Boolean);
  })();

  // Keep react-hook-form tags in sync with local tags state
  useEffect(() => {
    setValue("tags", submittedTags);
  }, [submittedTags, setValue]);

  const fetcher = useFetcher();
  const isBusy = fetcher.state !== "idle" || isSubmitting;
  const fetcherReady = useRef(false);

  const onSubmit = async (values: CreateForumQuestionInput) => {
    return new Promise<void>((resolve) => {
      const fd = new FormData();
      if (isEditing) {
        fd.append("questionId", String(data?.id ?? ""));
      }
      fd.append("status", values.status);
      fd.append("categoryId", values.categoryId);
      fd.append("title", values.title);
      fd.append("body", values.body);
      (values.tags ?? []).forEach((tag) => fd.append("tags", tag));

      // handle existing image
      if (removeExistingImage) {
        fd.append("removeImage", "true");
      } else if (existingImageKey && !selectedFile) {
        fd.append("imageKey", existingImageKey);
      }

      // handle new uploaded file
      if (selectedFile) {
        fd.append("image", selectedFile);
      }

      const method = isEditing ? "PATCH" : "POST";
      fetcherReady.current = true;
      fetcher.submit(fd, {
        method,
        encType: "multipart/form-data",
      });

      // Resolve when fetcher returns to idle
      const checkIdle = () => {
        if (fetcher.state === "idle" && fetcherReady.current) {
          fetcherReady.current = false;
          resolve();
        } else {
          requestAnimationFrame(checkIdle);
        }
      };
      requestAnimationFrame(checkIdle);
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
        result?.data?.ok === true || result?.data?.question != null;
      const hasFieldErrors =
        result?.fieldErrors &&
        Object.values(result.fieldErrors).some((value) => Boolean(value));

      if (isSuccess) {
        setOpen(false);
        revalidator.revalidate();
        toast.success(
          isEditing
            ? "Question updated successfully!"
            : "Question posted successfully!",
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
  ]);

  useEffect(() => {
    if (open) {
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
  }, [data?.id, open, isEditing]);

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
        className="flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca]"
      >
        <Plus size={24} />
        Ask question
      </Link>
    );
  }

  // use fetcher.submit for server actions

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button
            variant={"default"}
            className="flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca]"
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
        className="max-w-[calc(100%-1rem)] gap-4 overflow-hidden rounded-2xl border border-[#e2e8f0] p-6 shadow-lg sm:max-w-130"
      >
        <DialogClose>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3.75 right-3.75 h-4 w-4 rounded-sm p-0 text-[#364153]/70 hover:bg-transparent hover:text-[#364153]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-lg leading-7 font-semibold text-[#0f1729]">
            {isEditing ? "Edit question" : "Ask question"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-5 font-normal text-[#6a7282]">
            Share knowledge with the community
          </DialogDescription>
        </div>

        <div className="-mx-6 border-t border-[#e2e8f0]" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          key={data?.id ?? "create-question"}
          className="flex flex-col gap-2"
          method={isEditing ? "patch" : "post"}
        >
          <input type="hidden" name="status" value="PUBLISHED" />
          {isEditing ? (
            <input type="hidden" name="questionId" value={data?.id ?? ""} />
          ) : null}
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
            </Label>
            <Textarea
              {...register("body")}
              placeholder="What are the best resources for learning Khmer business law?"
              aria-invalid={Boolean(errors.body)}
              className="h-30 overflow-x-auto max-w-full text-wrap rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm text-[#344256] placeholder:text-[#9eacc0] outline-none focus:border-[#2f6fe4] aria-invalid:border-red-500"
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
                <div className="group relative w-56 aspect-video overflow-hidden rounded-lg border-2 border-dashed border-[#d1d5db] bg-transparent hover:border-[#2f6fe4] focus-within:border-[#2f6fe4]">
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
                    className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[#64748b] hover:bg-white"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="images-upload"
                className="group flex w-56 aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#d1d5db] bg-transparent px-18 text-center hover:border-[#2f6fe4] focus-within:border-[#2f6fe4]"
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
                        currentTags.filter((currentTag) => currentTag !== tag),
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

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-lg border-[#e1e7ef] px-3 text-sm font-medium text-[#1d283a]"
                disabled={isBusy}
              >
                Cancel
              </Button>
            </DialogClose>
            {isEditing ? (
              <Button
                type="submit"
                disabled={isBusy}
                className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]"
              >
                {isBusy ? "Updating..." : "Update question"}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isBusy}
                className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]"
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
