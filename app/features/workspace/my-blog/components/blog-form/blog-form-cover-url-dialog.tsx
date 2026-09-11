import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

interface BlogFormCoverUrlDialogProps {
  isOpen: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
}

export function BlogFormCoverUrlDialog({
  isOpen,
  value,
  onChange,
  onClose,
  onApply,
}: BlogFormCoverUrlDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="max-w-[520px] rounded-[24px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Add cover image URL</DialogTitle>
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
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onApply();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onClose();
              }
            }}
            placeholder="https://example.com/image.jpg"
            className="min-h-12 rounded-xl px-4 text-base"
            autoFocus
          />
        </div>
        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onApply}>
            Apply URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
