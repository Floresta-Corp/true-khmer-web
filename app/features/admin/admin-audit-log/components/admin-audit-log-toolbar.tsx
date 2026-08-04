import { type FormEvent, useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { useSearchParams } from "react-router";

import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { AdminAuditLogMember } from "~/types/api-client";
import {
  ADMIN_AUDIT_LOG_ALL_FILTER,
  ADMIN_AUDIT_LOG_CATEGORY_LABELS,
  ADMIN_AUDIT_LOG_CATEGORY_VALUES,
  ADMIN_AUDIT_LOG_SEARCH_MAX_LENGTH,
} from "../constants";
import type {
  AdminAuditLogCategoryFilter,
  AdminAuditLogFilters,
} from "../types";

const CATEGORY_OPTIONS = [
  { value: ADMIN_AUDIT_LOG_ALL_FILTER, label: "All Categories" },
  ...ADMIN_AUDIT_LOG_CATEGORY_VALUES.map((value) => ({
    value,
    label: ADMIN_AUDIT_LOG_CATEGORY_LABELS[value],
  })),
] satisfies Array<{ value: AdminAuditLogCategoryFilter; label: string }>;

export function AdminAuditLogToolbar({
  members,
  filters,
}: {
  members: AdminAuditLogMember[];
  filters: AdminAuditLogFilters;
}) {
  const [, setSearchParams] = useSearchParams();
  // Mirror the loader's validated filters, not the raw params, so a hand-edited
  // URL cannot show a filter the results were never narrowed by.
  const search = filters.search ?? "";
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      const normalizedSearch = searchInput.trim();

      if (normalizedSearch) next.set("search", normalizedSearch);
      else next.delete("search");

      next.delete("page");
      return next;
    });
  }

  function updateFilter(name: "category" | "adminId", value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (value === ADMIN_AUDIT_LOG_ALL_FILTER) next.delete(name);
      else next.set(name, value);

      next.delete("page");
      return next;
    });
  }

  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5 dark:border-slate-800">
      <form
        className="flex w-full sm:w-auto"
        role="search"
        onSubmit={submitSearch}
      >
        <InputGroup className="h-10 flex-1 bg-slate-50 sm:w-72 dark:border-slate-800 dark:bg-slate-950/50">
          <InputGroupAddon className="pl-3">
            <Search className="size-4 text-slate-400" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search actions"
            placeholder="Search actions..."
            value={searchInput}
            maxLength={ADMIN_AUDIT_LOG_SEARCH_MAX_LENGTH}
            onChange={(event) => setSearchInput(event.target.value)}
            className="px-2 text-sm font-medium placeholder:font-normal"
          />
        </InputGroup>
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      <Select
        value={filters.category}
        onValueChange={(value) => updateFilter("category", value)}
      >
        <SelectTrigger
          aria-label="Filter by category"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-44 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
        >
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.adminId ?? ADMIN_AUDIT_LOG_ALL_FILTER}
        onValueChange={(value) => updateFilter("adminId", value)}
      >
        <SelectTrigger
          aria-label="Filter by member"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-44 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
        >
          <SelectValue placeholder="All Members" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ADMIN_AUDIT_LOG_ALL_FILTER}>
            All Members
          </SelectItem>
          {members.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name || member.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        disabled
        title="Export coming soon"
        className="h-10 rounded-lg font-medium shadow-none sm:ml-auto dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
      >
        <Download />
        Export
      </Button>
    </div>
  );
}
