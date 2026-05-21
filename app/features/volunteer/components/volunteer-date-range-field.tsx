import { Calendar as CalendarIcon } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
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
  placeholder?: string;
};

export default function VolunteerDateRangeField({
  startDate,
  endDate,
  onChange,
  error,
  placeholder = "Select start and end dates",
}: VolunteerDateRangeFieldProps) {
  const parsedStartDate = startDate ? parseISO(startDate) : undefined;
  const parsedEndDate = endDate ? parseISO(endDate) : undefined;
  const selectedRange: DateRange | undefined =
    parsedStartDate && isValid(parsedStartDate)
      ? {
          from: parsedStartDate,
          to:
            parsedEndDate && isValid(parsedEndDate) ? parsedEndDate : undefined,
        }
      : undefined;

  const displayValue = selectedRange?.from
    ? selectedRange.to
      ? `${format(selectedRange.from, "MMM d, yyyy")} - ${format(selectedRange.to, "MMM d, yyyy")}`
      : format(selectedRange.from, "MMM d, yyyy")
    : placeholder;

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="opportunity-date-range-trigger"
            type="button"
            variant="outline"
            aria-invalid={Boolean(error)}
            className={`relative h-11 w-full justify-start rounded-lg bg-[#F8FAFC] pl-9 pr-3 text-left text-sm font-medium shadow-none hover:bg-[#F8FAFC] ${
              selectedRange?.from ? "text-[#364153]" : "text-[#C8D6E5]"
            } ${error ? "border-red-500" : "border-transparent"}`}
          >
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2 flex justify-start">
          <Calendar
            defaultMonth={new Date()}
            mode="range"
            selected={selectedRange}
            numberOfMonths={2}
            onSelect={(range) =>
              onChange({
                startDate: range?.from ? range.from.toISOString() : "",
                endDate: range?.to ? range.to.toISOString() : "",
              })
            }
          />
        </PopoverContent>
      </Popover>
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
