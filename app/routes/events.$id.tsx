import { useLoaderData } from "react-router";
import type { Route } from "./+types/events.$id";
import { Calendar, MapPin, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";
import { getEventById } from "~/lib/events.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  return await getEventById(request, params.id);
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventDetailPage() {
  const { user, event, error } = useLoaderData<typeof loader>();

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-red-900 text-lg">Event Not Found</h3>
            <p className="text-red-700">{error || "The event you are looking for does not exist."}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar user={user} />

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <Card className="overflow-hidden shadow-lg border-none ring-1 ring-black/5">
            {event.thumbnail && (
              <img
                src={event.thumbnail}
                alt={event.title}
                className="w-full h-[400px] object-cover"
              />
            )}
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{event.title}</h1>
                <Badge className="text-sm px-3 py-1">
                  {event.eventType}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-muted/40 p-6 rounded-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Date</p>
                      <p className="text-sm">{formatDateTime(event.startAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Ends</p>
                      <p className="text-sm">{formatDateTime(event.endAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {event.venueName && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Location</p>
                        <p className="text-sm">{event.venueName}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
                      <span className="text-lg font-bold">$</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Price</p>
                      <p className="text-sm font-bold">
                        {event.price === "Free" ? "Free" : `$${event.price}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none text-foreground border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">About this event</h2>
                {event.description ? (
                  <div
                    className="leading-relaxed text-muted-foreground [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-2 [&>h2]:mt-4 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                ) : (
                  <p className="leading-relaxed text-muted-foreground">
                    No description provided for this event.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}