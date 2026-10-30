import type { ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  DoorOpen,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  MapPin,
  UserRoundCheck,
} from "lucide-react";
import type { EventSummaryView } from "~/features/workspace/types/my-events";

type Props = {
  title: string;
  description: string;
  /** Shown beside the title, e.g. the event's status. */
  badge?: ReactNode;
  summary: EventSummaryView;
};

const ACCESS_ICONS = {
  visibility: Eye,
  registration: UserRoundCheck,
  entry: DoorOpen,
} as const;

/**
 * Read-only summary of an event's basics, shared by the review step before a
 * draft is created and the event page reached from My Events.
 */
export default function EventSummary({
  title,
  description,
  badge,
  summary,
}: Props) {
  const accessSummary = [
    {
      key: "visibility" as const,
      label: "Visibility",
      value: summary.access.visibility,
    },
    {
      key: "registration" as const,
      label: "Who can register",
      value: summary.access.registration,
    },
    {
      key: "entry" as const,
      label: "Entry method",
      value: summary.access.entry,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#1D283A] md:text-[26px]">
              {title}
            </h1>
            {badge}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-6">
          <div className="hidden w-px self-stretch bg-[#E1E7EF] md:block" />
          <div className="flex flex-col items-start gap-2">
            <img src="/images/Plumpi.svg" alt="Plumpi" className="h-8 w-auto" />
            <div>
              <div className="text-[13.5px] font-bold text-[#1D283A]">
                Secure &amp; trusted
              </div>
              <p className="max-w-64 text-[12.5px] leading-relaxed text-slate-500">
                We partner with Plumpi for event management, ticketing and guest
                check-in.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-[14px] border border-[#E1E7EF] bg-white p-6">
        <div className="grid gap-7 md:grid-cols-2">
          <div className="h-70 overflow-hidden rounded-xl bg-[#F4F6F9]">
            {summary.coverUrl ? (
              <img
                src={summary.coverUrl}
                alt={summary.name || "Event thumbnail"}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-slate-400">
                <ImageIcon className="size-8" />
                <span className="text-xs">No thumbnail selected</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {summary.category && (
              <span className="self-start rounded-full bg-[#EAF1FC] px-3.5 py-1.5 text-xs font-bold text-blue-600">
                {summary.category}
              </span>
            )}

            <h2 className="mt-3.5 text-2xl leading-tight font-extrabold text-[#1D283A] md:text-[28px]">
              {summary.name || "Untitled event"}
            </h2>

            {summary.organizerName && (
              <p className="mt-2 text-[13px] text-slate-500">
                Hosted by{" "}
                <span className="font-bold text-[#344256]">
                  {summary.organizerName}
                </span>
              </p>
            )}

            <div className="mt-4.5 flex flex-col gap-3 text-sm font-semibold text-[#344256]">
              {summary.dates.map((eventDate) => (
                <div
                  key={eventDate.key}
                  className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1"
                >
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <span>{eventDate.date}</span>
                  <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <span>{eventDate.time}</span>
                </div>
              ))}
              <span className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-slate-400" />
                {summary.location}
              </span>
              {summary.address && (
                <span className="pl-6.5 text-xs font-normal text-slate-500">
                  {summary.address}
                </span>
              )}
              {summary.googleMapLink && (
                <a
                  href={summary.googleMapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 pl-6.5 text-xs text-blue-600 hover:underline"
                >
                  View on Google Maps
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            <div className="mt-4 h-px bg-[#E1E7EF]" />

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              {summary.description || "No description provided."}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[#E1E7EF] pt-5 sm:grid-cols-3">
          {accessSummary.map((item) => {
            const Icon = ACCESS_ICONS[item.key];

            return (
              <div key={item.key} className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-400 uppercase">
                  <Icon className="size-3.5" />
                  {item.label}
                </div>
                <div className="mt-1 truncate text-sm font-bold text-[#1D283A]">
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
