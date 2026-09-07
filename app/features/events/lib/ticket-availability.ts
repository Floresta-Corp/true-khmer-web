import type { EventTicket } from "../types/events";

const saleDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Phnom_Penh",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function describeTicketAvailability(
  ticket: Pick<EventTicket, "isSoldOut" | "saleStartAt" | "saleEndAt">,
  now: number,
): { label: string; isOnSale: boolean } {
  if (ticket.isSoldOut) return { label: "Sold out", isOnSale: false };

  const start = ticket.saleStartAt ? Date.parse(ticket.saleStartAt) : null;
  const end = ticket.saleEndAt ? Date.parse(ticket.saleEndAt) : null;
  if (
    (start !== null && !Number.isFinite(start)) ||
    (end !== null && !Number.isFinite(end)) ||
    (start !== null && end !== null && end <= start)
  ) {
    return { label: "Sale dates unavailable", isOnSale: false };
  }

  if (end !== null && now >= end) {
    return { label: "Sales ended", isOnSale: false };
  }

  if (start !== null && now < start) {
    const range = end !== null ? ` to ${saleDateFormatter.format(end)}` : "";
    return {
      label: `Available from ${saleDateFormatter.format(start)}${range} (ICT)`,
      isOnSale: false,
    };
  }

  return { label: "Available now", isOnSale: true };
}
