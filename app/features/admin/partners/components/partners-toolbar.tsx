import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Search } from "lucide-react";
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

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)", field: "name", order: "asc" },
  { value: "name-desc", label: "Name (Z-A)", field: "name", order: "desc" },
  {
    value: "createdAt-desc",
    label: "Newest First",
    field: "createdAt",
    order: "desc",
  },
  {
    value: "createdAt-asc",
    label: "Oldest First",
    field: "createdAt",
    order: "asc",
  },
] as const;

export function PartnersToolbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const sortField = searchParams.get("sortField") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const currentSortValue = `${sortField}-${sortOrder}`;

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

  function handleSortChange(value: string) {
    const option = SORT_OPTIONS.find((item) => item.value === value);
    if (!option) return;

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("sortField", option.field);
      next.set("sortOrder", option.order);
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
        <InputGroup className="h-10 flex-1 bg-slate-50 sm:w-72 dark:bg-slate-950/50">
          <InputGroupAddon className="pl-3">
            <Search className="size-4 text-slate-400" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search partners"
            placeholder="Search partners by name or email"
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

      <Select value={currentSortValue} onValueChange={handleSortChange}>
        <SelectTrigger
          aria-label="Sort partners"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-48 dark:bg-slate-950/50 dark:text-white"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        asChild
        className="h-10 rounded-lg font-medium shadow-none sm:ml-auto"
      >
        <Link to="/tk-admin/partners/new">
          <Plus />
          New Partner
        </Link>
      </Button>
    </div>
  );
}

export function PartnersToolbarSkeleton() {
  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5 dark:border-slate-800">
      <Skeleton className="h-10 w-full rounded-lg sm:w-72" />
      <Skeleton className="h-10 w-full rounded-lg sm:w-20" />
      <Skeleton className="h-10 w-full rounded-lg sm:w-48" />
      <Skeleton className="h-10 w-full rounded-lg sm:ml-auto sm:w-32" />
    </div>
  );
}
