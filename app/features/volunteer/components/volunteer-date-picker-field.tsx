import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isValid, parse, parseISO } from "date-fns";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";

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

  const [inputValue, setInputValue] = useState(
    selectedDate ? format(selectedDate, "PPP") : "",
  );

  useEffect(() => {
    setInputValue(selectedDate ? format(selectedDate, "PPP") : "");
  }, [value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInputValue(raw);

    if (raw === "") {
      onChange("");
      return;
    }

    const parsed = parse(raw, "PPP", new Date());
    if (isValid(parsed)) {
      onChange(parsed.toISOString());
    }
  }

  function handleCalendarSelect(date: Date | undefined) {
    if (date) {
      setInputValue(format(date, "PPP"));
      onChange(date.toISOString());
    } else {
      setInputValue("");
      onChange("");
    }
  }

  return (
    <>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <InputGroup
              className={`relative flex items-center cursor-pointer rounded-lg bg-[#F8FAFC] gap-2 px-1 py-5 ${
                error ? " border-red-500" : " border-transparent"
              }`}
            >
              <InputGroupAddon>
                <CalendarIcon className="size-4 text-[#99a1af]" />
              </InputGroupAddon>
              <InputGroupInput
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="h-11 w-full rounded-lg  bg-transparent text-sm shadow-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </InputGroup>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </>
  );
}
