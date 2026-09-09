import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

interface UnpublishMyBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

export function UnpublishMyBlogDialog({
  isOpen,
  onClose,
  onConfirm,
}: UnpublishMyBlogDialogProps) {
  const [note, setNote] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:ring-slate-800">
        <DialogHeader>
          <DialogTitle>Unpublish blog</DialogTitle>
          <DialogDescription>
            Your blog is removed from the public site. You can edit it and
            submit it for review again at any time.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={note}
          maxLength={500}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add a note for the moderators (optional)"
          className="min-h-24 resize-none"
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm(note.trim())}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            Unpublish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
