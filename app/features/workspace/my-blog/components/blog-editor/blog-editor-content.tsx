import { EditorContent } from "@tiptap/react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { BlogEditorState } from "./use-blog-editor";

export function BlogEditorContent({
  editor,
  embedded = false,
  isClient,
  isUploading,
  className = "",
}: BlogEditorState & { embedded?: boolean; className?: string }) {
  if (!isClient || !editor) {
    return (
      <div className="flex min-h-[220px] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading editor...
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative w-full overflow-visible",
        embedded ? "bg-transparent" : "bg-background",
        className,
      )}
    >
      <EditorContent editor={editor} />
      {embedded ? null : (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {isUploading
              ? "Uploading image..."
              : "Body content is saved as rich text HTML."}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => editor.commands.clearContent()}
          >
            Clear Content
          </Button>
        </div>
      )}
    </div>
  );
}
