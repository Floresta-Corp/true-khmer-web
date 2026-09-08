import { ChevronLeft, ChevronRight, Ticket as TicketIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { preload } from "react-dom";
import { resolveImageURL } from "~/lib/utils";

import type { Ticket } from "../types";

interface Props {
  thumbnail: string;
  currentTicketIndex: number;
  tickets: Ticket[];
  currentTicket: Ticket;
  totalTickets: number;
  onSwitchTicket: (index: number) => void;
}

export default function TicketViewer({
  thumbnail,
  currentTicketIndex,
  tickets,
  currentTicket,
  totalTickets,
  onSwitchTicket,
}: Props) {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number, y = 0, scale = 1): Variants => ({
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : y,
      scale: reduceMotion ? 1 : scale,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.32,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  });

  // Warm every QR image so switching swaps an already-decoded image instead of
  // starting a fetch mid-transition.
  for (const ticket of tickets) {
    if (ticket.qrUrl) preload(ticket.qrUrl, { as: "image" });
  }

  return (
    <div className="relative isolate flex w-full min-w-0 flex-col justify-center overflow-hidden bg-[#111928] p-4 text-white sm:p-6 md:w-1/2 md:justify-start md:p-10">
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
      <div className="mb-4 flex flex-col items-center gap-2.5 sm:mb-6 md:mb-8">
        <div className="inline-flex max-w-[calc(100vw-2.5rem)] items-center gap-1.5 rounded-full border-4 border-white/15 bg-white px-2 py-1 shadow-sm sm:max-w-full sm:gap-3 sm:px-2.5 sm:py-1.5">
          <button
            type="button"
            onClick={() =>
              onSwitchTicket(
                (currentTicketIndex - 1 + totalTickets) % totalTickets,
              )
            }
            disabled={totalTickets < 2}
            className="flex-shrink-0 cursor-pointer rounded-full p-1 text-[#667085] transition-[color,background-color,opacity,transform] hover:bg-[#2443ff]/10 hover:text-[#2443ff] active:scale-90 disabled:pointer-events-none disabled:opacity-30 sm:p-1.5"
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
            className="flex-shrink-0 cursor-pointer rounded-full p-1 text-[#667085] transition-[color,background-color,opacity,transform] hover:bg-[#2443ff]/10 hover:text-[#2443ff] active:scale-90 disabled:pointer-events-none disabled:opacity-30 sm:p-1.5"
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
              className={`h-1 cursor-pointer rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none ${
                idx === currentTicketIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentTicket.id}
          className="flex min-w-0 flex-col md:flex-1"
          initial="hidden"
          animate="visible"
          exit={{
            opacity: reduceMotion ? 1 : 0,
            transition: { duration: reduceMotion ? 0 : 0.12 },
          }}
        >
          <motion.div
            variants={reveal(0, -8)}
            className="mb-4 flex justify-center sm:mb-5 md:mb-7"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2">
              <TicketIcon
                size={14}
                strokeWidth={2.5}
                className="text-white/80"
              />
              <span className="text-[11px] font-bold tracking-[0.12em] text-white uppercase sm:text-xs">
                {currentTicket.tier.name}
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={reveal(0.06, 0, 0.96)}
            className="relative mb-5 flex justify-center sm:mb-7 md:mb-10"
          >
            <div className="rounded-2xl bg-white p-3 shadow-2xl shadow-black/40">
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
          </motion.div>

          <div className="flex flex-col items-center md:mt-auto">
            <motion.div
              variants={reveal(0.12, 10)}
              className="flex flex-col items-center"
            >
              <p className="mb-1.5 text-[9px] font-black tracking-[0.2em] text-white/50 uppercase sm:text-[10px]">
                {"Ticket Holder"}
              </p>
              <h2 className="text-center text-xl leading-tight font-[900] tracking-tight text-white sm:text-2xl md:text-3xl">
                {currentTicket.holderName}
              </h2>
            </motion.div>

            <motion.div
              variants={reveal(0.18, 0, 0.8)}
              className="my-4 h-px w-20 bg-white/25 sm:my-5"
            />

            <motion.div
              variants={reveal(0.22, 6)}
              className="flex flex-col items-center"
            >
              <p className="mb-1.5 text-[9px] font-black tracking-[0.2em] text-white/50 uppercase sm:text-[10px]">
                {"Ticket ID"}
              </p>
              <p className="text-center text-sm font-bold tracking-wide text-white">
                {currentTicket.ticketNumber}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
