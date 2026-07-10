import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

interface LightboxImage {
  src: string;
  alt: string;
}

interface PartnerLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
}

export function PartnerLightbox({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
}: PartnerLightboxProps) {
  const current = images[index];
  if (!current) return null;

  const showControls = images.length > 1;

  const goPrev = () => onIndexChange((index - 1 + images.length) % images.length);
  const goNext = () => onIndexChange((index + 1) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-w-[calc(100%-2rem)] items-center justify-center border-none bg-black/90 p-0 sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">{current.alt}</DialogTitle>

        {showControls && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="size-6" />
          </Button>
        )}

        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[80vh] w-full object-contain"
        />

        {showControls && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="size-6" />
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
