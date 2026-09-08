import type { MyTicket } from "../types";

function buildFileName(event: MyTicket["event"], suffix: string) {
  const date = new Date(event.startAt);
  const timestamp = Number.isNaN(date.getTime())
    ? "undated"
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
  const slug =
    event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "event";
  return `${slug}_${timestamp}_${suffix}.pdf`;
}

async function renderer() {
  if (!globalThis.Buffer) {
    const { Buffer } = await import("buffer");
    globalThis.Buffer = Buffer;
  }
  return import("@react-pdf/renderer");
}

function saveFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadTickets(data: MyTicket, ids: string[]) {
  const { pdf } = await renderer();
  const { default: TicketDocument, prepareTicketData } =
    await import("../components/documents/ticket-document");
  const prepared = await prepareTicketData({
    ...data,
    tickets: data.tickets.filter((ticket) => ids.includes(ticket.id)),
  });
  const blob = await pdf(<TicketDocument data={prepared} />).toBlob();
  saveFile(blob, buildFileName(data.event, "tickets"));
}

export async function downloadReceipt(data: MyTicket) {
  const { pdf } = await renderer();
  const { default: ReceiptDocument } =
    await import("../components/documents/receipt-document");
  const blob = await pdf(<ReceiptDocument data={data} />).toBlob();
  saveFile(blob, buildFileName(data.event, "receipt"));
}
