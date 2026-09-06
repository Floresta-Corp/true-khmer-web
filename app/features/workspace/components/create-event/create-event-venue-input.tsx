import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Loader2, MapPin } from "lucide-react";
import FieldLabel from "~/components/field-label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type {
  EventVenue,
  VenueSearchResponse,
} from "~/features/workspace/types/my-events";

const VENUE_SEARCH_ROUTE = "/api/my-events/venues";
/** Long enough that a steady typist sends one request, not one per letter. */
const SEARCH_DEBOUNCE_MS = 300;

type CachedVenuePages = {
  venues: EventVenue[];
  /** Last page fetched for this query, so scrolling resumes where it left off. */
  page: number;
  hasMore: boolean;
};

/**
 * What each query has already fetched, kept for the life of the page rather
 * than the life of the field: reopening the dropdown — or coming back to it
 * after switching format or step — shows what was already loaded instead of
 * asking Plumpi for the same pages again. A full page reload starts it empty.
 */
const venuePageCache = new Map<string, CachedVenuePages>();

type Props = {
  venueId: string;
  venueName: string;
  error?: string;
  inputClassName?: string;
  onVenueIdChange: (venueId: string) => void;
  onVenueNameChange: (venueName: string) => void;
  onAddressChange: (address: string) => void;
};

/**
 * Search existing venues or keep the typed name as a new venue.
 *
 * Plumpi owns both the matching and the paging: the typed name is sent as a
 * `search` query and further pages are pulled in as the list is scrolled, so
 * the browser never holds more than the pages it has actually shown.
 */
export default function CreateEventVenueInput({
  venueId,
  venueName,
  error,
  inputClassName,
  onVenueIdChange,
  onVenueNameChange,
  onAddressChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const fetcher = useFetcher<VenueSearchResponse>();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [venues, setVenues] = useState<EventVenue[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  /** False until the first page of the current query has come back. */
  const [hasLoaded, setHasLoaded] = useState(false);
  const loadedPageRef = useRef(0);
  /** Mirrors `venues` so a page can be appended without a state updater. */
  const venuesRef = useRef<EventVenue[]>([]);
  /** The response already folded into the list, so it is not applied twice. */
  const appliedDataRef = useRef<VenueSearchResponse | null>(null);

  const trimmedName = venueName.trim();
  const isLoading = fetcher.state !== "idle";

  const loadPage = (nextSearch: string, page: number) => {
    const params = new URLSearchParams({ page: String(page) });
    if (nextSearch) params.set("search", nextSearch);
    fetcher.load(`${VENUE_SEARCH_ROUTE}?${params.toString()}`);
  };

  /** Settle the keystrokes into the query that is actually sent. */
  useEffect(() => {
    const timeout = setTimeout(
      () => setSearch(trimmedName),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [trimmedName]);

  // A new query starts the list over at page one; the dropdown stays closed
  // until the organizer opens it, so nothing is fetched before it is needed.
  // Anything this query has fetched before is served from the cache, so
  // reopening the field costs no request.
  useEffect(() => {
    if (!isOpen) return;

    const cached = venuePageCache.get(search);
    setVenues(cached?.venues ?? []);
    venuesRef.current = cached?.venues ?? [];
    setHasMore(cached?.hasMore ?? false);
    setLoadError(null);
    setHasLoaded(Boolean(cached));
    loadedPageRef.current = cached?.page ?? 0;

    if (!cached) loadPage(search, 1);
  }, [search, isOpen]);

  useEffect(() => {
    const data = fetcher.data;
    // Responses can land out of order, and a slow one for an earlier query
    // must not overwrite the list the organizer is looking at now. A response
    // already folded in must not be replayed either — the fetcher keeps it
    // around across renders, including the one that restores from the cache.
    if (!data || data.search !== search || appliedDataRef.current === data) {
      return;
    }
    appliedDataRef.current = data;

    setHasLoaded(true);

    if (!data.ok) {
      setLoadError(data.message ?? "Venues are temporarily unavailable");
      setHasMore(false);
      return;
    }

    const previous = data.page === 1 ? [] : venuesRef.current;
    const seen = new Set(previous.map((venue) => venue.id));
    const next = [
      ...previous,
      ...data.venues.filter((venue) => !seen.has(venue.id)),
    ];

    loadedPageRef.current = data.page;
    venuesRef.current = next;
    venuePageCache.set(data.search, {
      venues: next,
      page: data.page,
      hasMore: data.hasMore,
    });

    setLoadError(null);
    setHasMore(data.hasMore);
    setVenues(next);
  }, [fetcher.data, search]);

  /** Pull the next page in once the end of the list scrolls into view. */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!isOpen || !hasMore || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fetcher.state !== "idle") return;
        loadPage(search, loadedPageRef.current + 1);
      },
      { root: listRef.current, rootMargin: "80px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen, hasMore, search, fetcher.state, venues.length]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const isSearchPending = trimmedName !== search || isLoading || !hasLoaded;
  /**
   * Creating is what is left when the search comes back with nothing, so the
   * offer replaces the empty row rather than sitting under a list of results.
   */
  const canCreate = Boolean(
    trimmedName && !isSearchPending && venues.length === 0,
  );

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
              ref={listRef}
              id="create-event-venue-options"
              role="listbox"
              aria-busy={isLoading}
              className="max-h-60 overflow-y-auto py-1"
            >
              {venues.map((venue) => (
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

              {/* Sits below the last row so scrolling to it asks for more. */}
              {hasMore && venues.length > 0 && (
                <li
                  ref={sentinelRef}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs text-slate-500"
                >
                  {isLoading && (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Loading more
                    </>
                  )}
                </li>
              )}

              {venues.length === 0 && isSearchPending && (
                <li className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-500">
                  <Loader2 className="size-3.5 animate-spin" />
                  Loading
                </li>
              )}

              {/* The create offer speaks for an empty result on its own. */}
              {venues.length === 0 && !isSearchPending && !canCreate && (
                <li className="px-4 py-2.5 text-sm text-slate-500">
                  {loadError
                    ? "Venues are temporarily unavailable"
                    : "No venues found"}
                </li>
              )}

              {/* One more option in the same list, not a footer under it. */}
              {canCreate && (
                <li>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={startCreating}
                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-blue-600 hover:bg-slate-50"
                  >
                    Create &ldquo;{trimmedName}&rdquo;
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {loadError && <p className="mt-2 text-xs text-amber-700">{loadError}</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      {!error && !venueId && canCreate && (
        <p className="mt-1 text-xs text-slate-500">
          This venue will be created with your event.
        </p>
      )}
    </div>
  );
}
