import type { Editor } from "@tiptap/react";
import { clsx } from "clsx";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Code,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { BlogEditorState } from "./use-blog-editor";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const TEXT_ALIGN_OPTIONS = ["left", "center", "right", "justify"] as const;
type TextAlignValue = (typeof TEXT_ALIGN_OPTIONS)[number];

function normalizeLinkUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ||
    /^mailto:/i.test(trimmed) ||
    /^tel:/i.test(trimmed)
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getActiveTextStyleLabel(editor: Editor | null) {
  if (!editor) return "Style";
  if (editor.isActive("paragraph")) return "Style";

  for (const level of HEADING_LEVELS) {
    if (editor.isActive("heading", { level })) {
      return `H${level}`;
    }
  }

  return "Style";
}

function getActiveTextAlign(editor: Editor | null): TextAlignValue {
  if (!editor) return "left";

  for (const type of ["paragraph", "heading", "blockquote"] as const) {
    const textAlign = editor.getAttributes(type)
      .textAlign as TextAlignValue | null;
    if (textAlign && TEXT_ALIGN_OPTIONS.includes(textAlign)) {
      return textAlign;
    }
  }

  return "left";
}

function runOnCurrentBlock(
  editor: Editor,
  command: (chain: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>,
) {
  const anchor = editor.state.selection.$anchor.pos;
  return command(
    editor.chain().focus().setTextSelection({ from: anchor, to: anchor }),
  ).run();
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
  className = "",
}: {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={clsx(
        "h-11 min-w-11 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
        active &&
          "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white",
        className,
      )}
    >
      {children}
    </Button>
  );
}

function ToolbarDivider() {
  return (
    <div className="mx-2 h-8 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
  );
}

function ToolbarMenuItem({
  label,
  onClick,
  active = false,
  leading,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  leading?: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
      className={clsx(
        "h-auto w-full justify-between gap-3 rounded-xl px-3 py-2 text-left",
        active
          ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
      )}
    >
      <span className="flex items-center gap-2">
        {leading ? (
          <span className="text-slate-400 dark:text-slate-500">{leading}</span>
        ) : null}
        <span>{label}</span>
      </span>
      {active ? <Check className="text-[var(--blog-primary)]" /> : null}
    </Button>
  );
}

function BlogToolbarInner({
  editor,
  handleInsertImage,
}: {
  editor: Editor;
  handleInsertImage: () => void;
}) {
  const [openMenu, setOpenMenu] = useState<
    null | "style" | "align" | "link" | "image"
  >(null);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkPopoverPosition, setLinkPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const activeTextStyleLabel = getActiveTextStyleLabel(editor);
  const activeTextAlign = getActiveTextAlign(editor);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const linkPopoverRef = useRef<HTMLDivElement | null>(null);
  const linkTextInputRef = useRef<HTMLInputElement | null>(null);
  const imageUrlInputRef = useRef<HTMLInputElement | null>(null);

  const selection = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(
    selection.from,
    selection.to,
    " ",
  );

  useEffect(() => {
    if (openMenu !== "link") return;

    const currentLinkUrl = String(editor.getAttributes("link").href || "");
    setLinkUrl(currentLinkUrl);
    setLinkText(selectedText || "");

    const updatePopoverPosition = () => {
      const selectionFrom = editor.state.selection.from;
      const selectionTo = editor.state.selection.to;
      const start = editor.view.coordsAtPos(selectionFrom);
      const end = editor.view.coordsAtPos(selectionTo);
      const popoverWidth = 320;
      const viewportPadding = 16;
      const desiredLeft =
        selectionFrom === selectionTo
          ? start.left
          : start.left + (end.right - start.left) / 2;
      const left = Math.min(
        Math.max(desiredLeft - popoverWidth / 2, viewportPadding),
        window.innerWidth - popoverWidth - viewportPadding,
      );
      const top = Math.min(start.bottom + 14, window.innerHeight - 220);

      setLinkPopoverPosition({ top, left });
    };

    updatePopoverPosition();
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);

    window.setTimeout(() => {
      linkTextInputRef.current?.focus();
      linkTextInputRef.current?.select();
    }, 0);

    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition, true);
    };
  }, [editor, openMenu, selectedText]);

  useEffect(() => {
    if (openMenu !== "image") return;

    window.setTimeout(() => {
      imageUrlInputRef.current?.focus();
      imageUrlInputRef.current?.select();
    }, 0);
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !toolbarRef.current?.contains(event.target as globalThis.Node) &&
        !linkPopoverRef.current?.contains(event.target as globalThis.Node)
      ) {
        setOpenMenu(null);
        setLinkPopoverPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const handleSubmitLink = useCallback(() => {
    const normalizedUrl = normalizeLinkUrl(linkUrl);
    const normalizedText = linkText.trim();

    if (!normalizedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setOpenMenu(null);
      setLinkPopoverPosition(null);
      return;
    }

    const textToInsert = normalizedText || selectedText || normalizedUrl;
    const { from, to, empty } = editor.state.selection;

    if (!empty) {
      editor
        .chain()
        .focus()
        .insertContentAt(
          { from, to },
          {
            type: "text",
            text: textToInsert,
            marks: [{ type: "link", attrs: { href: normalizedUrl } }],
          },
        )
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: textToInsert,
          marks: [{ type: "link", attrs: { href: normalizedUrl } }],
        })
        .run();
    }

    setOpenMenu(null);
    setLinkPopoverPosition(null);
  }, [editor, linkText, linkUrl, selectedText]);

  const handleSubmitImageUrl = useCallback(() => {
    const normalizedUrl = normalizeLinkUrl(imageUrl);
    if (!normalizedUrl) {
      setOpenMenu(null);
      return;
    }

    editor
      .chain()
      .focus()
      .setArticleImage({
        src: normalizedUrl,
        alt: "",
        caption: "",
        displayWidth: "content",
        width: "72%",
      })
      .run();

    setImageUrl("");
    setOpenMenu(null);
  }, [editor, imageUrl]);

  return (
    <div
      ref={toolbarRef}
      className="mx-auto flex max-w-[1180px] items-center overflow-visible px-4 text-slate-900 lg:px-6 dark:text-slate-100"
    >
      <div className="flex w-full items-center justify-center">
        <div className="flex items-center gap-0.5 pr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() =>
              setOpenMenu((current) => (current === "style" ? null : "style"))
            }
            className={clsx(
              "h-11 min-w-[120px] gap-1.5 px-4",
              openMenu === "style"
                ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            )}
          >
            {activeTextStyleLabel}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          {openMenu === "style" ? (
            <div className="absolute top-12 left-0 z-40 mt-1 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <ToolbarMenuItem
                label="Normal text"
                active={editor.isActive("paragraph")}
                onClick={() => {
                  runOnCurrentBlock(editor, (chain) => chain.setParagraph());
                  setOpenMenu(null);
                }}
                leading={<span className="font-medium">P</span>}
              />
              {HEADING_LEVELS.map((level) => (
                <ToolbarMenuItem
                  key={level}
                  label={`Heading ${level}`}
                  active={editor.isActive("heading", { level })}
                  onClick={() => {
                    runOnCurrentBlock(editor, (chain) =>
                      chain.setHeading({ level }),
                    );
                    setOpenMenu(null);
                  }}
                  leading={<span className="font-semibold">{`H${level}`}</span>}
                />
              ))}
            </div>
          ) : null}
        </div>

        <ToolbarDivider />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="relative flex items-center gap-0.5">
          <ToolbarButton
            onClick={() =>
              setOpenMenu((current) => (current === "link" ? null : "link"))
            }
            active={editor.isActive("link") || openMenu === "link"}
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              setOpenMenu((current) => {
                if (current === "image") {
                  setImageUrl("");
                  return null;
                }
                return "image";
              })
            }
            active={openMenu === "image"}
            title="Insert image"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          {openMenu === "image" ? (
            <div className="absolute top-12 left-10 z-40 mt-1 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                Insert image
              </p>
              <div className="mt-3 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleInsertImage();
                    setOpenMenu(null);
                  }}
                  className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Upload image
                </Button>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                    Or use URL
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>
                <Input
                  ref={imageUrlInputRef}
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-10 rounded-xl border-slate-200 bg-white px-3.5 dark:border-slate-700 dark:bg-slate-950/60"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSubmitImageUrl();
                    }
                  }}
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleSubmitImageUrl}
                  className="rounded-xl bg-blue-600 px-3.5 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                >
                  Insert
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setImageUrl("");
                    setOpenMenu(null);
                  }}
                  className="rounded-xl bg-slate-100 px-3.5 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bulleted list"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() =>
              setOpenMenu((current) => (current === "align" ? null : "align"))
            }
            className={clsx(
              "h-11 min-w-[88px] gap-1.5 px-4",
              openMenu === "align"
                ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            )}
            title="Text alignment"
          >
            {activeTextAlign === "center" ? (
              <AlignCenter className="h-4 w-4" />
            ) : activeTextAlign === "right" ? (
              <AlignRight className="h-4 w-4" />
            ) : activeTextAlign === "justify" ? (
              <AlignJustify className="h-4 w-4" />
            ) : (
              <AlignLeft className="h-4 w-4" />
            )}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          {openMenu === "align" ? (
            <div className="absolute top-12 left-0 z-40 mt-1 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <ToolbarMenuItem
                label="Align left"
                active={activeTextAlign === "left"}
                onClick={() => {
                  editor.chain().focus().setTextAlign("left").run();
                  setOpenMenu(null);
                }}
                leading={<AlignLeft className="h-4 w-4" />}
              />
              <ToolbarMenuItem
                label="Align center"
                active={activeTextAlign === "center"}
                onClick={() => {
                  editor.chain().focus().setTextAlign("center").run();
                  setOpenMenu(null);
                }}
                leading={<AlignCenter className="h-4 w-4" />}
              />
              <ToolbarMenuItem
                label="Align right"
                active={activeTextAlign === "right"}
                onClick={() => {
                  editor.chain().focus().setTextAlign("right").run();
                  setOpenMenu(null);
                }}
                leading={<AlignRight className="h-4 w-4" />}
              />
              <ToolbarMenuItem
                label="Justify"
                active={activeTextAlign === "justify"}
                onClick={() => {
                  editor.chain().focus().setTextAlign("justify").run();
                  setOpenMenu(null);
                }}
                leading={<AlignJustify className="h-4 w-4" />}
              />
            </div>
          ) : null}
        </div>
      </div>
      {openMenu === "link" && linkPopoverPosition ? (
        <div
          ref={linkPopoverRef}
          className="fixed z-70 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          style={{
            top: `${linkPopoverPosition.top}px`,
            left: `${linkPopoverPosition.left}px`,
          }}
        >
          <p className="text-sm font-semibold text-slate-950 dark:text-white">
            Create a link
          </p>
          <div className="mt-3 space-y-3">
            <Input
              ref={linkTextInputRef}
              type="text"
              value={linkText}
              onChange={(event) => setLinkText(event.target.value)}
              placeholder="Enter text..."
              className="h-10 rounded-xl border-slate-200 bg-white px-3.5 dark:border-slate-700 dark:bg-slate-950/60"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmitLink();
                }
              }}
            />
            <Input
              type="url"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="Enter URL..."
              className="h-10 rounded-xl border-slate-200 bg-white px-3.5 dark:border-slate-700 dark:bg-slate-950/60"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmitLink();
                }
              }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              onClick={handleSubmitLink}
              className="rounded-xl bg-blue-600 px-3.5 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
            >
              Link
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpenMenu(null);
                setLinkPopoverPosition(null);
              }}
              className="rounded-xl bg-slate-100 px-3.5 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BlogEditorToolbar({
  editor,
  fileInputRef,
  handleFileChange,
  handleInsertImage,
  isClient,
  className = "",
}: BlogEditorState & { className?: string }) {
  return (
    <div
      className={clsx(
        "sticky top-0 z-30 rounded-2xl border border-slate-100 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="py-1.5">
        {!isClient || !editor ? (
          <div className="mx-auto h-11 max-w-[1180px] animate-pulse rounded-md bg-muted" />
        ) : (
          <BlogToolbarInner
            editor={editor}
            handleInsertImage={handleInsertImage}
          />
        )}
      </div>
    </div>
  );
}
