import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useNavigation, useSearchParams } from "react-router";

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
import { debounce } from "~/lib/utils";
import type {
  AdminUserManagementFilters,
  AdminUserManagementListResponse,
} from "~/types/api-client";

import {
  UserManagementTableSkeleton,
  UserTable,
} from "./user-management-table";
import { UserManagementDetailSkeleton } from "./user-management-detail-skeleton";

const ALL_FILTERS = "all";

export function UserManagementPage({
  result,
}: {
  result: AdminUserManagementListResponse;
}) {
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(searchParam);

  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/tk-admin/users";
  const isOpeningUser =
    navigation.state === "loading" &&
    navigation.location?.pathname.startsWith("/tk-admin/user/");

  const updateSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParams(
          (current) => {
            const next = new URLSearchParams(current);
            const normalizedValue = value.trim();

            if (normalizedValue) next.set("search", normalizedValue);
            else next.delete("search");

            next.delete("page");
            return next;
          },
          { replace: true },
        );
      }, 350),
    [setSearchParams],
  );

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    if (searchInput.trim() === searchParam) return;
    updateSearch(searchInput);
    return () => updateSearch.cancel();
  }, [searchInput, searchParam, updateSearch]);

  function updateFilter(name: "status" | "tier", value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (value === ALL_FILTERS) next.delete(name);
      else next.set(name, value);

      next.delete("page");
      return next;
    });
  }

  if (isOpeningUser) {
    return <UserManagementDetailSkeleton />;
  }

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-350">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              User Management
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Manage platform users, roles, and access permissions.
            </p>
          </div>

          <Button
            type="button"
            disabled
            size="lg"
            title="User creation will be integrated in a later step."
            className="h-10 w-full rounded-lg bg-blue-600 px-4 font-semibold shadow-sm hover:bg-blue-700 sm:w-auto"
          >
            <Plus />
            Add New User
          </Button>
        </header>

        <section
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <div className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-blue-500" />
          ) : null}

          <UserManagementToolbar
            searchInput={searchInput}
            tier={searchParams.get("tier") ?? ALL_FILTERS}
            status={searchParams.get("status") ?? ALL_FILTERS}
            tiers={result.filters.tiers}
            statuses={result.filters.statuses}
            onSearchChange={setSearchInput}
            onTierChange={(value) => updateFilter("tier", value)}
            onStatusChange={(value) => updateFilter("status", value)}
          />

          {result.users.length > 0 ? (
            <>
              <UserTable users={result.users} />
              <UserManagementPagination
                page={result.page}
                limit={result.limit}
                totalPages={result.totalPages}
                total={result.total}
              />
            </>
          ) : (
            <EmptyUsersState hasSearch={Boolean(searchParam)} />
          )}
        </section>
      </div>
    </main>
  );
}

export function UserManagementPageSkeleton() {
  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-350">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              User Management
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Manage platform users, roles, and access permissions.
            </p>
          </div>
          <Button
            type="button"
            disabled
            size="lg"
            className="h-10 w-full rounded-lg bg-blue-600 px-4 font-semibold shadow-sm sm:w-auto"
          >
            <Plus />
            Add New User
          </Button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <UserManagementToolbarSkeleton />
          <UserManagementTableSkeleton rows={10} />
          <UserManagementPaginationSkeleton />
        </section>
      </div>
    </main>
  );
}

function UserManagementToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5 dark:border-slate-800">
      <Skeleton className="h-10 w-full rounded-lg sm:w-72" />
      <Skeleton className="h-10 w-full rounded-lg sm:w-40" />
      <Skeleton className="h-10 w-full rounded-lg sm:w-48" />
      <Skeleton className="h-10 w-full rounded-lg sm:ml-auto sm:w-24" />
    </div>
  );
}

function UserManagementPaginationSkeleton() {
  return (
    <footer className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
      <Skeleton className="h-4 w-44 rounded" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
    </footer>
  );
}

type ToolbarProps = {
  searchInput: string;
  tier: string;
  status: string;
  tiers: AdminUserManagementFilters["tiers"];
  statuses: AdminUserManagementFilters["statuses"];
  onSearchChange: (value: string) => void;
  onTierChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

function UserManagementToolbar({
  searchInput,
  tier,
  status,
  tiers,
  statuses,
  onSearchChange,
  onTierChange,
  onStatusChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5 dark:border-slate-800">
      <InputGroup className="h-10 bg-slate-50 sm:w-72 dark:bg-slate-950/50">
        <InputGroupAddon className="pl-3">
          <Search className="size-4 text-slate-400" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          aria-label="Search users"
          placeholder="Search users..."
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
          className="px-2 text-sm font-medium placeholder:font-normal"
        />
      </InputGroup>

      <Select value={tier} onValueChange={onTierChange}>
        <SelectTrigger
          aria-label="Filter by tier"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-40 dark:bg-slate-950/50"
        >
          <SelectValue placeholder="All tiers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTERS}>All tiers</SelectItem>
          {tiers.map((item) => (
            <SelectItem key={item.id} value={item.slug}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger
          aria-label="Filter by status"
          className="h-10 w-full rounded-lg bg-white text-sm font-medium shadow-none sm:w-48 dark:bg-slate-950/50"
        >
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTERS}>All statuses</SelectItem>
          {statuses.map((item) => (
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
        className="h-10 rounded-lg font-medium shadow-none sm:ml-auto"
      >
        <Download />
        Export
      </Button>
    </div>
  );
}

function UserManagementPagination({
  page,
  limit,
  totalPages,
  total,
}: {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  function goToPage(nextPage: number) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("page", String(nextPage));
      return next;
    });
  }

  return (
    <footer className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {firstItem}–{lastItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {total.toLocaleString()}
        </span>{" "}
        users
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          aria-label="Previous page"
          className="shadow-none"
        >
          <ChevronLeft />
        </Button>
        <span className="min-w-24 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          aria-label="Next page"
          className="shadow-none"
        >
          <ChevronRight />
        </Button>
      </div>
    </footer>
  );
}

function EmptyUsersState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Users className="size-5" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        No users found
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        {hasSearch
          ? "Try a different name or email address, or clear the current filters."
          : "No users match the selected filters."}
      </p>
    </div>
  );
}
