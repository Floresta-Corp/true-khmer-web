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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  BLOG_UNPUBLISH_REASON_LABELS,
  type BlogUnpublishReason,
} from "~/lib/blog-status";

/** The author-request reason belongs to the author's own unpublish flow. */
const MODERATOR_REASONS: BlogUnpublishReason[] = [
  "MODERATOR_DECISION",
  "POLICY_VIOLATION",
  "OUTDATED_CONTENT",
];

interface UnpublishBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: { reason: BlogUnpublishReason; note: string }) => void;
}

export function UnpublishBlogDialog({
  isOpen,
  onClose,
  onConfirm,
}: UnpublishBlogDialogProps) {
  const [reason, setReason] =
    useState<BlogUnpublishReason>("MODERATOR_DECISION");
  const [note, setNote] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-md dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-800">
        <DialogHeader>
          <DialogTitle className="text-amber-600 dark:text-amber-400">
            Unpublish blog
          </DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            The blog leaves the public site. The author can edit it and submit
            it for review again.
          </DialogDescription>
        </DialogHeader>

        <Select
          value={reason}
          onValueChange={(value) => setReason(value as BlogUnpublishReason)}
        >
          <SelectTrigger className="h-10 border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <SelectValue placeholder="Reason" />
          </SelectTrigger>
          <SelectContent>
            {MODERATOR_REASONS.map((option) => (
              <SelectItem key={option} value={option}>
                {BLOG_UNPUBLISH_REASON_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          value={note}
          maxLength={1000}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add a note for the author (optional)"
          className="min-h-24 resize-none border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <DialogFooter className="dark:border-slate-800 dark:bg-slate-900/70">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onConfirm({ reason, note: note.trim() })}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            Unpublish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
