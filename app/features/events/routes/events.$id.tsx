import { useLoaderData } from "react-router";
import type { Route } from "./+types/events.$id";
import {
  Calendar,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Heart,
  Share2,
  Flag,
  Globe,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Footer } from "~/components/footer";
import { getEventById } from "~/features/events/lib/events.server";
import type {
  TicketTier,
  Organizer,
} from "~/features/events/lib/events.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  return await getEventById(request, params.id);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatEventType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  NETWORKING: "bg-blue-100 text-blue-700",
  WORKSHOP: "bg-purple-100 text-purple-700",
  CULTURAL: "bg-orange-100 text-orange-700",
  CONCERT: "bg-pink-100 text-pink-700",
  EXHIBITION: "bg-teal-100 text-teal-700",
  CONFERENCE: "bg-indigo-100 text-indigo-700",
  FESTIVAL: "bg-amber-100 text-amber-700",
  SEMINAR: "bg-blue-100 text-blue-700",
};

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
    CATEGORY_COLORS[event.eventType] || "bg-gray-100 text-gray-700";
  const isFree =
    !event.price || event.price === "Free" || parseFloat(event.price) === 0;
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="relative w-full rounded-2xl overflow-hidden bg-gray-200">
          {heroImage ? (
            <img
              src={heroImage}
              alt={event.title}
              className="w-full h-85 sm:h-100 object-cover"
            />
          ) : (
            <div className="w-full h-85 sm:h-100 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
              <Calendar className="w-16 h-16 text-blue-300" />
            </div>
          )}
          {/* Overlay buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Heart
                className={`w-5 h-5 ${
                  event.isFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-600"
                }`}
              />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

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
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Select your ticket
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Click any ticket to begin the checkout
                </p>

                {event.ticketStatus === "SOLD_OUT" ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-red-500 font-semibold text-lg mb-1">
                        Sold Out
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This event is no longer accepting registrations.
                      </p>
                    </CardContent>
                  </Card>
                ) : ticketTiers.length > 0 ? (
                  <div className="space-y-4">
                    {ticketTiers.map((tier: TicketTier) => {
                      const tierPrice = tier.salePrice || tier.basePrice;
                      const tierIsFree =
                        tier.type === "FREE" ||
                        !tierPrice ||
                        parseFloat(tierPrice) === 0;
                      const isSoldOut =
                        tier.availableCount === 0 && tier.totalQuantity > 0;

                      return (
                        <Card
                          key={tier.id}
                          className={`transition-colors ${
                            isSoldOut
                              ? "opacity-60"
                              : "hover:border-blue-200 cursor-pointer"
                          }`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                              {/* Tier Thumbnail */}
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                                {tier.cover || heroImage ? (
                                  <img
                                    src={tier.cover || heroImage!}
                                    alt={tier.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                    <Calendar className="w-6 h-6 text-blue-300" />
                                  </div>
                                )}
                              </div>

                              {/* Tier Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-base">
                                  {tier.name}
                                </h3>
                                {tier.description && (
                                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                    {tier.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 mt-2">
                                  {isSoldOut ? (
                                    <>
                                      <span className="w-2 h-2 rounded-full bg-red-500" />
                                      <span className="text-xs text-red-600 font-medium uppercase">
                                        Sold out
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-2 h-2 rounded-full bg-green-500" />
                                      <span className="text-xs text-green-600 font-medium uppercase">
                                        Available
                                        {tier.saleStartAt && tier.saleEndAt
                                          ? ` ${formatShortDate(tier.saleStartAt)} - ${formatShortDate(tier.saleEndAt)}`
                                          : tier.saleStartAt
                                            ? ` from ${formatShortDate(tier.saleStartAt)}`
                                            : ""}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Price + Select */}
                              <div className="text-right shrink-0">
                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                                  Price
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                  {tierIsFree
                                    ? "Free"
                                    : `$${parseFloat(tierPrice!).toFixed(2)}`}
                                </p>
                                {!isSoldOut && (
                                  <Button
                                    size="sm"
                                    className="mt-2 rounded-full px-5 text-xs"
                                  >
                                    SELECT
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {isFree
                          ? "Free"
                          : `$${parseFloat(event.price!).toFixed(2)}`}
                      </p>
                      <p className="text-sm text-muted-foreground mb-5">
                        per ticket
                      </p>
                      <Button className="rounded-full px-8">Get Tickets</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-85 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Overview Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  Overview
                </h3>
                {event.excerpt && (
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {event.excerpt}
                  </p>
                )}

                {/* Date & Time */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-[#2F6FE4]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(event.startAt)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTime(event.startAt)} - {formatTime(event.endAt)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {event.venueName ? (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D0FAE5] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#00BC7D]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {event.venueName}
                      </p>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {event.isOnline ? "Online Event" : "In-Person"}
                      </p>
                    </div>
                  </div>
                ) : event.isOnline ? (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Online Event
                      </p>
                      <p className="text-xs text-gray-400">
                        Join from anywhere
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* About the Organizer */}
              {organizer && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">
                    About the Organizer
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    {organizer.image ? (
                      <img
                        src={organizer.image}
                        alt={`${organizer.firstName} ${organizer.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {organizer.firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {organizer.firstName} {organizer.lastName}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        {parseInt(organizer.totalEvent) > 1
                          ? `${organizer.totalEvent} events`
                          : `${organizer.totalEvent} event`}
                      </p>
                    </div>
                  </div>

                  {/* Report */}
                  <button className="flex items-center gap-1.5 mt-5 text-xs text-red-400 hover:text-red-500 transition-colors">
                    <Flag className="w-3.5 h-3.5" />
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
