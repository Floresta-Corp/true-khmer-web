export interface Venue {
  name: string;
  city: string;
  address: string;
}

export interface TicketTier {
  name: string;
}

export interface TicketStatus {
  isValid: boolean;
  isUsed: boolean;
}

export interface EventSummary {
  eventId: string;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  thumbnail: string;
  isOnline: boolean;
  ticketCount: number;
  venue: Venue;
}
export interface Order {
  id?: string;
  discountAmount: string;
  subtotal: string;
  totalAmount: string;
  orderNumber?: string;
  createdAt?: string;
}

// Per-ticket price snapshot (what was actually paid for THIS single ticket),
// as opposed to the whole-order `order.totalAmount` or the tier's `basePrice`.
export interface TicketPrice {
  finalPrice: string;
  originalPrice: string;
  discount: string;
  fees: string;
  currencyCode: string;
}
export interface Ticket {
  id: string;
  ticketNumber: string;
  qrUrl: string;
  holderName: string;
  holderEmail: string;
  cover: string;
  tier: TicketTier;
  // Per-ticket price; preferred over `tier.basePrice` / `order.totalAmount`.
  // Optional for backward compatibility with older API responses.
  price?: TicketPrice;
  status: TicketStatus;
  order: Order;
}

export type TicketEvent = Omit<EventSummary, "eventId" | "ticketCount">;

export interface MyTicket {
  event: TicketEvent;
  tickets: Ticket[];
}
