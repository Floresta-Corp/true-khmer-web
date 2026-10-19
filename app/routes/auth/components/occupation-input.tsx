import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { memberOccupationOptions } from "~/features/partner-registration/data/sector-options";
import { cn } from "~/lib/utils";

const MAX_SUGGESTIONS = 8;

const occupationSuggestions = memberOccupationOptions.map(
  (option) => option.label,
);

/**
 * Rank the presets against what has been typed: titles that start with the
 * query come before ones that only contain it somewhere in the middle.
 */
function matchOccupations(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const startsWith: string[] = [];
  const contains: string[] = [];
  for (const suggestion of occupationSuggestions) {
    const haystack = suggestion.toLowerCase();
    if (haystack.startsWith(needle)) startsWith.push(suggestion);
    else if (haystack.includes(needle)) contains.push(suggestion);
  }

  return [...startsWith, ...contains].slice(0, MAX_SUGGESTIONS);
}

type OccupationInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  ariaInvalid?: boolean;
  className?: string;
};

/**
 * Free-text occupation with suggestions, LinkedIn style: the preset list only
 * helps finish the word, and whatever the member typed is the value when none
 * of the presets fit.
 */
export function OccupationInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  ariaInvalid,
  className,
}: OccupationInputProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(() => matchOccupations(value), [value]);
  // An exact pick needs no list under it.
  const isExactMatch =
    suggestions.length === 1 &&
    suggestions[0].toLowerCase() === value.trim().toLowerCase();
  const showSuggestions = isOpen && suggestions.length > 0 && !isExactMatch;

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const choose = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={listboxId}
        aria-activedescendant={
          showSuggestions && activeIndex >= 0
            ? `${listboxId}-${activeIndex}`
            : undefined
        }
        aria-invalid={ariaInvalid}
        className={className}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
            return;
          }
          if (!showSuggestions) return;

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => (index + 1) % suggestions.length);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) =>
              index <= 0 ? suggestions.length - 1 : index - 1,
            );
          } else if (event.key === "Enter" && activeIndex >= 0) {
            // Only swallow Enter when it picks a suggestion; otherwise it
            // still submits the form with the typed value.
            event.preventDefault();
            choose(suggestions[activeIndex]);
          }
        }}
      />

      {showSuggestions ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#C3C6D6] bg-white py-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              // Keep focus in the input so picking does not count as a blur.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-sm text-[#111827]",
                index === activeIndex && "bg-slate-50",
              )}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
