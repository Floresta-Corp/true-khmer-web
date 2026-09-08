import { useRevalidator } from "react-router";
import { Ticket } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function MyTicketsError() {
  const revalidator = useRevalidator();
  return (
    <main className="min-h-full bg-white px-4 py-8 sm:px-6 sm:py-10 lg:p-12">
      <h1 className="mb-6 text-3xl font-medium">My Tickets</h1>
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-16 text-center"
      >
        <Ticket className="h-12 w-12 text-gray-300" />
        <h2 className="text-xl font-semibold">Unable to load your tickets</h2>
        <p className="text-gray-500">Please try again in a moment.</p>
        <Button
          variant="outline"
          disabled={revalidator.state !== "idle"}
          onClick={() => void revalidator.revalidate()}
        >
          {revalidator.state === "idle" ? "Try again" : "Loading..."}
        </Button>
      </div>
    </main>
  );
}
