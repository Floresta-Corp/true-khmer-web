import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getFilesFromTransfer,
  getImageUrlFromTransfer,
  isLoadableImageUrl,
} from "~/lib/image-transfer";

type Options = {
  /** Called with dropped/pasted files. The caller validates and uploads them. */
  onFiles: (files: File[]) => void;
  /**
   * Called with a dropped/pasted image link once it has loaded as an image.
   * The link is already hosted, so it should be stored as-is — never sent to
   * the upload API. Omit it where only files are accepted.
   */
  onUrl?: (url: string) => void;
  disabled?: boolean;
};

const FILE_TYPES = ["Files"];
const FILE_OR_LINK_TYPES = ["Files", "text/uri-list", "text/html"];

function isEditable(element: Element | null) {
  if (!element) return false;
  if (element instanceof HTMLElement && element.isContentEditable) return true;
  if (element instanceof HTMLTextAreaElement) return true;
  return (
    element instanceof HTMLInputElement &&
    !["button", "checkbox", "file", "radio", "submit"].includes(element.type)
  );
}

/**
 * Drag-and-drop and paste support for an image uploader.
 *
 * Spread `dropZoneProps` and attach `ref` to the uploader's drop area. Paste
 * works while the area is focused or hovered (so Ctrl/⌘+V over it is enough),
 * unless the user is typing in a text field elsewhere.
 *
 * When a payload carries both a link and a file — e.g. "Copy image" in a
 * browser — the link wins so nothing is uploaded; the file is only used if the
 * link fails to load.
 */
export function useImageDropPaste<T extends HTMLElement = HTMLElement>({
  onFiles,
  onUrl,
  disabled = false,
}: Options) {
  const ref = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);

  const latest = useRef({ onFiles, onUrl, disabled });
  useEffect(() => {
    latest.current = { onFiles, onUrl, disabled };
  });

  /**
   * Reads the payload synchronously (a DataTransfer is emptied once the event
   * returns) and reports whether it held anything usable.
   */
  const handleTransfer = useCallback((data: DataTransfer) => {
    const { onFiles, onUrl } = latest.current;
    const url = onUrl ? getImageUrlFromTransfer(data) : null;
    const files = getFilesFromTransfer(data);

    if (url && onUrl) {
      setIsResolvingUrl(true);
      void isLoadableImageUrl(url).then((ok) => {
        setIsResolvingUrl(false);
        if (ok) onUrl(url);
        else if (files.length > 0) onFiles(files);
        else toast.error("That link doesn't point to an image we can load.");
      });
      return true;
    }

    if (files.length > 0) {
      onFiles(files);
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const zone = ref.current;
      if (
        !zone ||
        event.defaultPrevented ||
        !event.clipboardData ||
        latest.current.disabled
      ) {
        return;
      }

      const active = document.activeElement;
      const focusedInside = active !== null && zone.contains(active);
      if (isEditable(active)) return;
      if (!focusedInside && !zone.matches(":hover")) return;

      if (handleTransfer(event.clipboardData)) event.preventDefault();
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handleTransfer]);

  // Without a link handler only file drags are taken, so dragging a link
  // over a document uploader doesn't light it up for nothing.
  const acceptsDrag = (event: React.DragEvent) => {
    if (latest.current.disabled) return false;
    const types = latest.current.onUrl ? FILE_OR_LINK_TYPES : FILE_TYPES;
    return event.dataTransfer.types.some((type) => types.includes(type));
  };

  const dropZoneProps = {
    onDragEnter: (event: React.DragEvent) => {
      if (!acceptsDrag(event)) return;
      event.preventDefault();
      setIsDragging(true);
    },
    onDragOver: (event: React.DragEvent) => {
      if (!acceptsDrag(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      setIsDragging(true);
    },
    onDragLeave: (event: React.DragEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      setIsDragging(false);
    },
    onDrop: (event: React.DragEvent) => {
      setIsDragging(false);
      if (!acceptsDrag(event)) return;
      event.preventDefault();
      handleTransfer(event.dataTransfer);
    },
  };

  return { ref, isDragging, isResolvingUrl, dropZoneProps };
}

/**
 * Drag-and-drop and paste for non-image uploaders (PDFs, documents): files
 * only, no links. Filter the files with `fileMatchesAccept` — dropped files
 * skip the file picker's `accept` filter.
 */
export function useFileDropPaste<T extends HTMLElement = HTMLElement>(options: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  return useImageDropPaste<T>(options);
}
