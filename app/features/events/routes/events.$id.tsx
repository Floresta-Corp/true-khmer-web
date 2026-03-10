import { useLoaderData } from "react-router";
import type { Route } from "./+types/events.$id";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Footer } from "~/components/footer";
import { getEventById } from "~/features/events/lib/events.server";
import {
  formatEventType,
  CATEGORY_COLORS_LIGHT,
} from "~/features/events/lib/event-formatters";
import { EventDetailHero } from "~/features/events/components/event-detail-hero";
import { EventDetailSidebar } from "~/features/events/components/event-detail-sidebar";
import { EventTicketList } from "~/features/events/components/event-ticket-list";

export async function loader({ request, params }: Route.LoaderArgs) {
  return await getEventById(request, params.id);
}

export function meta() {
  return [{ title: "Events | True Khmer" }];
}

export default function EventDetailPage() {
  const { event, ticketTiers, organizer, error } =
    useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<"tickets" | "info">("info");

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-red-900 text-lg mb-2">
              Event Not Found
            </h3>
            <p className="text-red-600 text-sm mb-6">
              {error || "The event you are looking for does not exist."}
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const heroImage = event.cover || event.thumbnail;
  const badgeColor =
    CATEGORY_COLORS_LIGHT[event.eventType] || "bg-gray-100 text-gray-700";

  const photos = event.photos || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Link>
      </div>

      {/* Hero Image */}
      <EventDetailHero event={event} />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Title + Badge */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              {event.title}
            </h1>
            <Badge
              className={`${badgeColor} border-0 text-xs font-semibold rounded-md px-3 py-1 uppercase tracking-wider`}
            >
              {formatEventType(event.eventType)}
            </Badge>

            {/* Tabs */}
            <div className="flex items-center gap-6 mt-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("tickets")}
                className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "tickets"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Get Tickets
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === "info"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                More Info
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "info" && (
              <div className="mt-6 space-y-5">
                {/* About this event */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">About this event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {event.description &&
                    event.description !== "<p></p>" &&
                    event.description.replace(/<[^>]*>/g, "").trim() ? (
                      <div
                        className="prose prose-sm prose-gray max-w-none text-sm text-muted-foreground leading-relaxed [&>p]:mb-2 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-1.5 [&>h2]:mt-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
                        dangerouslySetInnerHTML={{
                          __html: event.description,
                        }}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No description provided for this event.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Gallery */}
                {photos.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo: string, index: number) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden bg-muted"
                          >
                            <img
                              src={photo}
                              alt={`${event.title} photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "tickets" && (
              <EventTicketList
                ticketTiers={ticketTiers}
                ticketStatus={event.ticketStatus}
                price={event.price}
                heroImage={heroImage}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <EventDetailSidebar event={event} organizer={organizer} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
