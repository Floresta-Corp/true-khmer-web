import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  formatDate,
  formatEventTimeRange,
} from "~/features/events/lib/event-formatters";
import {
  getSessionDateKey,
  getSessionId,
  readRecord,
  readRecords,
  readString,
} from "~/features/events/lib/public-event-data";
import type { PublicEventSession } from "~/features/events/lib/public-event-data";
import type { EventDetail } from "~/features/events/types/events";

function sessionTypeLabel(value: string | null) {
  if (!value) return "Session";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Speaker({ speaker }: { speaker: Record<string, unknown | null> }) {
  const name = readString(speaker, "fullName", "name") ?? "Guest speaker";
  const avatar =
    readString(speaker, "avatarUrl", "photoUrl") ??
    (readRecord(speaker.avatar)
      ? readString(readRecord(speaker.avatar)!, "fullUrl", "url")
      : null);
  const title = readString(speaker, "title", "jobTitle");
  const company = readString(speaker, "company", "organization");

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {avatar ? (
        <img
          src={avatar}
          alt=""
          className="size-11 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#D5E2FA] font-extrabold text-[#1C5DD4]">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-[#1A1A2E]">
          {name}
        </span>
        {(title || company) && (
          <span className="block truncate text-xs text-[#9A9AB0]">
            {[title, company].filter(Boolean).join(", ")}
          </span>
        )}
      </span>
    </div>
  );
}

export function EventProgram({
  event,
  sessions,
}: {
  event: EventDetail;
  sessions: PublicEventSession[];
}) {
  const groups = useMemo(() => {
    const grouped = new Map<string, PublicEventSession[]>();
    sessions.forEach((session) => {
      const key = getSessionDateKey(session);
      grouped.set(key, [...(grouped.get(key) ?? []), session]);
    });
    return Array.from(grouped.entries()).sort(([, first], [, second]) =>
      (
        readString(first[0], "startAt", "startDate", "startsAt") ?? ""
      ).localeCompare(
        readString(second[0], "startAt", "startDate", "startsAt") ?? "",
      ),
    );
  }, [sessions]);
  const [selectedDay, setSelectedDay] = useState(() => groups[0]?.[0] ?? "");
  const activeDay = groups.some(([key]) => key === selectedDay)
    ? selectedDay
    : (groups[0]?.[0] ?? "");
  const activeSessions = (groups.find(([key]) => key === activeDay)?.[1] ?? [])
    .slice()
    .sort((a, b) =>
      (readString(a, "startAt", "startDate", "startsAt") ?? "").localeCompare(
        readString(b, "startAt", "startDate", "startsAt") ?? "",
      ),
    );

  if (sessions.length === 0) {
    return (
      <section aria-labelledby="event-program-heading">
        <h2
          id="event-program-heading"
          className="mb-6 text-[26px] font-extrabold text-[#1A1A2E]"
        >
          Event Program
        </h2>
        <p className="rounded-[14px] border border-dashed border-[#D5D8E0] py-12 text-center text-sm text-[#9A9AB0]">
          The organizer has not published the program yet.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="event-program-heading">
      <h2
        id="event-program-heading"
        className="mb-6 text-[26px] font-extrabold text-[#1A1A2E]"
      >
        Event Program
      </h2>

      {groups.length > 1 && (
        <div className="mb-7 flex gap-2 overflow-x-auto" role="tablist">
          {groups.map(([key, daySessions], index) => {
            const eventDate = event.dates?.find((date) => date.id === key);
            const date =
              eventDate?.startAt ??
              readString(daySessions[0], "startAt", "startDate", "startsAt");
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={key === activeDay}
                onClick={() => setSelectedDay(key)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors",
                  key === activeDay
                    ? "border-[#1C5DD4] bg-[#1C5DD4] text-white"
                    : "border-[#E5E7EB] bg-white text-[#9A9AB0] hover:border-[#1C5DD4] hover:text-[#1C5DD4]",
                )}
              >
                Day {index + 1}
                {date ? ` · ${formatDate(date)}` : ""}
              </button>
            );
          })}
        </div>
      )}

      <div className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
        {activeSessions.map((session, index) => {
          const startAt = readString(
            session,
            "startAt",
            "startDate",
            "startsAt",
          );
          const endAt = readString(session, "endAt", "endDate", "endsAt");
          const title =
            readString(session, "title", "name") ?? "Untitled session";
          const description = readString(session, "description", "excerpt");
          const location = readString(session, "location", "venueName", "room");
          const speakers = readRecords(session.speakers);

          return (
            <article
              key={getSessionId(session, index)}
              className="grid gap-4 py-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-7"
            >
              <div>
                <p className="font-extrabold text-[#1A1A2E]">
                  {startAt ? formatEventTimeRange(startAt, endAt) : "Time TBA"}
                </p>
                {location && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-sm text-[#9A9AB0]">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {location}
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <span className="mb-2 inline-flex rounded-md bg-[#D5E2FA] px-2.5 py-1 text-xs font-bold text-[#1C5DD4]">
                  {sessionTypeLabel(readString(session, "type", "sessionType"))}
                </span>
                <h3 className="text-lg font-extrabold text-[#1A1A2E]">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1.5 text-sm leading-6 text-[#9A9AB0]">
                    {description}
                  </p>
                )}
                {speakers.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2.5 text-xs font-bold tracking-wide text-[#9A9AB0] uppercase">
                      Speakers
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {speakers.map((speaker, speakerIndex) => (
                        <Speaker
                          key={readString(speaker, "id") ?? speakerIndex}
                          speaker={speaker}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
