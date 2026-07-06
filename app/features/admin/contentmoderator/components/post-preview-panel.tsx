import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

interface PostPreviewPanelProps {
  open: boolean;
  sourceLink: string;
  onOpenChange: (open: boolean) => void;
}

function isPreviewableUrl(url: string) {
  if (!/^[a-z][a-z\d+.-]*:/i.test(url)) return true;
  return url.startsWith("http://") || url.startsWith("https://");
}

export function PostPreviewPanel({
  open,
  sourceLink,
  onOpenChange,
}: PostPreviewPanelProps) {
  const previewable = isPreviewableUrl(sourceLink);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-90 flex h-full w-full max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[85vh] sm:max-w-2xl sm:rounded-2xl">
        <DialogTitle className="sr-only">Original post preview</DialogTitle>
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
            This link can't be previewed here.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
