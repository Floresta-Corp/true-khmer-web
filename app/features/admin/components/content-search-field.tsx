import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const SEARCH_DEBOUNCE_MS = 350;

interface ContentSearchFieldProps {
  value: string;
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
}

export default function ContentSearchField({
  value,
  placeholder,
  label,
  onChange,
}: ContentSearchFieldProps) {
  const [draft, setDraft] = useState(value);
  const emittedRef = useRef(value);

  useEffect(() => {
    if (value === emittedRef.current) return;
    emittedRef.current = value;
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const next = draft.trim();
    if (next === emittedRef.current) return;

    const timer = setTimeout(() => {
      emittedRef.current = next;
      onChange(next);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, onChange]);

  return (
    <div className="relative min-w-0">
      <Search
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
      />
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-10 rounded-xl border-0 bg-slate-50 pr-9 pl-9 text-sm font-medium shadow-none focus-visible:ring-1 dark:bg-slate-800"
      />
      {draft.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setDraft("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 size-7 -translate-y-1/2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X size={14} />
        </Button>
      )}
    </div>
  );
}
