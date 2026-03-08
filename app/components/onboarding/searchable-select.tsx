import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type SelectOption = {
  id: string;
  name: string;
};

type SearchableSelectProps = {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  allowClear?: boolean;
  clearLabel?: string;
  emptyText?: string;
};

export function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  loading = false,
  allowClear = false,
  clearLabel = "Clear selection",
  emptyText = "No results found",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setMenuWidth(triggerRef.current?.offsetWidth);
  }, [open]);

  const selected = options.find((option) => option.id === value);
  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.name.toLowerCase().includes(q));
  }, [options, query]);

  function selectValue(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold leading-5 text-[#374151]">{label}</label>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            className="flex h-11 w-full items-center justify-between rounded-lg bg-[#F8FAFC] px-3 text-sm font-medium text-[#64748B] outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{selected?.name ?? placeholder}</span>
            <ChevronDown size={16} className="text-[#B7C3D6]" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="rounded-xl border border-[#E2E8F0] bg-white p-2"
          style={menuWidth ? { width: `${menuWidth}px` } : undefined}
        >
          <div className="relative mb-2">
            <Search
              size={14}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="h-9 w-full rounded-md border border-[#E2E8F0] pl-7 pr-2 text-sm outline-none"
              onKeyDown={(event) => event.stopPropagation()}
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {allowClear ? (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  selectValue("");
                }}
              >
                <span className="text-[#475569]">{clearLabel}</span>
              </DropdownMenuItem>
            ) : null}

            {loading ? (
              <p className="px-2 py-2 text-sm text-[#64748B]">Loading...</p>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onSelect={(event) => {
                    event.preventDefault();
                    selectValue(option.id);
                  }}
                >
                  <span className="flex flex-1 items-center justify-between">
                    <span>{option.name}</span>
                    {value === option.id ? <Check size={16} /> : null}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="px-2 py-2 text-sm text-[#64748B]">{emptyText}</p>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
