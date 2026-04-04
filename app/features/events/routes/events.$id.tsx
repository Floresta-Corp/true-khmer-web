import { useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/events.$id";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
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
            <Button
              onClick={goBack}
              variant="ghost"
              className="h-auto px-0 py-0 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button
          onClick={goBack}
          variant="ghost"
          className="h-auto px-0 py-0 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Button>
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
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={() => setActiveTab("tickets")}
                className={`relative pb-1.5 text-sm font-semibold transition-colors cursor-pointer bg-transparent ${
                  activeTab === "tickets"
                    ? "text-[#2f6fe4]"
                    : "text-[#9eacc0] hover:text-[#344256]"
                }`}
              >
                Get Tickets
                {activeTab === "tickets" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f6fe4] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`relative pb-1.5 text-sm font-semibold transition-colors cursor-pointer bg-transparent ${
                  activeTab === "info"
                    ? "text-[#2f6fe4]"
                    : "text-[#9eacc0] hover:text-[#344256]"
                }`}
              >
                More Info
                {activeTab === "info" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f6fe4] rounded-full" />
                )}
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
                      <SanitizedHtml
                        html={event.description}
                        className="prose prose-sm prose-gray max-w-none text-sm text-muted-foreground leading-relaxed [&>p]:mb-2 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-1.5 [&>h2]:mt-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
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
              </div>
            )}

            {activeTab === "tickets" && (
              <EventTicketList
                ticketTiers={ticketTiers}
                ticketStatus={event.ticketStatus}
                price={event.price}
                heroImage={heroImage}
                eventName={event.slug}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <EventDetailSidebar event={event} organizer={organizer} />
        </div>
      </div>
    </div>
  );
}
