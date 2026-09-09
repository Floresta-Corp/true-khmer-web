import { memo } from "react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { readString } from "~/features/events/lib/public-event-data";
import type { PublicEventOrganizer } from "~/features/events/lib/public-event-data";

function websiteUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function hostedEventCount(organizer: PublicEventOrganizer) {
  const value = organizer.totalEvent;
  const count = typeof value === "number" ? value : Number(value);
  return Number.isFinite(count) ? count : null;
}

function EventOrganizerCardComponent({
  organizer,
}: {
  organizer: PublicEventOrganizer;
}) {
  const name = readString(organizer, "name") ?? "Event organizer";
  const logo = readString(organizer, "logo", "logoUrl");
  const description = readString(organizer, "description");
  const location = readString(organizer, "location");
  const phone = readString(organizer, "contactPhone", "phone");
  const email = readString(organizer, "contactEmail", "email");
  const website = websiteUrl(readString(organizer, "website", "websiteUrl"));
  const totalEvents = hostedEventCount(organizer);

  return (
    <section
      className="rounded-[14px] border border-[#E5E7EB] p-6"
      aria-labelledby="event-organizer-heading"
    >
      <h2
        id="event-organizer-heading"
        className="mb-5 text-xl font-extrabold text-[#1A1A2E]"
      >
        About the Organizer
      </h2>

      <div className="flex items-center gap-3.5">
        {logo ? (
          <img
            src={logo}
            alt=""
            className="size-12 shrink-0 rounded-full border border-[#E5E7EB] object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#D5E2FA] text-lg font-extrabold text-[#1C5DD4]">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[15px] font-extrabold text-[#1A1A2E]">
            {name}
          </p>
          {totalEvents !== null && (
            <p className="mt-0.5 text-xs font-semibold text-[#1C5DD4]">
              {totalEvents} {totalEvents === 1 ? "event" : "events"} hosted
            </p>
          )}
        </div>
      </div>

      {description && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#9A9AB0]">
          {description}
        </p>
      )}

      {(location || phone || email || website) && (
        <div className="mt-5 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-sm text-[#6B7280]">
          {location && (
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#1C5DD4]" />
              <span>{location}</span>
            </p>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2.5 transition-colors hover:text-[#1C5DD4]"
            >
              <Phone className="size-4 shrink-0 text-[#1C5DD4]" />
              <span className="min-w-0 break-words">{phone}</span>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 transition-colors hover:text-[#1C5DD4] hover:underline"
            >
              <Mail className="size-4 shrink-0 text-[#1C5DD4]" />
              <span className="min-w-0 break-all">{email}</span>
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 transition-colors hover:text-[#1C5DD4] hover:underline"
            >
              <Globe className="size-4 shrink-0 text-[#1C5DD4]" />
              <span className="min-w-0 truncate">
                {readString(organizer, "website", "websiteUrl")}
              </span>
            </a>
          )}
        </div>
      )}
    </section>
  );
}

export const EventOrganizerCard = memo(EventOrganizerCardComponent);
