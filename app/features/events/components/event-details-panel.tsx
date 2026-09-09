import { ImageGallery } from "~/components/image-lightbox";
import { SanitizedHtml } from "~/components/sanitized-html";
import { getPhotoUrl } from "~/features/events/lib/public-event-data";
import type { PublicEventPhoto } from "~/features/events/lib/public-event-data";
import type { EventDetail } from "~/features/events/types/events";

export function EventDetailsPanel({
  event,
  photos,
}: {
  event: EventDetail;
  photos: PublicEventPhoto[];
}) {
  const hasDescription = Boolean(
    event.description.replace(/<[^>]*>/g, "").trim(),
  );
  const galleryImages = Array.from(
    new Set([
      ...photos.flatMap((photo) => getPhotoUrl(photo) ?? []),
      ...event.photos,
    ]),
  );

  return (
    <div>
      {hasDescription ? (
        <SanitizedHtml
          html={event.description}
          className="text-base leading-[1.65] text-[#9A9AB0] [&_a]:font-semibold [&_a]:text-[#1C5DD4] [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1A1A2E] [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#1A1A2E] [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:text-[#1A1A2E] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
        />
      ) : (
        <p className="text-base text-[#9A9AB0]">
          The organizer has not added a description for this event yet.
        </p>
      )}

      {galleryImages.length > 0 && (
        <section className="mt-10" aria-labelledby="event-gallery-heading">
          <h2
            id="event-gallery-heading"
            className="mb-4 text-[26px] font-extrabold text-[#1A1A2E]"
          >
            Event Gallery
          </h2>
          <ImageGallery
            images={galleryImages}
            alt={`${event.title} gallery photo`}
            columns={3}
          />
        </section>
      )}
    </div>
  );
}
