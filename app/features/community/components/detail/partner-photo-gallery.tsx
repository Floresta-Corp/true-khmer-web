import { Eye } from "lucide-react";
import type { PublicPartnerPhoto } from "~/types/api-client";

interface PartnerPhotoGalleryProps {
  name: string;
  photos: PublicPartnerPhoto[];
  onPhotoClick: (index: number) => void;
}

export function PartnerPhotoGallery({
  name,
  photos,
  onPhotoClick,
}: PartnerPhotoGalleryProps) {
  if (photos.length === 0) return null;

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-card-foreground">Gallery</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => onPhotoClick(index)}
            className="group relative block aspect-video w-full overflow-hidden rounded-xl border-0 bg-transparent p-0 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <img
              src={photo.url}
              alt={`${name} gallery ${index + 1}`}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="translate-y-2 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                <Eye className="size-6 text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
