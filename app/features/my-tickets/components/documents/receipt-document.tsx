import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import type { MyTicket, Ticket } from "../../types";

const PURPLE = "#091ffb";
const GRAY_50 = "#f9fafb";
const GRAY_100 = "#f3f4f6";
const GRAY_600 = "#4b5563";
const GRAY_900 = "#111827";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: GRAY_100,
  },
  logo: {
    width: 120,
    height: 28,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: GRAY_900,
  },
  subtitle: {
    fontSize: 14,
    color: GRAY_600,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: GRAY_900,
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  rowAlt: {
    backgroundColor: GRAY_50,
  },
  label: {
    fontSize: 12,
    color: GRAY_600,
    flex: 1,
  },
  value: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: GRAY_900,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: PURPLE,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  eventCard: {
    backgroundColor: GRAY_50,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: GRAY_900,
    marginBottom: 8,
  },
  eventDetail: {
    fontSize: 11,
    color: GRAY_600,
    marginBottom: 4,
  },
  ticketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_100,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: GRAY_900,
  },
  ticketDetails: {
    fontSize: 10,
    color: GRAY_600,
    marginTop: 2,
  },
  ticketPriceWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  ticketPrice: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: GRAY_900,
    textAlign: "right",
  },
  ticketPriceOriginal: {
    fontSize: 10,
    color: GRAY_600,
    textDecoration: "line-through",
    textAlign: "right",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: GRAY_100,
    textAlign: "center",
  },
  footerText: {
    fontSize: 10,
    color: GRAY_600,
  },
});

interface Props {
  data: MyTicket;
  logoSrc?: string;
}

export default function ReceiptDocument({
  data,
  logoSrc = "/plumpiLogo.png",
}: Props) {
  const { event, tickets } = data;

  const formatDate = (dateStr: string) => {
    return !dateStr || Number.isNaN(new Date(dateStr).getTime())
      ? "Unavailable"
      : format(new Date(dateStr), "MMMM dd, yyyy");
  };

  const formatDateTime = (dateStr: string) => {
    return !dateStr || Number.isNaN(new Date(dateStr).getTime())
      ? "Unavailable"
      : format(new Date(dateStr), "MMMM dd, yyyy 'at' h:mm a");
  };

  const orderGroups = tickets.reduce(
    (acc, ticket) => {
      const orderKey =
        ticket.order?.id ||
        ticket.order?.orderNumber ||
        `${ticket.order?.totalAmount}-${ticket.order?.discountAmount}`;
      if (!acc[orderKey]) {
        acc[orderKey] = {
          tickets: [],
          subtotal: Number(
            ticket.order?.subtotal || ticket.order?.totalAmount || 0,
          ),
          totalAmount: Number(ticket.order?.totalAmount || 0),
          discountAmount: Number(ticket.order?.discountAmount || 0),
          orderNumber: ticket.order?.orderNumber || "Unavailable",
          createdAt: ticket.order?.createdAt || "",
        };
      }
      acc[orderKey].tickets.push(ticket);
      return acc;
    },
    {} as Record<
      string,
      {
        tickets: Ticket[];
        subtotal: number;
        totalAmount: number;
        discountAmount: number;
        orderNumber: string;
        createdAt: string;
      }
    >,
  );

  const orders = Object.values(orderGroups);

  // Prefer per-ticket price snapshots so the line items, subtotal, discount and
  // total always reconcile (Σ finalPrice === total, Σ originalPrice ===
  // subtotal). Falls back to order-level figures for older API responses that
  // don't carry per-ticket prices.
  const priceBreakdown = (
    group: { tickets: Ticket[] } & {
      subtotal: number;
      totalAmount: number;
      discountAmount: number;
    },
  ) => {
    const priced = group.tickets.filter((t) => t.price);
    if (priced.length > 0 && priced.length === group.tickets.length) {
      const subtotal = priced.reduce(
        (sum, t) => sum + Number(t.price?.originalPrice ?? 0),
        0,
      );
      const totalAmount = priced.reduce(
        (sum, t) => sum + Number(t.price?.finalPrice ?? 0),
        0,
      );
      return { subtotal, totalAmount, discountAmount: subtotal - totalAmount };
    }
    return {
      subtotal: group.subtotal,
      totalAmount: group.totalAmount,
      discountAmount: group.discountAmount,
    };
  };

  const grandTotal = orders.reduce(
    (sum, order) => sum + priceBreakdown(order).totalAmount,
    0,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Receipt</Text>
            <Text style={styles.subtitle}>Order Summary</Text>
          </View>
          <Image style={styles.logo} src={logoSrc} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Information</Text>

          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetail}>
              Date: {formatDate(event.startAt)} - {formatDate(event.endAt)}
            </Text>
            {event.venue && (
              <Text style={styles.eventDetail}>
                Venue: {event.venue.name}, {event.venue.address}
              </Text>
            )}
            {event.location && (
              <Text style={styles.eventDetail}>Location: {event.location}</Text>
            )}
            {event.isOnline && (
              <Text style={styles.eventDetail}>Online Event</Text>
            )}
          </View>
        </View>

        {orders.map((order, orderIndex) => {
          const { subtotal, discountAmount, totalAmount } =
            priceBreakdown(order);

          return (
            <View key={orderIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>
                Order #{order.orderNumber}
              </Text>

              <View style={styles.row}>
                <Text style={styles.label}>Order Date</Text>
                <Text style={styles.value}>
                  {formatDateTime(order.createdAt)}
                </Text>
              </View>

              {order.tickets.map((ticket, ticketIndex) => {
                // Prefer the per-ticket price snapshot; fall back to evenly
                // splitting the order subtotal for older API responses.
                const finalPrice = ticket.price
                  ? Number(ticket.price.finalPrice)
                  : subtotal / order.tickets.length;
                const originalPrice = ticket.price
                  ? Number(ticket.price.originalPrice)
                  : finalPrice;
                const isDiscounted = originalPrice > finalPrice;

                return (
                  <View
                    key={ticket.id}
                    style={[
                      styles.ticketItem,
                      ...(ticketIndex % 2 === 1 ? [styles.rowAlt] : []),
                    ]}
                  >
                    <View style={styles.ticketInfo}>
                      <Text style={styles.ticketName}>{ticket.tier.name}</Text>
                      <Text style={styles.ticketDetails}>
                        Holder: {ticket.holderName} • ID: {ticket.ticketNumber}
                      </Text>
                    </View>
                    <View style={styles.ticketPriceWrap}>
                      {isDiscounted && (
                        <Text style={styles.ticketPriceOriginal}>
                          ${originalPrice.toFixed(2)}
                        </Text>
                      )}
                      <Text style={styles.ticketPrice}>
                        ${finalPrice.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })}
              <View style={styles.row}>
                <Text style={styles.label}>
                  Subtotal ({order.tickets.length} tickets)
                </Text>
                <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
              </View>

              {discountAmount > 0 && (
                <View style={[styles.row, styles.rowAlt]}>
                  <Text style={styles.label}>Discount</Text>
                  <Text style={styles.value}>
                    -${discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}

        {orders.length > 1 && (
          <View style={styles.section}>
            <View style={[styles.totalRow, { backgroundColor: GRAY_900 }]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your purchase! This is your official receipt.
          </Text>
          <Text style={styles.footerText}>
            For support, please contact us at support@plumpievents.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
