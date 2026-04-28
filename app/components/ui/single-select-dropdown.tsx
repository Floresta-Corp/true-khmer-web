import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export type SingleSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SingleSelectDropdownProps = {
  id: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SingleSelectOption[];
  placeholder: string;
  menuLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  allowClear?: boolean;
  clearLabel?: string;
  emptyText?: string;
  triggerClassName?: string;
  contentClassName?: string;
  className?: string;
  ariaInvalid?: boolean;
};

export function SingleSelectDropdown({
  id,
  name,
  value,
  onValueChange,
  options,
  placeholder,
  menuLabel,
  disabled = false,
  loading = false,
  searchable = false,
  searchPlaceholder = "Search...",
  allowClear = false,
  clearLabel = "Clear selection",
  emptyText = "No results found",
  triggerClassName,
  contentClassName,
  className,
  ariaInvalid = false,
}: SingleSelectDropdownProps) {
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

  const selected = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalized),
    );
  }, [options, query, searchable]);

  function handleSelect(nextValue: string) {
    if (nextValue !== value) onValueChange(nextValue);
    setOpen(false);
  }

  return (
    <>
      {name ? <input id={id} type="hidden" name={name} value={value} /> : null}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            id={`${id}-trigger`}
            type="button"
            disabled={disabled}
            variant="outline"
            aria-invalid={ariaInvalid}
            className={cn(
              "h-11 w-full justify-between rounded-lg border-transparent bg-[#F8FAFC] px-3 text-[12.25px] font-medium text-[#1E293B] shadow-none hover:bg-[#F8FAFC] focus-visible:ring-[#2F6FE4]/30",
              open && "bg-white text-[#475569] shadow-[0_0_0_1px_#D6E4FF]",
              triggerClassName,
              className,
            )}
          >
            <span className={cn("truncate", !selected && "text-[#C8D6E5]")}>
              {selected?.label ?? placeholder}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "shrink-0 text-[#B7C3D6] transition-transform duration-200 ease-out",
                open && "rotate-180 text-[#2F6FE4]",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={cn(
            "max-h-72 overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white p-1",
            contentClassName,
          )}
          style={menuWidth ? { width: `${menuWidth}px` } : undefined}
        >
          <DropdownMenuGroup>
            {menuLabel ? (
              <DropdownMenuLabel className="text-xs font-semibold text-[#64748B]">
                {menuLabel}
              </DropdownMenuLabel>
            ) : null}

            {searchable ? (
              <div className="relative mb-2">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 rounded-md border-[#E2E8F0] bg-white pl-7 pr-2 text-sm"
                  onKeyDown={(event) => event.stopPropagation()}
                />
              </div>
            ) : null}

            {allowClear ? (
              <DropdownMenuCheckboxItem
                checked={value === ""}
                onSelect={(event) => {
                  event.preventDefault();
                  handleSelect("");
                }}
              >
                {clearLabel}
              </DropdownMenuCheckboxItem>
            ) : null}

            {loading ? (
              <p className="px-2 py-2 text-sm text-[#64748B]">Loading...</p>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onSelect={(event) => {
                    event.preventDefault();
                    handleSelect(option.value);
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <p className="px-2 py-2 text-sm text-[#64748B]">{emptyText}</p>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
