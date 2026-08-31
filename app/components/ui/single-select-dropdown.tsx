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
import { Label } from "~/components/ui/label";
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
  ariaDescribedBy?: string;
  icon?: React.ReactNode;
  label?: string;
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
  ariaDescribedBy,
  icon,
  label,
}: SingleSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setMenuWidth(triggerRef.current?.offsetWidth);
  }, [open]);

  const selected = options.find((option) => option.value === value);
  const firstEnable = options.find((o) => !o.disabled);

  useEffect(() => {
    if (!hasInteractedRef.current && !value && firstEnable) {
      onValueChange(firstEnable.value);
    }
  }, [value, firstEnable, onValueChange]);

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
    hasInteractedRef.current = true;
  }

  return (
    <div className={cn("w-full", label && "space-y-2")}>
      {label && <Label htmlFor={id}>{label}</Label>}
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
            aria-describedby={ariaDescribedBy}
            className={cn(
              "mt-1.5 flex h-12 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background transition-colors outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:h-10 [&>span]:truncate",
              triggerClassName,
              open && "ring-2 ring-ring ring-offset-2",
              className,
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {icon}
              <span
                className={cn(
                  "truncate",
                  !selected && "font-normal text-muted-foreground",
                )}
              >
                {selected?.label ?? placeholder}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                open && "rotate-180 opacity-100",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={cn(
            "relative z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
            contentClassName,
          )}
          style={menuWidth ? { width: `${menuWidth}px` } : undefined}
        >
          <DropdownMenuGroup className="p-1">
            {menuLabel ? (
              <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">
                {menuLabel}
              </DropdownMenuLabel>
            ) : null}

            {searchable ? (
              <div className="relative mb-2">
                <Search
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-[#94A3B8]"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 rounded-md border-[#E2E8F0] bg-white pr-2 pl-7 text-sm"
                  onKeyDown={(event) => event.stopPropagation()}
                />
              </div>
            ) : null}

            <div className="max-h-56 overflow-x-hidden overflow-y-auto overscroll-contain">
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
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
