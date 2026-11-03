import EventSummary from "../event-summary/event-summary";
import {
  EVENT_ENTRY_LABELS,
  EVENT_REGISTRATION_LABELS,
  EVENT_VISIBILITY_LABELS,
  MY_EVENT_FORMAT_LABELS,
  formatCreateEventTimeRange,
  formatDateInputValue,
} from "~/features/workspace/lib/my-events-format";
import type {
  CreateEventFormState,
  EventOrganizer,
} from "~/features/workspace/types/my-events";

type Props = {
  form: CreateEventFormState;
  category: string;
  organizer: EventOrganizer | null;
};

/**
 * Read-only summary of the basics step, shown right before the Plumpi handoff.
 */
export default function CreateEventReview({
  form,
  category,
  organizer,
}: Props) {
  const formatLabel = form.format
    ? MY_EVENT_FORMAT_LABELS[form.format]
    : "Format to be confirmed";

  return (
    <EventSummary
      title="Review your event"
      description="Double check the details, then create your draft. Once it's saved, you can continue in Plumpi or return to My Events."
      summary={{
        coverUrl: form.coverPreviewUrl,
        name: form.name,
        category,
        organizerName: organizer?.name ?? null,
        dates: form.eventDates.map((eventDate, index) => ({
          key: String(index),
          date: eventDate.date
            ? formatDateInputValue(eventDate.date)
            : `Day ${index + 1} to be announced`,
          time: formatCreateEventTimeRange(
            eventDate.startTime,
            eventDate.endTime,
          ),
        })),
        location: form.venueName || formatLabel,
        address: form.address,
        googleMapLink: form.googleMapLink,
        description: form.description,
        access: {
          visibility: EVENT_VISIBILITY_LABELS[form.visibility],
          registration: EVENT_REGISTRATION_LABELS[form.registrationMode],
          entry: EVENT_ENTRY_LABELS[form.entryMode],
        },
      }}
    />
  );
}
