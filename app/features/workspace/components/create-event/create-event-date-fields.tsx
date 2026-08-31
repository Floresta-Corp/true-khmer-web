import { Plus, Trash2 } from "lucide-react";
import FieldLabel from "~/components/field-label";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import {
  emptyCreateEventDate,
  type CreateEventDateInput,
} from "~/features/workspace/types/my-events";

const dateInputClassName =
  "h-11 rounded-lg border-[#E1E7EF] bg-white px-3.5 text-sm text-[#364153] focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/20";

type Props = {
  dates: CreateEventDateInput[];
  error?: string;
  onChange: (dates: CreateEventDateInput[]) => void;
};

export default function CreateEventDateFields({
  dates,
  error,
  onChange,
}: Props) {
  const updateDate = <K extends keyof CreateEventDateInput>(
    index: number,
    field: K,
    value: CreateEventDateInput[K],
  ) => {
    onChange(
      dates.map((eventDate, currentIndex) =>
        currentIndex === index ? { ...eventDate, [field]: value } : eventDate,
      ),
    );
  };

  const addDate = () => {
    const previous = dates.at(-1);
    onChange([
      ...dates,
      {
        ...emptyCreateEventDate,
        startTime: previous?.startTime ?? "",
        endTime: previous?.endTime ?? "",
      },
    ]);
  };

  const removeDate = (index: number) => {
    if (dates.length === 1) return;
    onChange(dates.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div>
      <FieldLabel required className="text-[13px] font-bold text-[#344256]">
        Event Date
      </FieldLabel>

      <div className="mt-2.5 space-y-3">
        {dates.map((eventDate, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
          >
            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-500">
                Day {index + 1}
              </p>
              <Input
                type="date"
                value={eventDate.date}
                onChange={(event) =>
                  updateDate(index, "date", event.target.value)
                }
                aria-label={`Day ${index + 1} date`}
                aria-invalid={Boolean(error)}
                className={dateInputClassName}
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-500">
                Start Time
              </p>
              <Input
                type="time"
                value={eventDate.startTime}
                onChange={(event) =>
                  updateDate(index, "startTime", event.target.value)
                }
                aria-label={`Day ${index + 1} start time`}
                aria-invalid={Boolean(error)}
                className={dateInputClassName}
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-500">
                End Time
              </p>
              <Input
                type="time"
                value={eventDate.endTime}
                onChange={(event) =>
                  updateDate(index, "endTime", event.target.value)
                }
                aria-label={`Day ${index + 1} end time`}
                aria-invalid={Boolean(error)}
                className={dateInputClassName}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={dates.length === 1}
              onClick={() => removeDate(index)}
              aria-label={`Remove day ${index + 1}`}
              title={
                dates.length === 1
                  ? "An event needs at least one date"
                  : `Remove day ${index + 1}`
              }
              className={cn(
                "size-11 rounded-lg border-[#E1E7EF] text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
                dates.length === 1 && "text-red-300",
              )}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <Button
        type="button"
        variant="outline"
        onClick={addDate}
        className="mt-3 h-10 gap-1.5 rounded-lg border-blue-600 px-4 text-sm font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
      >
        <Plus className="size-4" />
        Add Another Day
      </Button>
    </div>
  );
}
