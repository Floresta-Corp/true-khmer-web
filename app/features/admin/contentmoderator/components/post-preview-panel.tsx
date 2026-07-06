import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";

interface PostPreviewPanelProps {
  open: boolean;
  sourceLink: string;
  onOpenChange: (open: boolean) => void;
}

function isPreviewableUrl(url: string) {
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  return /^https?:\/\//i.test(trimmed);
}

export function PostPreviewPanel({
  open,
  sourceLink,
  onOpenChange,
}: PostPreviewPanelProps) {
  const hasLink = sourceLink.trim() !== "";
  const previewable = isPreviewableUrl(sourceLink);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="z-90 flex h-full w-full max-w-none flex-col gap-0 overflow-visible rounded-none p-0 sm:h-[85vh] sm:max-w-2xl sm:rounded-2xl"
      >
        <DialogTitle className="sr-only">Original post preview</DialogTitle>
        <DialogDescription className="sr-only">
          Preview of the original reported post.
        </DialogDescription>

        <DialogClose
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full cursor-pointer bg-black/40 text-white transition hover:bg-black/60 sm:-top-12 sm:right-0 sm:bg-white sm:text-slate-700 sm:shadow-md sm:hover:bg-slate-100 dark:sm:bg-slate-800 dark:sm:text-slate-200 dark:sm:hover:bg-slate-700"
          aria-label="Close preview"
        >
          <XIcon className="h-5 w-5" />
        </DialogClose>

        <div className="flex flex-1 flex-col overflow-hidden rounded-none sm:rounded-2xl">
          {previewable ? (
            <iframe
              src={sourceLink}
              title="Original post preview"
              className="w-full flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="no-referrer"
            />
          ) : hasLink ? (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              This link can't be previewed here.
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
