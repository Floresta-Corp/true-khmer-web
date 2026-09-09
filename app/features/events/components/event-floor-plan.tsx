import { FileText } from "lucide-react";
import { ImageGallery } from "~/components/image-lightbox";
import { readString } from "~/features/events/lib/public-event-data";
import type { PublicEventFloorPlanPhoto } from "~/features/events/lib/public-event-data";

export function EventFloorPlan({
  photos,
}: {
  photos: PublicEventFloorPlanPhoto[];
}) {
  const images = photos.flatMap((photo) => {
    const type = readString(photo, "type", "fileType")?.toUpperCase();
    const url = readString(photo, "fullUrl", "url", "fileUrl");
    return url && type !== "PDF" ? [url] : [];
  });
  const documents = photos.flatMap((photo, index) => {
    const type = readString(photo, "type", "fileType")?.toUpperCase();
    const url = readString(photo, "url", "fullUrl", "fileUrl");
    return url && type === "PDF"
      ? [{ url, id: readString(photo, "id") ?? `floor-plan-${index}` }]
      : [];
  });

  if (images.length === 0 && documents.length === 0) {
    return (
      <p className="rounded-[14px] border border-dashed border-[#D5D8E0] py-12 text-center text-sm text-[#9A9AB0]">
        No floor plan has been added yet.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <ImageGallery images={images} alt="Event floor plan" columns={3} />
      {documents.map((document, index) => (
        <div
          key={document.id}
          className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-[#F5F7FB] p-3"
        >
          <iframe
            src={document.url}
            title={`Event floor plan PDF ${index + 1}`}
            className="h-[65vh] min-h-96 w-full rounded-lg border-0 bg-white"
          />
          <a
            href={document.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center gap-2 px-1 text-sm font-bold text-[#1C5DD4] hover:underline"
          >
            <FileText className="size-4" aria-hidden />
            Open PDF in a new tab
          </a>
        </div>
      ))}
    </div>
  );
}
