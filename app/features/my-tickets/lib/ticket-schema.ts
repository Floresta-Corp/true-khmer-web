import { z } from "zod";
// The generated proxy contract intentionally returns unknown records. Validate
// the Plumpi fields consumed by the UI at the server boundary.
export const eventSummarySchema = z.object({
  eventId: z.string(),
  title: z.string(),
  startAt: z.string().catch(""),
  endAt: z.string().catch(""),
  location: z.string().catch(""),
  thumbnail: z.string().catch(""),
  isOnline: z.boolean().catch(false),
  ticketCount: z.number().catch(0),
  venue: z
    .object({
      name: z.string().catch(""),
      city: z.string().catch(""),
      address: z.string().catch(""),
    })
    .catch({ name: "", city: "", address: "" }),
});
export const ticketDetailsSchema = z.object({
  // Event details omit the identifiers/count returned by the list endpoint.
  event: eventSummarySchema.omit({ eventId: true, ticketCount: true }),
  tickets: z.array(
    z.object({
      id: z.string(),
      ticketNumber: z.string(),
      qrUrl: z.string().catch(""),
      holderName: z.string().catch(""),
      holderEmail: z.string().catch(""),
      cover: z.string().catch(""),
      tier: z.object({ name: z.string() }),
      price: z
        .object({
          finalPrice: z.string(),
          originalPrice: z.string(),
          discount: z.string(),
          fees: z.string(),
          currencyCode: z.string(),
        })
        .nullish()
        .transform((value) => value ?? undefined),
      status: z.object({ isValid: z.boolean(), isUsed: z.boolean() }),
      order: z
        .object({
          id: z.string().optional(),
          orderNumber: z.string().optional(),
          createdAt: z.string().optional(),
          discountAmount: z.string().catch("0"),
          subtotal: z.string().catch("0"),
          totalAmount: z.string().catch("0"),
        })
        .catch({ discountAmount: "0", subtotal: "0", totalAmount: "0" }),
    }),
  ),
});
