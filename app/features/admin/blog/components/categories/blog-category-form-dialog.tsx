import type { FormEvent } from "react";
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

interface BlogCategoryFormDialogProps {
  isOpen: boolean;
  mode: "create" | "edit";
  name: string;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function BlogCategoryFormDialog({
  isOpen,
  mode,
  name,
  isSubmitting,
  onNameChange,
  onClose,
  onSubmit,
}: BlogCategoryFormDialogProps) {
  const isCreate = mode === "create";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create category" : "Edit category"}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Add a category authors can use to organize their blogs."
              : "Update the category name shown to authors and readers."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium">
              Category name
            </label>
            <Input
              id="category-name"
              name="name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={
                isCreate ? "e.g. Technology & Innovation" : undefined
              }
              autoFocus
              className="h-10"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!name.trim()}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isCreate ? "Create category" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
