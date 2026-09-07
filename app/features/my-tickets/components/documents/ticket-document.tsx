import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import type { MyTicket } from "../../types";

const PURPLE = "#091ffb";
const PURPLE_LIGHT = "rgba(255,255,255,0.15)";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    backgroundColor: "#f3f4f6",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e5e7eb",
  },

  left: {
    width: 240,
    backgroundColor: PURPLE,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  tierBadge: {
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tierText: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },
  qrBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    width: 130,
    height: 130,
    marginBottom: 16,
  },
  qrImage: {
    width: "100%",
    height: "100%",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 12,
  },
  holderLabel: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Helvetica",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
    textAlign: "center",
  },
  holderName: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  ticketIdLabel: {
    color: "#fff",
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: "center",
  },
  ticketIdValue: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Courier",
    textAlign: "center",
  },

  right: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  brand: {
    color: PURPLE,
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    borderLeftWidth: 3,
    borderLeftColor: PURPLE,
    paddingLeft: 8,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
    fontFamily: "Helvetica",
  },
  fieldValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  fieldSub: {
    fontSize: 10,
    color: "#6b7280",
    fontFamily: "Helvetica",
  },
  brandRow: {
    top: 5,
    marginBottom: 22,
  },
  logoImg: {
    width: 80,
    height: 18,
  },
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function generateQrDataUrl(value: string): Promise<string> {
  try {
    return await QRCode.toDataURL(value, {
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.warn("QR generation failed:", err);
    return "";
  }
}

export async function prepareTicketData(data: MyTicket): Promise<MyTicket> {
  const tickets = await Promise.all(
    data.tickets.map(async (t) => ({
      ...t,
      qrUrl: await generateQrDataUrl(t.id),
    })),
  );
  return { ...data, tickets };
}

interface Props {
  data: MyTicket;
  logoSrc?: string;
  ticketIds?: string[];
}

export default function TicketDocument({
  data,
  ticketIds,
  logoSrc = "/plumpiLogo.png",
}: Props) {
  const { event, tickets } = data;
  const toRender = ticketIds
    ? tickets.filter((t) => ticketIds.includes(t.id))
    : tickets;

  return (
    <Document>
      {toRender.map((ticket) => (
        <Page key={ticket.id} size={[640, 420]} style={styles.page}>
          <View style={styles.card} wrap={false}>
            <View style={styles.left}>
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>
                  {ticket.tier.name.toUpperCase()}
                </Text>
              </View>

              <View style={styles.qrBox}>
                {ticket.qrUrl ? (
                  <Image style={styles.qrImage} src={ticket.qrUrl} />
                ) : null}
              </View>

              <View style={styles.divider} />

              <Text style={styles.holderLabel}>Ticket Holder</Text>
              <Text style={styles.holderName}>{ticket.holderName}</Text>

              <Text style={styles.ticketIdLabel}>Ticket ID</Text>
              <Text style={styles.ticketIdValue}>{ticket.ticketNumber}</Text>
            </View>

            <View style={styles.right}>
              <View style={styles.brandRow}>
                <Image style={styles.logoImg} src={logoSrc} />
              </View>
              <Text style={styles.sectionHeader}>EVENT DETAILS</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Event</Text>
                <Text style={styles.fieldValue}>{event.title}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Schedule</Text>
                <Text style={styles.fieldValue}>
                  {formatDate(event.startAt)}
                </Text>
                <Text style={styles.fieldSub}>
                  {formatTime(event.startAt)} – {formatTime(event.endAt)}
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Venue</Text>
                <Text style={styles.fieldValue}>{event.venue.name}</Text>
                <Text style={styles.fieldSub}>
                  {event.venue.address}, {event.venue.city}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
