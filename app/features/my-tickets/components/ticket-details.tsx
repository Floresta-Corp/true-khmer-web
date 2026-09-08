import { Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import { FormatDateRange, formatEventTimeRange } from "../lib/date";

import type { TicketEvent } from "../types";

interface Props {
  event: TicketEvent;
}

export default function TicketDetails({ event }: Props) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1.5 text-[10px] font-semibold tracking-[0.08em] text-[#667085]">
          {"Powered by"}
        </p>
        <img src="/plumpiLogo.png" alt="plumpi" className="h-6 sm:h-7" />
      </div>

      <h4 className="mb-5 flex items-center gap-2.5 text-[11px] font-black tracking-[0.2em] text-[#667085] uppercase sm:mb-6">
        <span className="h-3.5 w-0.75 rounded-full bg-[#2443ff]" />
        {"Event Details"}
      </h4>

      <div className="space-y-5 sm:space-y-7">
        <EventInfoRow
          icon={<TicketIcon size={20} />}
          label={"Event"}
          value={event.title}
        />

        <EventInfoRow
          icon={<Calendar size={20} />}
          label={"Schedule"}
          value={FormatDateRange(event.startAt)}
          subValue={`${formatEventTimeRange(event.startAt)} - ${formatEventTimeRange(event.endAt)}`}
        />

        <EventInfoRow
          icon={<MapPin size={20} />}
          label={"Venue"}
          value={
            event.venue?.name ||
            (event.venue?.address && event.venue?.city
              ? `${event.venue.address}, ${event.venue.city}`
              : event.location || (event.isOnline ? "Online Event" : "TBA"))
          }
          subValue={
            event.venue?.address && event.venue?.city
              ? `${event.venue.address}, ${event.venue.city}`
              : undefined
          }
        />
      </div>
    </div>
  );
}

interface EventInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

function EventInfoRow({ icon, label, value, subValue }: EventInfoRowProps) {
  return (
    <div className="flex items-start gap-3.5 sm:gap-4">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2443ff]/8 text-[#2443ff] sm:h-12 sm:w-12">
        {icon}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="mb-1 text-[10px] font-black tracking-[0.16em] text-[#667085] uppercase">
          {label}
        </p>
        <p className="text-base leading-tight font-extrabold break-words text-[#111928] sm:text-lg">
          {value}
        </p>
        {subValue && (
          <p className="mt-1.5 text-xs font-semibold break-words text-[#667085] sm:text-[13px]">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
