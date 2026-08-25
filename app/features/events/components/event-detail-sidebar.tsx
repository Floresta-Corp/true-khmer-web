import { Calendar, MapPin, Globe, Flag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { formatDate, formatTime } from "~/features/events/lib/event-formatters";
import type { EventData } from "./event-card";
import type { Organizer } from "~/features/events/lib/event-types";
import { Card } from "~/components/ui/card";

interface EventDetailSidebarProps {
  event: EventData;
  organizer: Organizer | null;
}

export function EventDetailSidebar({
  event,
  organizer,
}: EventDetailSidebarProps) {
  return (
    <div className="w-full shrink-0 lg:w-80">
      <div className="space-y-5 lg:sticky lg:top-24">
        {/* Overview Card */}
        <Card className="rounded-2xl bg-white p-6 shadow-none">
          <h3 className="mb-3 text-base font-bold text-gray-900">Overview</h3>
          {event.excerpt && (
            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              {event.excerpt}
            </p>
          )}

          {/* Date & Time */}
          <div className="mb-4 flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE]">
              <Calendar className="h-4 w-4 text-[#2F6FE4]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(event.startAt)}
              </p>
              <p className="text-xs text-gray-400">
                {formatTime(event.startAt)} - {formatTime(event.endAt)}
              </p>
            </div>
          </div>

          {/* Location */}
          {event.venueName ? (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D0FAE5]">
                <MapPin className="h-4 w-4 text-[#00BC7D]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {event.venueName}
                </p>
                <p className="text-xs tracking-wide text-gray-400 uppercase">
                  {event.isOnline ? "Online Event" : "In-Person"}
                </p>
              </div>
            </div>
          ) : event.isOnline ? (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Globe className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Online Event
                </p>
                <p className="text-xs text-gray-400">Join from anywhere</p>
              </div>
            </div>
          ) : null}
        </Card>

        {/* About the Organizer */}
        {organizer && (
          <Card className="rounded-2xl bg-white p-6 shadow-none">
            <h3 className="mb-4 text-base font-bold text-gray-900">
              About the Organizer
            </h3>
            <div className="mb-3 flex items-center gap-3">
              {organizer.image ? (
                <img
                  src={organizer.image}
                  alt={`${organizer.firstName} ${organizer.lastName}`}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-indigo-500 text-sm font-bold text-white">
                  {organizer.firstName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {organizer.firstName} {organizer.lastName}
                </p>
                <p className="text-xs font-medium text-blue-600">
                  {parseInt(organizer.totalEvent) > 1
                    ? `${organizer.totalEvent} events`
                    : `${organizer.totalEvent} event`}
                </p>
              </div>
            </div>

            {/* Report */}
            <Button
              variant="ghost"
              className="mt-5 flex h-auto items-center gap-1.5 px-0 py-0 text-xs text-red-400 transition-colors hover:text-red-500"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
