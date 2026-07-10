import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  open: boolean;
  images: LightboxImage[];
  index: number;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
}

export function ImageLightbox({
  open,
  images,
  index,
  onOpenChange,
  onIndexChange,
}: ImageLightboxProps) {
  const image = images[index];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" && hasMultiple) {
        onIndexChange((index - 1 + images.length) % images.length);
      } else if (event.key === "ArrowRight" && hasMultiple) {
        onIndexChange((index + 1) % images.length);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasMultiple, index, images.length, onIndexChange]);

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] max-w-4xl items-center justify-center border-none bg-black/90 p-0 shadow-none"
      >
        <DialogTitle className="sr-only">{image.alt}</DialogTitle>
        <DialogClose className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70">
          <X className="size-5" />
        </DialogClose>

        {hasMultiple && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              onIndexChange((index - 1 + images.length) % images.length)
            }
            className="absolute left-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}

        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[85vh] max-w-full object-contain"
        />

        {hasMultiple && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onIndexChange((index + 1) % images.length)}
            className="absolute right-16 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
