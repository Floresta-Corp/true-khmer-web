import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import FieldLabel from "~/components/field-label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { EventVenue } from "~/features/workspace/types/my-events";

type Props = {
  venueId: string;
  venueName: string;
  venues: EventVenue[];
  venueLoadError: string | null;
  error?: string;
  inputClassName?: string;
  onVenueIdChange: (venueId: string) => void;
  onVenueNameChange: (venueName: string) => void;
  onAddressChange: (address: string) => void;
};

/** Search existing venues or keep the typed name as a new venue. */
export default function CreateEventVenueInput({
  venueId,
  venueName,
  venues,
  venueLoadError,
  error,
  inputClassName,
  onVenueIdChange,
  onVenueNameChange,
  onAddressChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const trimmedName = venueName.trim();

  const matches = useMemo(() => {
    const query = trimmedName.toLocaleLowerCase();
    if (!query) return venues;

    return venues.filter((venue) =>
      venue.name.toLocaleLowerCase().includes(query),
    );
  }, [trimmedName, venues]);

  const canCreate = Boolean(
    trimmedName &&
    !venues.some(
      (venue) =>
        venue.name.trim().toLocaleLowerCase() ===
        trimmedName.toLocaleLowerCase(),
    ),
  );

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const chooseVenue = (venue: EventVenue) => {
    onVenueNameChange(venue.name);
    onVenueIdChange(venue.id);
    onAddressChange(venue.address ?? "");
    setIsOpen(false);
  };

  const startCreating = () => {
    onVenueNameChange(trimmedName);
    onVenueIdChange("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef}>
      <FieldLabel required className="text-[13px] font-bold text-[#344256]">
        Venue
      </FieldLabel>

      <div className="relative mt-2">
        <Input
          id="venueName"
          name="venueName"
          type="text"
          autoComplete="off"
          value={venueName}
          placeholder="Search for or create a venue"
          onChange={(event) => {
            onVenueNameChange(event.target.value);
            // The typed name no longer describes the picked venue. Keep the
            // address and map details the organizer has already entered.
            onVenueIdChange("");
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="create-event-venue-options"
          aria-invalid={Boolean(error)}
          className={cn(inputClassName, error && "border-red-500")}
        />

        {isOpen && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[#E1E7EF] bg-white shadow-lg">
            <ul
              id="create-event-venue-options"
              role="listbox"
              className="max-h-60 overflow-y-auto py-1"
            >
              {matches.map((venue) => (
                <li key={venue.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={venue.id === venueId}
                    onClick={() => chooseVenue(venue)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#344256] hover:bg-slate-50"
                  >
                    <MapPin className="size-4 shrink-0 text-slate-400" />
                    <span className="truncate">{venue.name}</span>
                  </button>
                </li>
              ))}
              {matches.length === 0 && !canCreate && (
                <li className="px-4 py-2.5 text-sm text-slate-500">
                  {venueLoadError
                    ? "Venues are temporarily unavailable"
                    : "No venues found"}
                </li>
              )}
            </ul>

            {canCreate && (
              <button
                type="button"
                onClick={startCreating}
                className="w-full border-t border-[#E1E7EF] px-4 py-3 text-left text-sm font-bold text-blue-600 hover:bg-slate-50"
              >
                Create &ldquo;{trimmedName}&rdquo;
              </button>
            )}
          </div>
        )}
      </div>

      {venueLoadError && (
        <p className="mt-2 text-xs text-amber-700">{venueLoadError}</p>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      {!error && !venueId && canCreate && (
        <p className="mt-1 text-xs text-slate-500">
          This venue will be created with your event.
        </p>
      )}
    </div>
  );
}
