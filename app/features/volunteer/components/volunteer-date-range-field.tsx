import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isAfter, isValid, parseISO } from "date-fns";
import FieldLabel from "~/components/field-label";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type VolunteerDateRangeFieldProps = {
  startDate?: string;
  endDate?: string;
  onChange: (value: { startDate: string; endDate: string }) => void;
  error?: string;
};

const toDate = (value?: string) => {
  const parsed = value ? parseISO(value) : undefined;
  return parsed && isValid(parsed) ? parsed : undefined;
};

export default function VolunteerDateRangeField({
  startDate,
  endDate,
  onChange,
  error,
}: VolunteerDateRangeFieldProps) {
  const start = toDate(startDate);
  const end = toDate(endDate);

  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<Date>();

  const startError = error && !start ? error : undefined;
  const endError = error && start ? error : undefined;

  function handleStartSelect(day: Date) {
    const keepEnd = end && !isAfter(day, end);
    onChange({
      startDate: day.toISOString(),
      endDate: keepEnd ? end.toISOString() : "",
    });
    setStartOpen(false);
    if (!keepEnd) setEndOpen(true);
  }

  function handleEndSelect(day: Date) {
    onChange({ startDate: startDate ?? "", endDate: day.toISOString() });
    setEndOpen(false);
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-4">
        <FieldLabel>Start date</FieldLabel>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <DateTrigger
            id="opportunity-start-date-trigger"
            value={start}
            placeholder="Select start date"
            error={startError}
          />
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={start ? { from: start, to: end } : undefined}
              defaultMonth={start ?? new Date()}
              onSelect={(_, day) => handleStartSelect(day)}
            />
          </PopoverContent>
        </Popover>
        {startError ? (
          <p className="mt-1 text-xs text-red-500">{startError}</p>
        ) : null}
      </div>

      <div className="space-y-4">
        <FieldLabel>End date</FieldLabel>
        <Popover
          open={endOpen}
          onOpenChange={(open) => {
            setEndOpen(open);
            if (!open) setHoveredDay(undefined);
          }}
        >
          <DateTrigger
            id="opportunity-end-date-trigger"
            value={end}
            placeholder={start ? "Select end date" : "Pick a start date first"}
            error={endError}
            disabled={!start}
          />
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={
                start ? { from: start, to: hoveredDay ?? end } : undefined
              }
              defaultMonth={end ?? start ?? new Date()}
              disabled={start ? { before: start } : undefined}
              onDayMouseEnter={(day) =>
                setHoveredDay(start && !isAfter(start, day) ? day : undefined)
              }
              onDayMouseLeave={() => setHoveredDay(undefined)}
              onSelect={(_, day) => handleEndSelect(day)}
            />
          </PopoverContent>
        </Popover>
        {endError ? (
          <p className="mt-1 text-xs text-red-500">{endError}</p>
        ) : null}
      </div>
    </div>
  );
}

function DateTrigger({
  id,
  value,
  placeholder,
  error,
  disabled,
}: {
  id: string;
  value?: Date;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <PopoverTrigger asChild>
      <Button
        id={id}
        type="button"
        variant="outline"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`relative mt-1.5 h-11 w-full justify-start rounded-lg bg-[#F8FAFC] pr-3 pl-9 text-left text-sm font-medium shadow-none hover:bg-[#F8FAFC] focus-visible:ring-2 ${
          value ? "text-[#364153]" : "text-muted-foreground"
        } ${error ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500" : "border-transparent focus-visible:border-transparent focus-visible:ring-blue-500"}`}
      >
        <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#99a1af]" />
        {value ? format(value, "MMM d, yyyy") : placeholder}
      </Button>
    </PopoverTrigger>
  );
}
