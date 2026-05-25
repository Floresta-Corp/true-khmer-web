import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Calendar, Ticket } from "lucide-react";
import BackToButton from "~/components/back-to-button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { resolveImageURL } from "~/lib/utils";

type TicketItem = {
  id: string;
  title: string;
  date: string;
  timeRange?: string;
  location?: string;
  cover?: string | null;
  qty?: number;
};

const SAMPLE_TICKETS: TicketItem[] = [
  {
    id: "1",
    title: "INNOPROM. Saudi Arabia 2026",
    date: "Dec 12, 2026",
    timeRange: "6:00 PM - 11:00 PM",
    location: "CISS School Koh Pich, Phnom Penh",
    cover: "/images/placeholder/event-1.jpg",
    qty: 2,
  },
  {
    id: "2",
    title: "INNOPROM. Saudi Arabia 2026",
    date: "Dec 12, 2026",
    timeRange: "6:00 PM - 11:00 PM",
    location: "CISS School Koh Pich, Phnom Penh",
    cover: "/images/placeholder/event-1.jpg",
    qty: 2,
  },
  {
    id: "3",
    title: "INNOPROM. Saudi Arabia 2026",
    date: "Dec 12, 2026",
    timeRange: "6:00 PM - 11:00 PM",
    location: "CISS School Koh Pich, Phnom Penh",
    cover: "/images/placeholder/event-1.jpg",
    qty: 2,
  },
  {
    id: "4",
    title: "INNOPROM. Saudi Arabia 2026",
    date: "Dec 12, 2026",
    timeRange: "6:00 PM - 11:00 PM",
    location: "CISS School Koh Pich, Phnom Penh",
    cover: "/images/placeholder/event-1.jpg",
    qty: 2,
  },
];

function TicketCard({ ticket }: { ticket: TicketItem }) {
  return (
    <Card className="rounded-2xl border-[#E2EAF5] bg-white shadow-none">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-stretch gap-3 sm:gap-4">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-36">
            {ticket.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageURL(ticket.cover)}
                alt={ticket.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-300" />
              </div>
            )}
          </div>

          <div className="my-1 hidden w-px shrink-0 self-stretch border-r border-dashed border-[#D8E3F4] sm:block" />

          <div className="flex min-w-0 flex-1 flex-col justify-between py-1 sm:py-2">
            <div className="text-xs font-medium text-[#2F6FE4] sm:text-sm">
              {ticket.date}
              {ticket.timeRange ? ` • ${ticket.timeRange}` : ""}
            </div>
            <h3 className="mt-2 max-w-md text-[22px] font-bold leading-[1.18] tracking-tight text-[#111827] sm:text-[26px]">
              {ticket.title}
            </h3>
            {ticket.location && (
              <p className="mt-2 text-[13px] text-[#6B7280] sm:text-sm">
                {ticket.location}
              </p>
            )}

            <div className="mt-5">
              <Badge className="w-fit rounded-lg bg-[#EEF2FF] px-3 py-1.5 text-sm font-medium text-[#2F6FE4] hover:bg-[#EEF2FF]">
                <span className="inline-flex items-center gap-1.5">
                  <Ticket className="h-4 w-4" />x{ticket.qty ?? 1}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyTicketPage() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const tickets = SAMPLE_TICKETS;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          className="flex items-center justify-between"
        >
          <BackToButton to="/" />
          <div />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.03,
          }}
          className="mt-6"
        >
          <h1 className="text-2xl font-bold text-[#0F1724]">My Tickets</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Keep track of your submitted applications and event involvement
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-1 rounded-full text-sm font-semibold ${activeTab === "upcoming" ? "bg-blue-500 text-white" : "bg-white text-[#6B7280] border"}`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`px-4 py-1 rounded-full text-sm font-semibold ${activeTab === "past" ? "bg-blue-500 text-white" : "bg-white text-[#6B7280] border"}`}
            >
              Past
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {tickets.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
              >
                <TicketCard ticket={t} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export function meta() {
  return [{ title: "My Tickets | True Khmer" }];
}
