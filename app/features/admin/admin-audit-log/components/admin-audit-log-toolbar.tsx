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
import type { AdminAuditLogCategoryFilter } from "../types";

const ALL_FILTERS = "all";

const SEARCH_MAX_LENGTH = 100;

const CATEGORY_OPTIONS = [
  { value: ALL_FILTERS, label: "All Categories" },
  { value: "TEAM", label: "Team" },
  { value: "CONTENT", label: "Content" },
  { value: "USERS", label: "Users" },
  { value: "SYSTEM", label: "System" },
] satisfies Array<{ value: AdminAuditLogCategoryFilter; label: string }>;

export function AdminAuditLogToolbar({
  members,
}: {
  members: AdminAuditLogMember[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
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

      if (value === ALL_FILTERS) next.delete(name);
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
            maxLength={SEARCH_MAX_LENGTH}
            onChange={(event) => setSearchInput(event.target.value)}
            className="px-2 text-sm font-medium placeholder:font-normal"
          />
        </InputGroup>
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      <Select
        value={searchParams.get("category") ?? ALL_FILTERS}
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
        value={searchParams.get("adminId") ?? ALL_FILTERS}
        onValueChange={(value) => updateFilter("adminId", value)}
      >
        <SelectTrigger
          aria-label="Filter by member"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-44 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
        >
          <SelectValue placeholder="All Members" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTERS}>All Members</SelectItem>
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
