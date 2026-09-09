import { Globe, Mail, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  getExhibitorBooths,
  getExhibitorCategory,
  getExhibitorName,
  readString,
} from "~/features/events/lib/public-event-data";
import type { PublicEventExhibitor } from "~/features/events/lib/public-event-data";

function exhibitorLocations(exhibitor: PublicEventExhibitor) {
  const booths = getExhibitorBooths(exhibitor);
  return {
    zones: Array.from(
      new Set(
        booths.flatMap((booth) => readString(booth, "zoneName", "zone") ?? []),
      ),
    ),
    labels: booths.flatMap(
      (booth) => readString(booth, "label", "boothLabel", "name") ?? [],
    ),
  };
}

function safeWebsite(value: string | null) {
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

export function EventExhibitorCard({
  exhibitor,
  onSelect,
}: {
  exhibitor: PublicEventExhibitor;
  onSelect: () => void;
}) {
  const name = getExhibitorName(exhibitor);
  const logo = readString(exhibitor, "logoUrl", "logo", "imageUrl");
  const category = getExhibitorCategory(exhibitor);
  const categoryName = category ? readString(category, "name", "title") : null;
  const { zones, labels } = exhibitorLocations(exhibitor);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full cursor-pointer rounded-[14px] border border-[#E5E7EB] bg-white p-4 text-left transition hover:border-[#1C5DD4] hover:shadow-sm"
    >
      <div className="flex min-h-10 items-center justify-between gap-2 rounded-lg bg-[#F5F7FB] px-3 py-2 text-xs">
        <span className="flex min-w-0 items-center gap-1.5 font-bold text-[#9A9AB0] uppercase">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{zones.join(", ") || "Zone TBA"}</span>
        </span>
        {labels.length > 0 && (
          <span className="shrink-0 font-extrabold text-[#1C5DD4]">
            {labels.slice(0, 2).join(", ")}
            {labels.length > 2 ? ` +${labels.length - 2}` : ""}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {logo ? (
          <img
            src={logo}
            alt=""
            className="size-12 shrink-0 rounded-lg border border-[#E5E7EB] object-contain"
            loading="lazy"
          />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#D5E2FA] text-lg font-extrabold text-[#1C5DD4]">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="min-w-0">
          {categoryName && (
            <span className="block truncate text-[11px] font-bold text-[#9A9AB0] uppercase">
              {categoryName}
            </span>
          )}
          <span className="block truncate font-extrabold text-[#1A1A2E]">
            {name}
          </span>
        </span>
      </div>

      {readString(exhibitor, "description", "excerpt") && (
        <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#9A9AB0]">
          {readString(exhibitor, "description", "excerpt")}
        </p>
      )}
    </button>
  );
}

export function EventExhibitorProfile({
  exhibitor,
  open,
  onOpenChange,
}: {
  exhibitor: PublicEventExhibitor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!exhibitor) return null;

  const name = getExhibitorName(exhibitor);
  const logo = readString(exhibitor, "logoUrl", "logo", "imageUrl");
  const category = getExhibitorCategory(exhibitor);
  const categoryName = category ? readString(category, "name", "title") : null;
  const description = readString(exhibitor, "description", "excerpt");
  const website = safeWebsite(readString(exhibitor, "website", "websiteUrl"));
  const email = readString(exhibitor, "email", "contactEmail");
  const { zones, labels } = exhibitorLocations(exhibitor);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto border-[#E5E7EB] sm:max-w-md">
        <SheetHeader className="border-b border-[#E5E7EB] px-6 py-5">
          <SheetTitle className="font-extrabold text-[#1A1A2E]">
            Exhibitor Profile
          </SheetTitle>
          <SheetDescription>
            Company details and booth location
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-7 p-6">
          <div className="flex items-center gap-4">
            {logo ? (
              <img
                src={logo}
                alt=""
                className="size-16 shrink-0 rounded-xl border border-[#E5E7EB] object-contain"
              />
            ) : (
              <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#D5E2FA] text-xl font-extrabold text-[#1C5DD4]">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              {categoryName && (
                <span className="mb-1.5 inline-flex rounded-full bg-[#D5E2FA] px-3 py-1 text-xs font-bold text-[#1C5DD4]">
                  {categoryName}
                </span>
              )}
              <h2 className="text-2xl leading-tight font-extrabold text-[#1A1A2E]">
                {name}
              </h2>
            </div>
          </div>

          {description && (
            <p className="text-sm leading-6 text-[#6B7280]">{description}</p>
          )}

          {zones.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold tracking-wide text-[#9A9AB0] uppercase">
                Booth location
              </p>
              <p className="flex items-start gap-2 font-bold text-[#1A1A2E]">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#1C5DD4]" />
                {zones.join(", ")}
              </p>
            </div>
          )}

          {labels.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold tracking-wide text-[#9A9AB0] uppercase">
                Booths
              </p>
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[#B9CEF5] bg-[#F8FAFF] px-3 py-1 text-sm font-bold text-[#1C5DD4]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(website || email) && (
            <div className="flex flex-col gap-2.5 border-t border-[#E5E7EB] pt-6">
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-[#1C5DD4] hover:underline"
                >
                  <Globe className="size-4" /> Visit website
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm font-bold text-[#1C5DD4] hover:underline"
                >
                  <Mail className="size-4" /> {email}
                </a>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
