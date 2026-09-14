import { mergeAttributes, Node } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { clsx } from "clsx";
import { MoreHorizontal } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

export type BlogImageDisplayWidth = "content" | "wide" | "full";

export interface BlogImageAttrs {
  src: string;
  alt: string;
  caption: string;
  displayWidth: BlogImageDisplayWidth;
  width: string;
}

const IMAGE_WIDTH_PRESETS: Record<BlogImageDisplayWidth, string> = {
  content: "72%",
  wide: "88%",
  full: "100%",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    articleImage: {
      setArticleImage: (
        attrs: Partial<BlogImageAttrs> & { src: string },
      ) => ReturnType;
    };
  }
}

function BlogImageView(props: NodeViewProps) {
  const { node, updateAttributes, deleteNode, selected, editor, getPos } =
    props;
  const [isResizing, setIsResizing] = useState(false);
  const [tempWidth, setTempWidth] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const attrs = node.attrs as BlogImageAttrs;
  const imageWidth = tempWidth || attrs.width || "100%";
  const sizeClassName = clsx(
    attrs.displayWidth === "full" && "w-full",
    attrs.displayWidth === "wide" && "mx-auto w-full max-w-5xl",
    attrs.displayWidth === "content" && "mx-auto w-full max-w-3xl",
  );

  const startResizing = useCallback(
    (event: React.MouseEvent, direction: "left" | "right") => {
      event.preventDefault();
      event.stopPropagation();

      const container = containerRef.current;
      const parent = container?.parentElement;
      if (!container || !parent) return;

      setIsResizing(true);

      const startX = event.clientX;
      const startWidth = container.offsetWidth;
      const parentWidth = parent.offsetWidth;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const nextWidthPx =
          direction === "right"
            ? startWidth + deltaX * 2
            : startWidth - deltaX * 2;
        const nextWidthPercent = Math.max(
          15,
          Math.min(100, (nextWidthPx / parentWidth) * 100),
        );

        setTempWidth(`${nextWidthPercent}%`);
      };

      const onMouseUp = () => {
        setIsResizing(false);
        setTempWidth((currentWidth) => {
          if (currentWidth) {
            updateAttributes({ width: currentWidth });
          }
          return null;
        });
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateAttributes],
  );

  return (
    <NodeViewWrapper
      as="figure"
      className={clsx(
        "blog-image-node group relative my-10",
        selected && "is-selected",
      )}
      data-display-width={attrs.displayWidth}
      data-image-width={attrs.width || "100%"}
    >
      <div
        ref={containerRef}
        className={clsx("relative", sizeClassName)}
        style={{ width: imageWidth }}
      >
        <div
          className={clsx(
            "blog-image-frame relative transition-shadow duration-200",
            isResizing && "transition-none",
          )}
        >
          <img
            src={attrs.src}
            alt={attrs.alt || ""}
            className="block w-full rounded-[1.75rem] border border-border object-cover shadow-sm"
            draggable={false}
            referrerPolicy="no-referrer"
          />

          {selected ? (
            <>
              <div
                onMouseDown={(event) => startResizing(event, "left")}
                className="absolute -top-1.5 -left-1.5 z-20 h-3 w-3 cursor-nwse-resize rounded-full border-2 border-orange-500 bg-background shadow-sm transition-transform hover:scale-125"
              />
              <div
                onMouseDown={(event) => startResizing(event, "right")}
                className="absolute -top-1.5 -right-1.5 z-20 h-3 w-3 cursor-nesw-resize rounded-full border-2 border-orange-500 bg-background shadow-sm transition-transform hover:scale-125"
              />
              <div
                onMouseDown={(event) => startResizing(event, "left")}
                className="absolute -bottom-1.5 -left-1.5 z-20 h-3 w-3 cursor-nesw-resize rounded-full border-2 border-orange-500 bg-background shadow-sm transition-transform hover:scale-125"
              />
              <div
                onMouseDown={(event) => startResizing(event, "right")}
                className="absolute -right-1.5 -bottom-1.5 z-20 h-3 w-3 cursor-nwse-resize rounded-full border-2 border-orange-500 bg-background shadow-sm transition-transform hover:scale-125"
              />
            </>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon-lg"
                className="absolute top-4 right-4 rounded-full bg-black/78 text-white opacity-100 shadow-lg hover:bg-black md:opacity-0 md:group-hover:opacity-100"
                aria-label="Image options"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onSelect={() =>
                  updateAttributes({ caption: attrs.caption || "" })
                }
              >
                Edit caption
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  updateAttributes({
                    displayWidth: "wide",
                    width: IMAGE_WIDTH_PRESETS.wide,
                  })
                }
              >
                Wide width
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  updateAttributes({
                    displayWidth: "full",
                    width: IMAGE_WIDTH_PRESETS.full,
                  })
                }
              >
                Full width
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  updateAttributes({
                    displayWidth: "content",
                    width: IMAGE_WIDTH_PRESETS.content,
                  })
                }
              >
                Content width
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={deleteNode}
              >
                Delete image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-4 pt-3">
          <Input
            type="text"
            value={attrs.caption || ""}
            onChange={(event) =>
              updateAttributes({ caption: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;

              event.preventDefault();
              event.stopPropagation();

              const nodePosition =
                typeof getPos === "function" ? getPos() : null;
              const nextPosition =
                typeof nodePosition === "number"
                  ? nodePosition + node.nodeSize
                  : null;

              if (typeof nextPosition === "number") {
                const resolvedPosition = editor.state.doc.resolve(nextPosition);
                const nextNode = resolvedPosition.nodeAfter;

                if (nextNode?.type.name === "paragraph") {
                  editor
                    .chain()
                    .focus(nextPosition + 1)
                    .run();
                  return;
                }

                editor
                  .chain()
                  .insertContentAt(nextPosition, { type: "paragraph" })
                  .focus(nextPosition + 1)
                  .run();
                return;
              }

              editor.chain().focus().run();
            }}
            placeholder="Write a caption..."
            className="w-full border-0 bg-transparent text-center text-sm text-muted-foreground italic shadow-none focus-visible:ring-0"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export const BlogImageNode = Node.create({
  name: "articleImage",
  group: "block",
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
      displayWidth: { default: "content" },
      width: { default: "100%" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-type='article-image']",
        getAttrs: (element) => {
          const node = element as HTMLElement;
          const image = node.querySelector("img");
          const caption = node.querySelector("figcaption");
          return {
            src: image?.getAttribute("src") || "",
            alt: image?.getAttribute("alt") || "",
            caption: caption?.textContent || "",
            displayWidth: node.dataset.displayWidth || "content",
            width: node.dataset.imageWidth || node.style.width || "100%",
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          const node = element as HTMLImageElement;
          return {
            src: node.getAttribute("src") || "",
            alt: node.getAttribute("alt") || "",
            caption: "",
            displayWidth: "content",
            width: "100%",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = HTMLAttributes as unknown as BlogImageAttrs &
      Record<string, string>;
    const figureAttrs = mergeAttributes({
      "data-type": "article-image",
      "data-display-width": attrs.displayWidth || "content",
      "data-image-width": attrs.width || "100%",
      style: `width: ${attrs.width || "100%"};`,
    });
    const imageAttrs = {
      src: attrs.src,
      alt: attrs.alt || "",
    };
    const children: unknown[] = [["img", imageAttrs]];

    if (attrs.caption && String(attrs.caption).trim()) {
      children.push(["figcaption", {}, attrs.caption]);
    }

    return ["figure", figureAttrs, ...children] as never;
  },

  addCommands() {
    return {
      setArticleImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              src: attrs.src,
              alt: attrs.alt || "",
              caption: attrs.caption || "",
              displayWidth: attrs.displayWidth || "content",
              width: attrs.width || "100%",
            },
          }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlogImageView);
  },
});

export { IMAGE_WIDTH_PRESETS };
