import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";

import type { MyTicket } from "../types";
import DownloadSection from "./download-section";
import TicketDetails from "./ticket-details";
import TicketSummary from "./ticket-summary";
import TicketViewer from "./ticket-viewer";
import { Modal } from "./modal";
import { downloadReceipt } from "../lib/ticket-download.client";

type DownloadState = "idle" | "preparing" | "success";
type MobilePane = "ticket" | "details";

interface Props {
  data: MyTicket;
  onClose: () => void;
}

export default function TicketModal({ data, onClose }: Props) {
  const { event, tickets } = data;
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [mobilePane, setMobilePane] = useState<MobilePane>("ticket");
  const [receiptDownloadState, setReceiptDownloadState] =
    useState<DownloadState>("idle");

  const currentTicket = tickets[currentTicketIndex];
  const totalTickets = tickets.length;
  const hasPendingTickets = tickets.some((ticket) => !ticket.qrUrl);

  if (!currentTicket) return null;

  const switchTicket = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTicketIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const handleShowSummary = () => {
    setShowSummary(true);
  };

  const pendingNotice = (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e2e8f0] bg-[#f9fafb] px-4 py-10 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#2443ff]" />
      <p className="max-w-xs text-sm text-[#667085]">
        {
          "Some tickets in this order are still being generated. Ticket details and downloads will be available once every QR code is ready."
        }
      </p>
    </div>
  );

  const handleDownloadReceipt = async () => {
    if (receiptDownloadState !== "idle") return;
    setReceiptDownloadState("preparing");

    try {
      setDownloadError(null);
      await downloadReceipt(data);
      setReceiptDownloadState("success");
      setTimeout(() => setReceiptDownloadState("idle"), 3000);
    } catch (err) {
      setDownloadError("Unable to download the receipt. Please try again.");
      setReceiptDownloadState("idle");
    }
  };

  return (
    <Modal onClose={onClose}>
      {downloadError && (
        <p
          role="alert"
          className="absolute right-4 bottom-2 left-4 z-30 rounded-xl bg-red-50 p-3 text-red-700"
        >
          {downloadError}
        </p>
      )}

      {/* Mobile layout */}
      <div className="flex flex-col overflow-y-auto md:hidden">
        <div className="px-4 pt-14 pb-4">
          <div className="grid grid-cols-2 rounded-full border border-[#e2e8f0] bg-[#f9fafb] p-1">
            {(
              [
                ["ticket", "Ticket"],
                ["details", "Event Details"],
              ] as const
            ).map(([pane, label]) => (
              <button
                key={pane}
                type="button"
                onClick={() => setMobilePane(pane)}
                className={`rounded-full px-3 py-2 text-[10px] font-black tracking-[0.16em] uppercase transition-all ${
                  mobilePane === pane
                    ? "bg-[#2443ff] text-white shadow-sm"
                    : "text-[#667085]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          {mobilePane === "ticket" ? (
            <div className="overflow-hidden rounded-3xl">
              <TicketViewer
                thumbnail={event.thumbnail}
                tickets={tickets}
                currentTicketIndex={currentTicketIndex}
                currentTicket={currentTicket}
                totalTickets={totalTickets}
                isTransitioning={isTransitioning}
                showSummary={showSummary}
                onSwitchTicket={switchTicket}
              />
            </div>
          ) : (
            <div className="max-h-[calc(100dvh-11rem)] overflow-y-auto rounded-3xl border border-[#e2e8f0] bg-white p-4">
              {hasPendingTickets ? (
                pendingNotice
              ) : !showSummary ? (
                <div className="flex flex-col">
                  <TicketDetails event={event} />
                  <div className="pt-2">
                    <DownloadSection
                      onShowSummary={handleShowSummary}
                      ticketData={data}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setShowSummary(false)}
                    className="mb-4 flex cursor-pointer items-center gap-2 text-sm font-bold text-[#667085] transition-colors hover:text-[#2443ff]"
                  >
                    <ArrowLeft size={16} /> {"Back to Details"}
                  </button>
                  <TicketSummary
                    tickets={tickets}
                    recieptDownloadState={receiptDownloadState}
                    onDownloadReciept={handleDownloadReceipt}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden w-full min-w-0 overflow-hidden md:flex">
        <TicketViewer
          thumbnail={event.thumbnail}
          tickets={tickets}
          currentTicketIndex={currentTicketIndex}
          currentTicket={currentTicket}
          totalTickets={totalTickets}
          isTransitioning={isTransitioning}
          showSummary={showSummary}
          onSwitchTicket={switchTicket}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-white p-5 sm:p-8 md:p-10">
          {hasPendingTickets ? (
            <div className="flex flex-1 animate-in items-center justify-center duration-300 fade-in slide-in-from-right-4">
              {pendingNotice}
            </div>
          ) : !showSummary ? (
            <>
              <div className="flex-1 animate-in duration-300 fade-in slide-in-from-right-4">
                <TicketDetails event={event} />
              </div>
              <div className="mt-auto pt-6">
                <DownloadSection
                  onShowSummary={handleShowSummary}
                  ticketData={data}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 animate-in duration-300 fade-in slide-in-from-left-4">
              <button
                type="button"
                onClick={() => setShowSummary(false)}
                className="mb-8 flex cursor-pointer items-center gap-2 text-sm font-bold text-[#667085] transition-colors hover:text-[#2443ff]"
              >
                <ArrowLeft size={16} /> {"Back to Details"}
              </button>
              <TicketSummary
                tickets={tickets}
                recieptDownloadState={receiptDownloadState}
                onDownloadReciept={handleDownloadReceipt}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
