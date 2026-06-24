import { useState, useEffect, useRef, type ReactNode } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";

interface ShareLaunchpadDialogProps {
  projectId: string;
  trigger: ReactNode;
}

export function ShareLaunchpadDialog({
  projectId,
  trigger,
}: ShareLaunchpadDialogProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shareUrl = buildAbsoluteUrl(`/launchpad/detail/${projectId}`);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!navigator.clipboard || !window.isSecureContext) return;

    const copied = await copyToClipboard(shareUrl, {
      successMessage: null,
      errorMessage: null,
    });
    if (!copied) return;

    setIsCopied(true);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5 text-lg font-semibold">
            <Share2 size={15} />
            Share
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[#dbe3ee] bg-[#f9fafb] px-3 py-2 text-sm text-[#595c5e]">
            <p className="min-w-0 flex-1 break-all">{shareUrl}</p>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleCopy}
              className="border-[#dbe3ee] shrink-0"
            >
              {isCopied ? (
                <Check className="size-4 text-[#19a95e]" />
              ) : (
                <Copy className="size-4 text-[#99a1af]" />
              )}
            </Button>
          </div>

          {isCopied && (
            <p className="text-sm text-[#19a95e]">Link copied to clipboard!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
