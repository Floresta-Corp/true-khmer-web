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
import { Skeleton } from "~/components/ui/skeleton";
import type { AdminUserManagementUser } from "~/types/api-client";
import { MEMBER_TIERS, type MemberTierSlug } from "~/lib/tiers";

const ALL_FILTERS = "all";

type StatusFilter = typeof ALL_FILTERS | AdminUserManagementUser["status"];
type TierFilter = typeof ALL_FILTERS | MemberTierSlug;

const STATUS_OPTIONS = [
  { value: ALL_FILTERS, label: "All Status" },
  { value: "SIGNUP_REQUIRED", label: "Signup Required" },
  { value: "ONBOARDING_REQUIRED", label: "Onboarding Required" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
] satisfies Array<{ value: StatusFilter; label: string }>;

const TIER_OPTIONS = [
  { value: ALL_FILTERS, label: "All Tiers" },
  ...MEMBER_TIERS.map((tier) => ({ value: tier.slug, label: tier.name })),
] satisfies Array<{ value: TierFilter; label: string }>;

export function UserManagementToolbar() {
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

  function updateFilter(name: "status" | "tier", value: string) {
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
        className="flex w-full gap-2 sm:w-auto"
        role="search"
        onSubmit={submitSearch}
      >
        <InputGroup className="h-10 flex-1 bg-slate-50 sm:w-72 dark:border-slate-800 dark:bg-slate-950/50">
          <InputGroupAddon className="pl-3">
            <Search className="size-4 text-slate-400" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search users"
            placeholder="Search users..."
            value={searchInput}
            maxLength={100}
            onChange={(event) => setSearchInput(event.target.value)}
            className="px-2 text-sm font-medium placeholder:font-normal"
          />
        </InputGroup>
        <Button
          type="submit"
          className="h-10 rounded-lg bg-blue-600 px-4 text-white shadow-none hover:bg-blue-700"
        >
          Search
        </Button>
      </form>

      <Select
        value={searchParams.get("tier") ?? ALL_FILTERS}
        onValueChange={(value) => updateFilter("tier", value)}
      >
        <SelectTrigger
          aria-label="Filter by tier"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-40 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
        >
          <SelectValue placeholder="All Tiers" />
        </SelectTrigger>
        <SelectContent>
          {TIER_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("status") ?? ALL_FILTERS}
        onValueChange={(value) => updateFilter("status", value)}
      >
        <SelectTrigger
          aria-label="Filter by status"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-48 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
        >
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        disabled
        title="Export will be integrated in a later step."
        className="h-10 rounded-lg font-medium shadow-none sm:ml-auto dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
      >
        <Download />
        Export
      </Button>
    </div>
  );
}

export function UserManagementToolbarSkeleton() {
  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5 dark:border-slate-800">
      <Skeleton className="h-10 w-full rounded-lg sm:w-72" />
      <Skeleton className="h-10 w-full rounded-lg sm:w-20" />
      <Skeleton className="h-10 w-full rounded-lg sm:w-40" />
      <Skeleton className="h-10 w-full rounded-lg sm:w-48" />
      <Skeleton className="h-10 w-full rounded-lg sm:ml-auto sm:w-24" />
    </div>
  );
}
