export const EVENT_TYPES = [
  "CONFERENCE",
  "WORKSHOP",
  "SEMINAR",
  "CONCERT",
  "FESTIVAL",
  "EXHIBITION",
  "NETWORKING",
  "TRAINING",
  "WEBINAR",
  "OTHER",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  status: string;
}

export interface TicketTier {
  id: string;
  name: string;
  description: string | null;
  type: "PAID" | "FREE" | string;
  isActive: boolean;
  isVisible: boolean;
  totalQuantity: number;
  soldCount: number;
  availableCount: number;
  minPurchase: number;
  maxPurchase: number;
  basePrice: string | null;
  salePrice: string | null;
  currencyCode: string;
  saleStartAt: string | null;
  saleEndAt: string | null;
  validFrom: string | null;
  validUntil: string | null;
  status: string;
  benefits: string | null;
  cover: string | null;
}

export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  totalEvent: string;
}
