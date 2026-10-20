import { Node as TiptapNode } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { useEditor, type Editor, type UseEditorOptions } from "@tiptap/react";
import { clsx } from "clsx";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getFilesFromTransfer,
  getImageUrlFromTransfer,
  isLoadableImageUrl,
} from "~/lib/image-transfer";
import { uploadBlogImage } from "../../lib/upload-blog-image";
import { BlogImageNode, IMAGE_WIDTH_PRESETS } from "./blog-image-node";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

/**
 * Handles an image dropped or pasted into the editor; returns whether it was
 * handled. `pos` is the drop position, or `null` for a paste.
 */
type ImageTransferHandler = (data: DataTransfer, pos: number | null) => boolean;

export interface UseBlogTextEditorOptions {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  embedded?: boolean;
  /** Frozen posts (in review, published) are shown read-only. */
  editable?: boolean;
}

export interface BlogEditorState {
  editor: Editor | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  handleInsertImage: () => void;
  isClient: boolean;
  isUploading: boolean;
}

function getEditorOptions(
  { editable, embedded, onBlur, onChange, value }: UseBlogTextEditorOptions,
  imageTransferRef: React.RefObject<ImageTransferHandler | null>,
): UseEditorOptions {
  return {
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [...HEADING_LEVELS] },
      }),
      Typography,
      TextAlign.configure({ types: ["heading", "paragraph", "blockquote"] }),
      Placeholder.configure({ placeholder: "Start writing..." }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      BlogImageNode as unknown as TiptapNode,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: clsx(
          "blog-tiptap max-w-none focus:outline-none",
          embedded ? "min-h-[240px] px-0 py-0" : "min-h-[420px] px-10 py-10",
        ),
      },
      handlePaste: (_view, event) =>
        event.clipboardData
          ? (imageTransferRef.current?.(event.clipboardData, null) ?? false)
          : false,
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer) return false;
        const pos =
          view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ??
          null;
        const handled =
          imageTransferRef.current?.(event.dataTransfer, pos) ?? false;
        if (handled) event.preventDefault();
        return handled;
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
  };
}

export function useBlogTextEditor(
  props: UseBlogTextEditorOptions,
): BlogEditorState {
  const { editable = true, embedded = false, onBlur, onChange, value } = props;
  const [isClient, setIsClient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageTransferRef = useRef<ImageTransferHandler | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor(
    getEditorOptions(
      { editable, embedded, onBlur, onChange, value },
      imageTransferRef,
    ),
  );

  useEffect(() => {
    if (!editor || editor.isEditable === editable) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  const handleInsertImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const insertImage = useCallback(
    (src: string, alt: string, pos: number | null) => {
      if (!editor) return;
      const chain = editor.chain().focus();
      if (pos !== null) chain.setTextSelection(pos);
      chain
        .setArticleImage({
          src,
          alt,
          caption: "",
          displayWidth: "content",
          width: IMAGE_WIDTH_PRESETS.content,
        })
        .run();
    },
    [editor],
  );

  const uploadAndInsert = useCallback(
    async (file: File, pos: number | null) => {
      if (!editor) return;

      setIsUploading(true);
      try {
        const uploaded = await uploadBlogImage(file);
        const src = uploaded.publicUrl ?? uploaded.imageKey;
        insertImage(src, file.name.replace(/\.[^.]+$/, ""), pos);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to upload image.",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [editor, insertImage],
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (file) await uploadAndInsert(file, null);
    },
    [uploadAndInsert],
  );

  // Image links are inserted as-is; only image files are uploaded. Plain
  // pasted text (including a bare URL) is left to the editor so links can
  // still be pasted as text — a link only becomes an image when it comes
  // with image data ("Copy image") or is dragged in.
  useEffect(() => {
    imageTransferRef.current = (data, pos) => {
      if (!editor?.isEditable) return false;

      const files = getFilesFromTransfer(data).filter((file) =>
        file.type.startsWith("image/"),
      );
      const isDrop = pos !== null;
      const url =
        files.length > 0 || isDrop ? getImageUrlFromTransfer(data) : null;

      if (url && files.length > 0) {
        insertImage(url, "", pos);
        return true;
      }

      if (url) {
        void isLoadableImageUrl(url).then((ok) => {
          if (ok) {
            insertImage(url, "", pos);
            return;
          }
          // Not an image (e.g. a dragged hyperlink): drop it in as text.
          const chain = editor.chain().focus();
          if (pos !== null) chain.setTextSelection(pos);
          chain.insertContent(url).run();
        });
        return true;
      }

      if (files.length > 0) {
        void uploadAndInsert(files[0], pos);
        return true;
      }

      return false;
    };
  }, [editor, insertImage, uploadAndInsert]);

  return {
    editor,
    fileInputRef,
    handleFileChange,
    handleInsertImage,
    isClient,
    isUploading,
  };
}
