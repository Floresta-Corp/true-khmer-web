import { useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/events.$id";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ImageGallery } from "~/components/image-lightbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SanitizedHtml } from "~/components/sanitized-html";
import { getEventById } from "~/features/events/lib/events.server";
import {
  formatEventType,
  CATEGORY_COLORS_LIGHT,
} from "~/features/events/lib/event-formatters";
import { EventDetailHero } from "~/features/events/components/event-detail-hero";
import { EventDetailSidebar } from "~/features/events/components/event-detail-sidebar";
import { EventTicketList } from "~/features/events/components/event-ticket-list";
import BackToButton from "~/components/back-to-button";

export async function loader({ request, params }: Route.LoaderArgs) {
  return await getEventById(request, params.id);
}

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

export default function EventDetailPage() {
  const { event, ticketTiers, organizer, error } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"tickets" | "info">("info");
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/events");
    }
  };

  const photos: string[] = event?.photos || [];

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />
            <h3 className="mb-2 text-lg font-bold text-red-900">
              Event Not Found
            </h3>
            <p className="mb-6 text-sm text-red-600">
              {error || "The event you are looking for does not exist."}
            </p>
            <Button
              onClick={goBack}
              variant="ghost"
              className="inline-flex h-auto cursor-pointer items-center gap-2 px-0 py-0 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const heroImage = event.cover || event.thumbnail;
  const badgeColor =
    CATEGORY_COLORS_LIGHT[event.eventType] || "bg-gray-100 text-gray-700";

  return (
    <motion.div
      className="min-h-screen bg-gray-50 font-sans"
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
    >
      {/* Back link */}
      <motion.div
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8"
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: prefersReducedMotion ? 0 : 0.22, delay: 0.03 }}
      >
        <BackToButton to="/events" />
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: prefersReducedMotion ? 0 : 0.28, delay: 0.06 }}
      >
        <EventDetailHero event={event} />
      </motion.div>

      {/* Content */}
      <motion.div
        className="mx-auto mt-8 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column */}
          <div className="min-w-0 flex-1">
            {/* Title + Badge */}
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {event.title}
            </h1>
            <Badge
              className={`${badgeColor} rounded-md border-0 px-3 py-1 text-xs font-semibold tracking-wider uppercase`}
            >
              {formatEventType(event.eventType)}
            </Badge>

            {/* Tabs */}
            <div className="mt-8 flex items-center gap-6">
              <button
                onClick={() => setActiveTab("tickets")}
                className={`relative cursor-pointer bg-transparent pb-1.5 text-sm font-semibold transition-colors ${
                  activeTab === "tickets"
                    ? "text-[#2f6fe4]"
                    : "text-[#9eacc0] hover:text-[#344256]"
                }`}
              >
                Get Tickets
                {activeTab === "tickets" && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[#2f6fe4]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`relative cursor-pointer bg-transparent pb-1.5 text-sm font-semibold transition-colors ${
                  activeTab === "info"
                    ? "text-[#2f6fe4]"
                    : "text-[#9eacc0] hover:text-[#344256]"
                }`}
              >
                More Info
                {activeTab === "info" && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-[#2f6fe4]" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "info" ? (
                <motion.div
                  key="info"
                  className="mt-6 space-y-5"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  {/* About this event */}
                  <Card className="rounded-2xl shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        About this event
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {event.description &&
                      event.description !== "<p></p>" &&
                      event.description.replace(/<[^>]*>/g, "").trim() ? (
                        <SanitizedHtml
                          html={event.description}
                          className="prose prose-sm prose-gray max-w-none text-sm leading-relaxed text-muted-foreground [&>h1]:mb-2 [&>h1]:text-lg [&>h1]:font-bold [&>h2]:mt-4 [&>h2]:mb-1.5 [&>h2]:text-base [&>h2]:font-semibold [&>ol]:list-decimal [&>ol]:pl-4 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No description provided for this event.
                        </p>
                      )}
                      {photos.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <div className="pt-10 text-lg font-semibold">
                            Gallery
                          </div>
                          <ImageGallery
                            images={photos}
                            alt={`${event.title} photo`}
                            columns={3}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  <EventTicketList
                    ticketTiers={ticketTiers}
                    ticketStatus={event.ticketStatus}
                    price={event.price}
                    heroImage={heroImage}
                    eventName={event.slug}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              delay: 0.12,
            }}
          >
            <EventDetailSidebar event={event} organizer={organizer} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
