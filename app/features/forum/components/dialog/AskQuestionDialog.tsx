import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Link, useFetcher, useLocation, useRevalidator } from "react-router";
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
import CategoriesPicker from "../CategoriesPicker";
import type {
  CategoriesPicker as CategoryOption,
  Question,
} from "~/services/forum/types";
import type { ForumPostFormFieldErrors } from "~/services/forum/utils";

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
  isAuthenticated = true,
  data,
  trigger,
}: AskQuestionDialogProps) {
  const fetcher = useFetcher();
  const location = useLocation();
  const isSubmitting = fetcher.state !== "idle";
  const actionData = fetcher.data as
    | {
        data?: { ok?: boolean; question?: unknown };
        fieldErrors?: ForumPostFormFieldErrors;
        message?: string;
      }
    | undefined;
  const fieldErrors = actionData?.fieldErrors;
  const [open, setOpen] = useState(false);
  const wasSubmitting = useRef(false);
  const revalidator = useRevalidator();
  const tagsValue = data?.tags?.join(", ") ?? "";
  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

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
      } else if (hasFieldErrors) {
        toast.error(result?.message ?? "Please check the form and try again.");
      } else {
        toast.error("Failed to post question. Please try again.");
      }
    }
  }, [fetcher.state, fetcher.data, isEditing, revalidator]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#2f6fe4] px-6 py-0 text-sm font-medium whitespace-nowrap text-white hover:bg-[#245fca]">
            <Plus size={24} />
            Ask question
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] gap-4 overflow-hidden rounded-lg border border-[#e2e8f0] p-6 shadow-lg sm:max-w-130"
      >
        <DialogClose asChild>
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

        <fetcher.Form
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
            </Label>
            <Input
              name="title"
              placeholder="What are the best resources for learning Khmer business law?"
              defaultValue={data?.title ?? ""}
              aria-invalid={Boolean(fieldErrors?.title)}
              className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-red-500"
            />
            {fieldErrors?.title ? (
              <p className="text-xs text-red-600">{fieldErrors.title}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Category
            </Label>
            <CategoriesPicker
              name="categoryId"
              categories={categories}
              defaultValue={data?.category?.id}
            />
            {fieldErrors?.categoryId ? (
              <p className="text-xs text-red-600">{fieldErrors.categoryId}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Discussion Details
            </Label>
            <textarea
              name="body"
              placeholder="What are the best resources for learning Khmer business law?"
              defaultValue={data?.body ?? ""}
              aria-invalid={Boolean(fieldErrors?.body)}
              className="min-h-11 w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm text-[#344256] placeholder:text-[#9eacc0] outline-none focus:border-[#2f6fe4] aria-invalid:border-red-500"
              rows={1}
            />
            {fieldErrors?.body ? (
              <p className="text-xs text-red-600">{fieldErrors.body}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs leading-4.5 font-medium text-[#364153]">
              Tags
            </Label>
            <Input
              name="tags"
              placeholder="Separate with commas"
              defaultValue={tagsValue}
              aria-invalid={Boolean(fieldErrors?.tags)}
              className="h-11 rounded-lg border-transparent bg-[#f8fafc] text-sm text-[#344256] placeholder:text-[#9eacc0] focus-visible:border-[#2f6fe4] focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-red-500"
            />
            {fieldErrors?.tags ? (
              <p className="text-xs text-red-600">{fieldErrors.tags}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-lg border-[#e1e7ef] px-3 text-sm font-medium text-[#1d283a]"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            {isEditing ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]"
              >
                {isSubmitting ? "Updating..." : "Update question"}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]"
              >
                {isSubmitting ? "Posting..." : "Post question"}
              </Button>
            )}
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
