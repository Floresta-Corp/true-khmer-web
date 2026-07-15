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
import { uploadBlogImage } from "../../lib/upload-blog-image";
import { BlogImageNode, IMAGE_WIDTH_PRESETS } from "./blog-image-node";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export interface UseBlogTextEditorOptions {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  embedded?: boolean;
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

function getEditorOptions({
  embedded,
  onBlur,
  onChange,
  value,
}: UseBlogTextEditorOptions): UseEditorOptions {
  return {
    immediatelyRender: false,
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
  const { embedded = false, onBlur, onChange, value } = props;
  const [isClient, setIsClient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor(
    getEditorOptions({ embedded, onBlur, onChange, value }),
  );

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

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      if (!file || !editor) return;

      setIsUploading(true);
      try {
        const uploaded = await uploadBlogImage(file);
        const src = uploaded.publicUrl ?? uploaded.imageKey;

        editor
          .chain()
          .focus()
          .setArticleImage({
            src,
            alt: file.name.replace(/\.[^.]+$/, ""),
            caption: "",
            displayWidth: "content",
            width: IMAGE_WIDTH_PRESETS.content,
          })
          .run();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to upload image.",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [editor],
  );

  return {
    editor,
    fileInputRef,
    handleFileChange,
    handleInsertImage,
    isClient,
    isUploading,
  };
}
