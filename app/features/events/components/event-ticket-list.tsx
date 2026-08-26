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
      <h2 className="mb-1 text-xl font-bold text-gray-900">
        Select your ticket
      </h2>
      <p className="mb-6 text-sm text-gray-400">
        Click any ticket to begin the checkout
      </p>

      {ticketStatus === "SOLD_OUT" ? (
        <Card className="rounded-2xl shadow-none">
          <CardContent className="pt-6 text-center">
            <p className="mb-1 text-lg font-semibold text-red-500">Sold Out</p>
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
                className={cn(
                  "rounded-2xl shadow-none transition-colors",
                  isSoldOut ? "opacity-60" : "hover:border-blue-200",
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Tier Thumbnail */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {tier.cover || heroImage ? (
                        <img
                          src={tier.cover || heroImage!}
                          alt={tier.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-50">
                          <Calendar className="h-6 w-6 text-blue-300" />
                        </div>
                      )}
                    </div>

                    {/* Tier Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {tier.name}
                      </h3>
                      {tier.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
                          {tier.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1.5">
                        {isSoldOut ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-xs font-medium text-red-600 uppercase">
                              Sold out
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs font-medium text-green-600 uppercase">
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
                    <div className="shrink-0 text-right">
                      <p className="mb-0.5 text-xs tracking-wide text-gray-400 uppercase">
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
        <Card className="rounded-2xl shadow-none">
          <CardContent className="pt-6 text-center">
            <p className="mb-1 text-lg font-semibold text-gray-500">
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
