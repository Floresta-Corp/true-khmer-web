import { Calendar, MapPin, Globe, Flag } from "lucide-react";
import { formatDate, formatTime } from "~/features/events/lib/event-formatters";
import type { EventData } from "./event-card";
import type { Organizer } from "~/features/events/lib/event-types";

interface EventDetailSidebarProps {
  event: EventData;
  organizer: Organizer | null;
}

export function EventDetailSidebar({
  event,
  organizer,
}: EventDetailSidebarProps) {
  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="lg:sticky lg:top-24 space-y-5">
        {/* Overview Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">Overview</h3>
          {event.excerpt && (
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {event.excerpt}
            </p>
          )}

          {/* Date & Time */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-[#2F6FE4]" />
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
              <div className="w-9 h-9 rounded-full bg-[#D0FAE5] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-[#00BC7D]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {event.venueName}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {event.isOnline ? "Online Event" : "In-Person"}
                </p>
              </div>
            </div>
          ) : event.isOnline ? (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Online Event
                </p>
                <p className="text-xs text-gray-400">Join from anywhere</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* About the Organizer */}
        {organizer && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              About the Organizer
            </h3>
            <div className="flex items-center gap-3 mb-3">
              {organizer.image ? (
                <img
                  src={organizer.image}
                  alt={`${organizer.firstName} ${organizer.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {organizer.firstName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {organizer.firstName} {organizer.lastName}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {parseInt(organizer.totalEvent) > 1
                    ? `${organizer.totalEvent} events`
                    : `${organizer.totalEvent} event`}
                </p>
              </div>
            </div>

            {/* Report */}
            <button className="flex items-center gap-1.5 mt-5 text-xs text-red-400 hover:text-red-500 transition-colors">
              <Flag className="w-3.5 h-3.5" />
              Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
