import { Check, Download, Receipt, Loader2 } from "lucide-react";
import { useState } from "react";
import type { MyTicket } from "../types";

import { downloadTickets } from "../lib/ticket-download.client";

type DownloadState = "idle" | "preparing" | "success";

export default function DownloadSection({
  onShowSummary,
  ticketData,
}: {
  onShowSummary: () => void;
  ticketData: MyTicket;
}) {
  const [error, setError] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [showSelection, setShowSelection] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { tickets } = ticketData;
  const isMultiTicket = tickets.length > 1;
  const allSelected = selectedIds.length === tickets.length;

  const toggleTicket = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : tickets.map((t) => t.id));
  };

  const handleDownload = async (ids: string[]) => {
    if (downloadState !== "idle" || ids.length === 0) return;
    setDownloadState("preparing");

    try {
      setError(null);
      await downloadTickets(ticketData, ids);
      setDownloadState("success");
      setTimeout(() => {
        setDownloadState("idle");
        setSelectedIds([]);
        setShowSelection(false);
      }, 3000);
    } catch {
      setError("Unable to download tickets. Please try again.");
      setDownloadState("idle");
    }
  };

  /* A single-ticket order has nothing to choose between, so it downloads
     straight away; a multi-ticket order opens the picker first. */
  const handleDownloadClick = () => {
    const first = tickets[0];
    if (!isMultiTicket) {
      if (first) void handleDownload([first.id]);
      return;
    }
    setSelectedIds(tickets.map((t) => t.id));
    setShowSelection(true);
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {showSelection ? (
        <div className="flex animate-in flex-col gap-3 rounded-2xl border border-[#e2e8f0] p-3 duration-200 fade-in slide-in-from-bottom-2 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-[#111928]">
              {"Select tickets to download"}
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="cursor-pointer text-xs font-semibold text-[#2443ff] hover:underline"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
            {tickets.map((ticket, i) => {
              const selected = selectedIds.includes(ticket.id);
              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => toggleTicket(ticket.id)}
                  aria-pressed={selected}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all sm:px-4 sm:py-3 ${
                    selected
                      ? "border-[#2443ff] bg-[#2443ff]/5"
                      : "border-[#e2e8f0] hover:border-[#2443ff]/40"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-[#111928]">
                      {`Ticket ${i + 1} · ${ticket.tier.name}`}
                    </span>
                    <span className="block truncate text-xs text-[#667085]">
                      {ticket.ticketNumber}
                    </span>
                  </span>
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                      selected
                        ? "border-[#2443ff] bg-[#2443ff] text-white"
                        : "border-[#d0d5dd]"
                    }`}
                  >
                    {selected && <Check size={13} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-1 flex gap-2.5">
            <button
              type="button"
              onClick={() => setShowSelection(false)}
              className="h-12 flex-1 cursor-pointer rounded-xl border border-[#e2e8f0] text-sm font-bold text-[#1f2a37] transition-all hover:bg-[#f9fafb]"
            >
              {"Cancel"}
            </button>
            <button
              type="button"
              onClick={() => handleDownload(selectedIds)}
              disabled={selectedIds.length === 0 || downloadState !== "idle"}
              className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2443ff] text-sm font-bold text-white transition-all hover:bg-[#001ed2] disabled:pointer-events-none disabled:bg-[#d0d5dd]"
            >
              {downloadState === "preparing" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {"Generating…"}
                </>
              ) : downloadState === "success" ? (
                <>
                  <Check size={16} strokeWidth={3} />
                  {"PDF saved"}
                </>
              ) : (
                <>
                  <Download size={16} />
                  {`Download (${selectedIds.length})`}
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleDownloadClick}
          disabled={!isMultiTicket && downloadState !== "idle"}
          className="flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#2443ff] text-[15px] font-bold text-white shadow-sm transition-all hover:bg-[#001ed2] disabled:pointer-events-none disabled:bg-[#d0d5dd]"
        >
          {!isMultiTicket && downloadState === "preparing" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {"Generating PDF…"}
            </>
          ) : !isMultiTicket && downloadState === "success" ? (
            <>
              <Check size={18} strokeWidth={3} />
              {"PDF saved"}
            </>
          ) : (
            <>
              <Download size={18} />
              {isMultiTicket ? "Download Tickets" : "Download Ticket"}
            </>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={onShowSummary}
        className="flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[#2443ff] bg-white text-[15px] font-bold text-[#111928] transition-all hover:bg-[#2443ff]/5"
      >
        <Receipt size={18} className="text-[#2443ff]" />
        {"View Payment Summary"}
      </button>
    </div>
  );
}
