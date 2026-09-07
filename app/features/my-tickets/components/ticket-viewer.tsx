import { ChevronLeft, ChevronRight, Ticket as TicketIcon } from "lucide-react";
import { resolveImageURL } from "~/lib/utils";

import type { Ticket } from "../types";

interface Props {
  thumbnail: string;
  currentTicketIndex: number;
  tickets: Ticket[];
  currentTicket: Ticket;
  totalTickets: number;
  isTransitioning: boolean;
  showSummary: boolean;
  onSwitchTicket: (index: number) => void;
}

export default function TicketViewer({
  thumbnail,
  currentTicketIndex,
  tickets,
  currentTicket,
  totalTickets,
  isTransitioning,
  showSummary,
  onSwitchTicket,
}: Props) {
  return (
    <div
      className={`relative isolate flex w-full min-w-0 flex-col overflow-hidden bg-[#111928] p-4 text-white transition-all duration-500 sm:p-6 md:w-1/2 md:p-10 ${showSummary ? "blur-[2px] md:opacity-40" : "opacity-100"}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: thumbnail
            ? `linear-gradient(to bottom, rgba(17, 25, 40, 0.55), rgba(17, 25, 40, 0.88)), url(${JSON.stringify(resolveImageURL(thumbnail))})`
            : undefined,
        }}
      />

      {/* Ticket pager. Rendered for a single ticket too ("Ticket 1 of 1") so the
          pane keeps the same shape whatever the order size; the arrows and the
          progress dashes only do anything once there is more than one. */}
      <div className="mb-4 flex animate-in flex-col items-center gap-2.5 delay-150 duration-700 slide-in-from-top-6 sm:mb-6 md:mb-8">
        <div className="inline-flex max-w-[calc(100vw-2.5rem)] items-center gap-1.5 rounded-full border-4 border-white/15 bg-white px-2 py-1 shadow-sm transition-all duration-300 sm:max-w-full sm:gap-3 sm:px-2.5 sm:py-1.5">
          <button
            type="button"
            onClick={() =>
              onSwitchTicket(
                (currentTicketIndex - 1 + totalTickets) % totalTickets,
              )
            }
            disabled={totalTickets < 2}
            className="flex-shrink-0 cursor-pointer rounded-full p-1 text-[#667085] transition-all hover:bg-[#2443ff]/10 hover:text-[#2443ff] active:scale-90 disabled:pointer-events-none disabled:opacity-30 sm:p-1.5"
            aria-label="Previous ticket"
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>

          <span className="px-1 text-[10px] font-black tracking-[0.16em] whitespace-nowrap text-[#667085] uppercase sm:text-[11px]">
            {`Ticket ${currentTicketIndex + 1} of ${totalTickets}`}
          </span>

          <button
            type="button"
            onClick={() =>
              onSwitchTicket((currentTicketIndex + 1) % totalTickets)
            }
            disabled={totalTickets < 2}
            className="flex-shrink-0 cursor-pointer rounded-full p-1 text-[#667085] transition-all hover:bg-[#2443ff]/10 hover:text-[#2443ff] active:scale-90 disabled:pointer-events-none disabled:opacity-30 sm:p-1.5"
            aria-label="Next ticket"
          >
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>

        <div className="flex max-w-full flex-wrap justify-center gap-1">
          {tickets.map((ticket, idx) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => onSwitchTicket(idx)}
              aria-label={`Show ticket ${idx + 1}`}
              aria-current={idx === currentTicketIndex ? "true" : undefined}
              className={`h-1 cursor-pointer rounded-full transition-all duration-500 ${
                idx === currentTicketIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div
        className={`mb-4 flex justify-center transition-all duration-300 sm:mb-5 md:mb-7 ${isTransitioning ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl">
          <TicketIcon size={14} strokeWidth={2.5} className="text-white/80" />
          <span className="text-[11px] font-bold tracking-[0.12em] text-white uppercase sm:text-xs">
            {currentTicket.tier.name}
          </span>
        </div>
      </div>

      <div className="relative mb-5 flex justify-center sm:mb-7 md:mb-10">
        <div
          className={`rounded-2xl bg-white p-3 shadow-2xl shadow-black/40 transition-all duration-300 ${isTransitioning ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
        >
          {currentTicket.qrUrl ? (
            <img
              src={currentTicket.qrUrl}
              alt={`QR code for ticket ${currentTicket.ticketNumber}`}
              className="aspect-square w-full max-w-28 sm:max-w-36 md:max-w-40"
            />
          ) : (
            <div className="flex aspect-square w-full max-w-28 flex-col items-center justify-center gap-2 rounded-lg bg-white p-2 sm:max-w-36 md:max-w-40">
              <span className="loading loading-spinner text-[#2443ff]" />
              <span className="text-center text-xs text-[#2443ff]">
                {"QR code is being generated…"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className={`mt-auto flex flex-col items-center transition-all duration-300 ${isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <p className="mb-1.5 text-[9px] font-black tracking-[0.2em] text-white/50 uppercase sm:text-[10px]">
          {"Ticket Holder"}
        </p>
        <h2 className="text-center text-xl leading-tight font-[900] tracking-tight text-white sm:text-2xl md:text-3xl">
          {currentTicket.holderName}
        </h2>

        <div className="my-4 h-px w-20 bg-white/25 sm:my-5" />

        <p className="mb-1.5 text-[9px] font-black tracking-[0.2em] text-white/50 uppercase sm:text-[10px]">
          {"Ticket ID"}
        </p>
        <p className="text-center text-sm font-bold tracking-wide text-white">
          {currentTicket.ticketNumber}
        </p>
      </div>
    </div>
  );
}
