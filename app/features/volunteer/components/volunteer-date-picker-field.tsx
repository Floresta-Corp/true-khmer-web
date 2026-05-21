import { Calendar as CalendarIcon } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type VolunteerDatePickerFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

export default function VolunteerDatePickerField({
  value,
  onChange,
  error,
  placeholder = "Select application deadline",
}: VolunteerDatePickerFieldProps) {
  const parsedDate = value ? parseISO(value) : undefined;
  const selectedDate =
    parsedDate && isValid(parsedDate) ? parsedDate : undefined;

  return (
    <>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              aria-invalid={Boolean(error)}
              className={`group relative h-11 w-full justify-start rounded-lg bg-[#F8FAFC] pl-9 pr-3 text-left text-sm font-medium shadow-none hover:bg-[#F8FAFC] ${
                selectedDate ? "text-[#364153]" : "text-[#C8D6E5]"
              } ${error ? "border-red-500" : "border-transparent"}`}
            >
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
              <span className="transition-colors group-hover:text-[#364153]">
                {selectedDate ? format(selectedDate, "PPP") : placeholder}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => onChange(date ? date.toISOString() : "")}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </>
  );
}
