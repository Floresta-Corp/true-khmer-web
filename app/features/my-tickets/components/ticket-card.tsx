import { cn as clsx, resolveImageURL } from "~/lib/utils";
import { format } from "date-fns";
import { ArrowRight, CheckCircle2, Ticket } from "lucide-react";
import TicketImage from "./ticket-image";
import type { EventSummary } from "../types";

type Props = {
  data: EventSummary;
  isPast: boolean;
  onClick: (ticket: EventSummary) => void;
};

function toValidDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function TicketCard(props: Props) {
  const { data, onClick, isPast } = props;
  const title = data.title || "Ticket";
  const thumbnail = data.thumbnail;
  const endDate = toValidDate(data.endAt);
  const startDate = toValidDate(data.startAt);
  const eventDate = startDate ? format(startDate, "MMM dd, yyyy") : "Date TBA";
  const eventTime =
    startDate && endDate
      ? `${format(startDate, "h:mm a")} – ${format(endDate, "h:mm a")}`
      : "Time TBA";
  const location =
    data.location ||
    data.venue.name ||
    (data.isOnline ? "Online Event" : "TBA");
  return (
    <div className="group relative h-full">
      <button
        type="button"
        onClick={() => onClick(data)}
        className="relative z-10 flex h-full min-h-45 w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-[#f1f1f1] text-left transition-all duration-300 hover:bg-[#e5e5e5] sm:flex-row"
      >
        <div className="relative w-full flex-shrink-0 self-center p-3 sm:w-44">
          <div className="flex aspect-[16/9] h-full w-full items-center justify-center overflow-hidden rounded-xl bg-[#e5e5e5] sm:aspect-square">
            <TicketImage
              src={thumbnail ? resolveImageURL(thumbnail) : null}
              alt={title}
              className={clsx(
                "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
                isPast && "grayscale-[0.4]",
              )}
              fallbackClassName="w-12 h-12"
            />
          </div>
          {isPast && (
            <div className="absolute inset-0 m-3 flex items-center justify-center rounded-xl bg-black/20">
              <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-lg backdrop-blur-sm">
                {"Event Ended"}
              </span>
            </div>
          )}
        </div>

        <div className="relative flex flex-col items-center">
          <div className="absolute top-0 -left-3 h-6 w-6 rounded-full bg-white shadow-inner sm:-top-3 sm:left-1/2 sm:-translate-x-1/2" />
          <div className="mt-3 w-full border-b border-dashed border-[#e5e5e5] sm:mt-0 sm:h-full sm:border-r" />
          <div className="absolute -right-6 h-6 w-6 -translate-x-1/2 rounded-full bg-white shadow-inner sm:-bottom-3 sm:left-1/2" />
        </div>

        <div className="flex grow flex-col justify-between p-5">
          <div>
            <div className="mb-2 flex items-start justify-between">
              <span className="text-[11px] font-bold tracking-wider text-[#126dfb] uppercase">
                {eventDate} | {eventTime}
              </span>
            </div>

            <h3 className="mb-2 text-lg leading-tight font-black transition-colors group-hover:text-[#126dfb]">
              {title}
            </h3>
            <p className="text-[13px] font-medium text-gray-500">
              {location || "Na"}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div
              className={clsx(
                "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition-colors sm:text-[13px]",
                isPast
                  ? "border-slate-200 bg-slate-50 text-slate-500"
                  : "border-[#126dfb]/40 bg-[#126dfb]/10 text-[#126dfb]",
              )}
            >
              {isPast ? <CheckCircle2 size={14} /> : <Ticket size={14} />}
              <span>{isPast ? "Used" : `x${data.ticketCount}`}</span>
            </div>

            <div
              className={clsx(
                "flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase transition-all group-hover:translate-x-1 sm:text-[11px]",
                isPast
                  ? "text-slate-400 group-hover:text-slate-600"
                  : "text-[#126dfb]",
              )}
            >
              <span>Ticket Details</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
