import {
  CheckCircle2,
  FileText,
  Loader2,
  Receipt,
  Ticket as TicketIcon,
} from "lucide-react";

import type { Ticket } from "../types";

interface Props {
  tickets: Ticket[];
  recieptDownloadState: "idle" | "preparing" | "success";
  onDownloadReciept: () => void;
}

export default function TicketSummary(props: Props) {
  const { tickets, recieptDownloadState, onDownloadReciept } = props;

  type LineItem = {
    name: string;
    quantity: number;
    unitFinal: number;
    unitOriginal: number;
    lineTotal: number;
  };

  const allPriced = tickets.length > 0 && tickets.every((t) => t.price);

  // Group line items by tier + unit price so each row represents one kind of
  // ticket ("4x Normal Seat @ $2.00 = $8.00"), computed from the per-ticket
  // finalPrice. Grouping by order total would mix tiers and mislabel rows.
  const tierLines = (): LineItem[] => {
    const groups = tickets.reduce(
      (acc, ticket) => {
        const unitFinal = Number(ticket.price?.finalPrice ?? 0);
        const unitOriginal = Number(ticket.price?.originalPrice ?? unitFinal);
        const name = ticket.tier?.name ?? "Ticket";
        const key = `${name}-${unitFinal}-${unitOriginal}`;
        if (!acc[key]) {
          acc[key] = {
            name,
            quantity: 0,
            unitFinal,
            unitOriginal,
            lineTotal: 0,
          };
        }
        acc[key].quantity += 1;
        acc[key].lineTotal += unitFinal;
        return acc;
      },
      {} as Record<string, LineItem>,
    );
    return Object.values(groups);
  };

  // Legacy fallback for older API responses without per-ticket prices: group by
  // order total and split it evenly, preserving the previous behaviour.
  const orderLines = (): LineItem[] => {
    const groups = tickets.reduce(
      (acc, ticket) => {
        const key =
          ticket.order?.id ||
          ticket.order?.orderNumber ||
          `${ticket.order?.totalAmount}-${ticket.order?.discountAmount}`;
        if (!acc[key]) {
          acc[key] = {
            name: ticket.tier?.name ?? "Ticket",
            quantity: 0,
            unitFinal: 0,
            unitOriginal: 0,
            lineTotal: Number(ticket.order?.totalAmount || 0),
          };
        }
        acc[key].quantity += 1;
        return acc;
      },
      {} as Record<string, LineItem>,
    );
    return Object.values(groups).map((line) => ({
      ...line,
      unitFinal: line.lineTotal / (line.quantity || 1),
      unitOriginal: line.lineTotal / (line.quantity || 1),
    }));
  };

  const lineItems = allPriced ? tierLines() : orderLines();
  const grandTotal = lineItems.reduce((sum, line) => sum + line.lineTotal, 0);

  return (
    <>
      <div className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2443ff]/8 text-[#2443ff] sm:h-12 sm:w-12">
          <Receipt size={20} className="sm:hidden" />
          <Receipt size={24} className="hidden sm:block" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#111928] sm:text-2xl">
            {"Order Summary"}
          </h2>
          <p className="text-xs font-bold tracking-widest text-[#667085] uppercase">
            {"Total Tickets:"} {tickets.length}
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
          {lineItems.map((line, index) => {
            const unitDiscounted = line.unitOriginal > line.unitFinal;

            return (
              <div
                key={`${line.name}-${line.unitFinal}-${index}`}
                className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-6 ${
                  index < lineItems.length - 1
                    ? "border-b border-[#e2e8f0]"
                    : ""
                } bg-[#f9fafb]`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#2443ff] sm:h-10 sm:w-10">
                    <TicketIcon size={16} className="sm:hidden" />
                    <TicketIcon size={18} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0">
                    <p className="grid grid-cols-[auto_1fr] gap-x-1 text-sm font-bold">
                      <span className="whitespace-nowrap">
                        {line.quantity} x
                      </span>
                      <span className="line-clamp-2 min-w-0 overflow-hidden break-words text-ellipsis">
                        {line.name}
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[10px] font-bold tracking-widest text-[#667085] uppercase">
                      {unitDiscounted && (
                        <span className="line-through">
                          ${line.unitOriginal.toFixed(2)}
                        </span>
                      )}
                      <span>
                        ${line.unitFinal.toFixed(2)} {"each"}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-black sm:text-right">
                  ${line.lineTotal.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {lineItems.length > 0 && (
          <div className="flex items-center justify-between gap-4 border-t-2 border-dashed border-[#e2e8f0] px-2 py-4 sm:px-4 sm:py-6">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#667085] uppercase sm:text-xs">
              {"Total Amount"}
            </span>
            <span className="text-2xl font-black tracking-tighter text-[#2443ff] sm:text-3xl">
              ${grandTotal.toFixed(2)}
            </span>
          </div>
        )}

        <div className="mt-4 sm:mt-8">
          <button
            type="button"
            onClick={onDownloadReciept}
            disabled={recieptDownloadState !== "idle"}
            className={`group flex h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl text-[15px] font-bold transition-colors ${
              recieptDownloadState === "success"
                ? "bg-emerald-500 text-white"
                : "bg-[#2443ff] text-white hover:bg-[#001ed2]"
            }`}
          >
            {recieptDownloadState === "idle" ? (
              <>
                <FileText size={18} /> {"Download Full Receipt"}
              </>
            ) : recieptDownloadState === "preparing" ? (
              <>
                <Loader2 size={18} className="animate-spin" />{" "}
                {"Generating Receipt..."}
              </>
            ) : (
              <>
                <CheckCircle2 size={18} className="animate-in zoom-in" />{" "}
                {"Receipt Saved"}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
