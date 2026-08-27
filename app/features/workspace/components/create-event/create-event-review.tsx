import {
  CalendarDays,
  Clock,
  DoorOpen,
  Eye,
  Image as ImageIcon,
  MapPin,
  UserRoundCheck,
} from "lucide-react";
import {
  EVENT_ENTRY_LABELS,
  EVENT_REGISTRATION_LABELS,
  EVENT_VISIBILITY_LABELS,
  MY_EVENT_FORMAT_LABELS,
  formatCreateEventTimeRange,
  formatDateInputValue,
} from "~/features/workspace/lib/my-events-format";
import type {
  CreateEventFormState,
  EventOrganizer,
} from "~/features/workspace/types/my-events";

type Props = {
  form: CreateEventFormState;
  category: string;
  organizer: EventOrganizer | null;
};

/**
 * Read-only summary of the basics step, shown right before the Plumpi handoff.
 */
const ACCESS_ICONS = {
  visibility: Eye,
  registration: UserRoundCheck,
  entry: DoorOpen,
} as const;

export default function CreateEventReview({
  form,
  category,
  organizer,
}: Props) {
  const formatLabel = form.format
    ? MY_EVENT_FORMAT_LABELS[form.format]
    : "Format to be confirmed";

  const accessSummary = [
    {
      key: "visibility" as const,
      label: "Visibility",
      value: EVENT_VISIBILITY_LABELS[form.visibility],
    },
    {
      key: "registration" as const,
      label: "Who can register",
      value: EVENT_REGISTRATION_LABELS[form.registrationMode],
    },
    {
      key: "entry" as const,
      label: "Entry method",
      value: EVENT_ENTRY_LABELS[form.entryMode],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold text-[#1D283A] md:text-[26px]">
            Review your event
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Double check the details, then create your draft. Once it&apos;s
            saved, you can continue in Plumpi or return to My Events.
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
            {form.coverPreviewUrl ? (
              <img
                src={form.coverPreviewUrl}
                alt={form.name || "Event cover"}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-slate-400">
                <ImageIcon className="size-8" />
                <span className="text-xs">No cover selected</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {category && (
              <span className="self-start rounded-full bg-[#EAF1FC] px-3.5 py-1.5 text-xs font-bold text-blue-600">
                {category}
              </span>
            )}

            <h2 className="mt-3.5 text-2xl leading-tight font-extrabold text-[#1D283A] md:text-[28px]">
              {form.name || "Untitled event"}
            </h2>

            {organizer && (
              <p className="mt-2 text-[13px] text-slate-500">
                Hosted by{" "}
                <span className="font-bold text-[#344256]">
                  {organizer.name}
                </span>
              </p>
            )}

            <div className="mt-4.5 flex flex-col gap-2.5 text-sm font-semibold text-[#344256]">
              <span className="flex items-center gap-2.5">
                <CalendarDays className="size-4 shrink-0 text-slate-400" />
                {form.startDate
                  ? formatDateInputValue(form.startDate)
                  : "Date to be announced"}
              </span>
              <span className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-slate-400" />
                {formatCreateEventTimeRange(form.startTime, form.endTime)}
              </span>
              <span className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 text-slate-400" />
                {formatLabel}
              </span>
            </div>

            <div className="mt-4 h-px bg-[#E1E7EF]" />

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              {form.description || "No description provided."}
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
