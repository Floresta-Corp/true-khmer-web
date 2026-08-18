import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { debounce } from "~/lib/utils";

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
    <div className="flex items-center gap-3 border-b border-slate-50 p-6 dark:border-slate-800">
      <div className="relative max-w-md flex-1">
        <Search
          className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <Input
          aria-label="Search moderators by name or email"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search by name or email..."
          className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-4 pl-11 text-sm font-medium transition-all focus:border-slate-950 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
        />
      </div>
      <Select
        value={roleValue}
        onValueChange={(value) => onRoleChange(value as RoleFilter)}
      >
        <SelectTrigger
          aria-label="Filter by role"
          className="h-11 w-36 shrink-0 cursor-pointer rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition-all dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {(["all", ...ROLES] as const).map((role) => (
            <SelectItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
