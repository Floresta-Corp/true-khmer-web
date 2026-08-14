import { useState } from "react";
import { Maximize2 } from "lucide-react";

import { ImageLightbox } from "~/components/image-lightbox";
import { cn } from "~/lib/utils";

interface ContentImagePreviewProps {
  src: string;
  title: string;
  className?: string;
  showOverlay?: boolean;
}

export default function ContentImagePreview({
  src,
  title,
  className,
  showOverlay = true,
}: ContentImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "group/preview relative block cursor-zoom-in overflow-hidden bg-slate-100 dark:bg-slate-800",
          className,
        )}
        aria-label={`Preview image for: ${title}`}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover/preview:scale-105"
        />

        {showOverlay && (
          <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all duration-200 group-hover/preview:bg-slate-950/35 group-hover/preview:opacity-100">
            <span className="rounded-full bg-white/95 p-2 text-slate-900 shadow-sm">
              <Maximize2 size={16} />
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <ImageLightbox
          images={[src]}
          initialIndex={0}
          alt={title}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
