import { useEffect, useRef, useState } from "react";
import { Filter, Search } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, debounce } from "~/lib/utils";

const ROLES = ["moderator", "super_admin"] as const;
type RoleFilter = (typeof ROLES)[number] | "all";

const ROLE_LABELS: Record<RoleFilter, string> = {
  all: "All Roles",
  moderator: "Moderator",
  super_admin: "Super Admin",
};

interface ManageModeratorToolbarProps {
  searchValue: string;
  roleValue: RoleFilter;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: RoleFilter) => void;
}

export function ManageModeratorToolbar({
  searchValue,
  roleValue,
  onSearchChange,
  onRoleChange,
}: ManageModeratorToolbarProps) {
  const [inputValue, setInputValue] = useState(searchValue);

  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);
  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      onSearchChangeRef.current(value);
    }, 300),
  );
  useEffect(() => {
    return () => debouncedSearchRef.current.cancel();
  }, []);
  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearchRef.current(value);
  };

  return (
    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
          size={18}
        />
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-950 transition-all"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "p-3 rounded-xl transition-all",
                roleValue !== "all"
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white",
              )}
            >
              <Filter size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={roleValue}
              onValueChange={(value) => onRoleChange(value as RoleFilter)}
            >
              {(["all", ...ROLES] as const).map((role) => (
                <DropdownMenuRadioItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
