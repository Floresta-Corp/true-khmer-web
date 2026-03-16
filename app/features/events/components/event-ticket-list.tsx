import { Calendar } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { formatShortDate } from "~/features/events/lib/event-formatters";
import type { TicketTier } from "~/features/events/lib/event-types";
import { cn } from "~/lib/utils";

interface EventTicketListProps {
  ticketTiers: TicketTier[];
  ticketStatus?: string;
  price?: string;
  heroImage: string | null;
  eventName: string | null;
}

export function EventTicketList({
  ticketTiers,
  ticketStatus,
  price,
  heroImage,
  eventName,
}: EventTicketListProps) {
  const isFree = !price || price === "Free" || parseFloat(price) === 0;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Select your ticket
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Click any ticket to begin the checkout
      </p>

      {ticketStatus === "SOLD_OUT" ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 font-semibold text-lg mb-1">Sold Out</p>
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
              tier.type === "FREE" || !tierPrice || parseFloat(tierPrice) === 0;
            const isSoldOut =
              tier.availableCount === 0 && tier.totalQuantity > 0;

            return (
              <Card
                key={tier.id}
                className={`transition-colors ${
                  isSoldOut ? "opacity-60" : "hover:border-blue-200"
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
                        <Link
                          to={`${import.meta.env.VITE_PLUMPI_WEB}/events/${eventName}`}
                          target="_blank"
                        >
                          <Button
                            size="sm"
                            className={cn(
                              "mt-2 rounded-full px-5 text-xs",
                              isSoldOut
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer",
                            )}
                          >
                            SELECT
                          </Button>
                        </Link>
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
            <p className="text-gray-500 font-semibold text-lg mb-1">
              No Tickets Available
            </p>
            <p className="text-sm text-muted-foreground">
              There are currently no tickets available for this event.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
