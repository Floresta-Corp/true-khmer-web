import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

interface PostPreviewPanelProps {
  open: boolean;
  sourceLink: string;
  onOpenChange: (open: boolean) => void;
}

function isPreviewableUrl(url: string) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

export function PostPreviewPanel({
  open,
  sourceLink,
  onOpenChange,
}: PostPreviewPanelProps) {
  const previewable = isPreviewableUrl(sourceLink);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[85vh] sm:max-w-3xl sm:rounded-2xl">
        <DialogTitle className="sr-only">Original post preview</DialogTitle>
        <div className="flex items-center justify-between border-b border-(--admin-border) p-3 pr-12">
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 hover:underline dark:text-blue-400"
          >
            <ExternalLink size={14} className="shrink-0" />
            Open in new tab
          </a>
        </div>
        {previewable ? (
          <iframe
            src={sourceLink}
            title="Original post preview"
            className="w-full flex-1 border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            This link can't be previewed here. Use "Open in new tab" instead.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
