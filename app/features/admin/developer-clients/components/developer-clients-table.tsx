import {
  Apple,
  Check,
  Copy,
  Globe,
  Smartphone,
  KeyRound,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  AdminHeaderCell,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderRow,
  AdminTableRow,
} from "~/features/admin/components/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { copyToClipboard } from "~/lib/clipboard";
import { resolveImageURL } from "~/lib/utils";
import type { DeveloperClientResponse as DeveloperClient } from "~/types/api-client";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Origins read better without the scheme; the full value stays in the title. */
function shortOrigin(origin: string) {
  return origin.replace(/^https?:\/\//, "");
}

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function ClientAvatar({ client }: { client: DeveloperClient }) {
  const logo = client.logoUrl ?? client.logoKey;

  return (
    <Avatar size="lg" className="rounded-xl after:rounded-xl">
      {logo ? (
        <AvatarImage
          src={resolveImageURL(logo)}
          alt=""
          className="rounded-xl bg-white object-contain p-1 dark:bg-slate-950"
        />
      ) : null}
      <AvatarFallback className="rounded-xl bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        {initialsOf(client.name)}
      </AvatarFallback>
    </Avatar>
  );
}

function StatusBadge({ status }: { status: DeveloperClient["status"] }) {
  const isActive = status === "ACTIVE";

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
        isActive
          ? "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {isActive ? "Active" : "Disabled"}
    </Badge>
  );
}

function ClientIdCell({ clientId }: { clientId: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(clientId, {
      successMessage: "Client ID copied to clipboard.",
      errorMessage: "Failed to copy the client ID.",
    });
    if (!ok) return;
    setCopied(true);
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <code
        title={clientId}
        className="min-w-0 flex-1 truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
      >
        {clientId}
      </code>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Copy client ID"
        onClick={handleCopy}
        className="shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>
    </div>
  );
}

function OriginsCell({ origins }: { origins: string[] }) {
  if (origins.length === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
        <ShieldAlert className="size-3" />
        None set
      </span>
    );
  }

  return (
    <div
      title={origins.join("\n")}
      className="flex min-w-0 items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300"
    >
      <Globe className="size-3.5 shrink-0 text-slate-400" />
      <span className="truncate font-mono text-xs">
        {shortOrigin(origins[0])}
      </span>
      {origins.length > 1 && (
        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          +{origins.length - 1}
        </span>
      )}
    </div>
  );
}

function PlatformBadge({ type }: { type: DeveloperClient["clientType"] }) {
  const label = type === "WEB" ? "Web" : type === "IOS" ? "iOS" : "Android";
  const Icon = type === "WEB" ? Globe : type === "IOS" ? Apple : Smartphone;
  return (
    <Badge
      variant="outline"
      className="gap-1.5 rounded-lg border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    >
      <Icon className="size-3" /> {label}
    </Badge>
  );
}

function AppIdentityCell({ client }: { client: DeveloperClient }) {
  if (client.clientType === "WEB") {
    return <OriginsCell origins={client.allowedOrigins} />;
  }

  const primary =
    client.clientType === "IOS"
      ? client.iosBundleIdentifier
      : client.androidPackageName;
  const secondary =
    client.clientType === "ANDROID"
      ? `${client.androidSha1Fingerprints.length} signing certificate${client.androidSha1Fingerprints.length === 1 ? "" : "s"}`
      : client.redirectScheme;

  return (
    <div className="min-w-0">
      <p
        title={primary ?? undefined}
        className="truncate font-mono text-xs text-slate-600 dark:text-slate-300"
      >
        {primary ?? "Not configured"}
      </p>
      <p
        title={secondary ?? undefined}
        className="mt-1 truncate text-[11px] text-slate-400 dark:text-slate-500"
      >
        {secondary}
      </p>
    </div>
  );
}

function SecretCell({ last4 }: { last4: string | null }) {
  if (!last4) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
        <ShieldAlert className="size-3" />
        No secret
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 dark:text-slate-400">
      <span aria-hidden className="tracking-tight">
        ••••
      </span>
      {last4}
    </span>
  );
}

type RowActions = {
  onEdit: (client: DeveloperClient) => void;
  onRegenerate: (client: DeveloperClient) => void;
  onRegenerateSecret: (client: DeveloperClient) => void;
  onDelete: (client: DeveloperClient) => void;
};

function RowMenu({
  client,
  onEdit,
  onRegenerate,
  onRegenerateSecret,
  onDelete,
}: RowActions & { client: DeveloperClient }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${client.name}`}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onEdit(client)}>
          <Pencil className="size-4" /> Edit details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onRegenerateSecret(client)}>
          <KeyRound className="size-4" /> Regenerate secret
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onRegenerate(client)}>
          <RefreshCw className="size-4" /> Regenerate client ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onDelete(client)}
          className="text-rose-600 focus:text-rose-600 dark:text-rose-400"
        >
          <Trash2 className="size-4" /> Delete client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NameCell({ client }: { client: DeveloperClient }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ClientAvatar client={client} />
      <div className="min-w-0">
        <p
          title={client.description ?? undefined}
          className="truncate text-sm font-semibold text-slate-900 dark:text-white"
        >
          {client.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
          {client.contactEmail ?? "No contact email"}
        </p>
      </div>
    </div>
  );
}

/**
 * Percentages rather than fixed widths: the panel is narrower than the seven
 * columns this table used to have, so everything shares one page width instead
 * of scrolling sideways. Long values truncate and keep a title tooltip.
 */
const COLUMNS = [
  { key: "client", label: "Client", className: "w-[23%] px-4" },
  { key: "credentials", label: "Credentials", className: "w-[24%] px-4" },
  { key: "platform", label: "Platform", className: "w-[12%] px-3" },
  { key: "identity", label: "App identity", className: "w-[21%] px-4" },
  {
    key: "status",
    label: "Status",
    className: "w-[13%] px-3",
    align: "center" as const,
  },
  // No visible label: "Actions" is wider than the column the icon button needs,
  // so it spilled past the panel edge. The row button carries its own label.
  {
    key: "actions",
    label: "",
    srLabel: "Actions",
    className: "w-[7%] px-2",
    align: "center" as const,
  },
];

/** Tighter than the shared admin default so five columns fit at 1024px. */
const CELL_CLASS = "px-4";
/** Narrower still: this column only holds a 32px icon button. */
const ACTIONS_CELL_CLASS = "px-2";

function TableHeader() {
  return (
    <AdminTableHead>
      <AdminTableHeaderRow>
        {COLUMNS.map((column) => (
          <AdminHeaderCell
            key={column.key}
            label={column.label}
            aria-label={column.srLabel}
            align={column.align ?? "left"}
            className={column.className}
          />
        ))}
      </AdminTableHeaderRow>
    </AdminTableHead>
  );
}

export function DeveloperClientsTable({
  clients,
  onEdit,
  onRegenerate,
  onRegenerateSecret,
  onDelete,
}: RowActions & { clients: DeveloperClient[] }) {
  return (
    <>
      {/* Desktop table view */}
      <div className="hidden min-h-0 flex-1 overflow-x-hidden overflow-y-auto lg:block">
        <AdminTable className="w-full table-fixed">
          <TableHeader />
          <AdminTableBody>
            {clients.map((client) => (
              <AdminTableRow key={client.id} className="h-20">
                <AdminTableCell className={CELL_CLASS}>
                  <NameCell client={client} />
                </AdminTableCell>
                <AdminTableCell className={CELL_CLASS}>
                  <ClientIdCell clientId={client.clientId} />
                  <div className="mt-1 pl-0.5">
                    <SecretCell last4={client.clientSecretLast4} />
                  </div>
                </AdminTableCell>
                <AdminTableCell className={CELL_CLASS}>
                  <PlatformBadge type={client.clientType} />
                </AdminTableCell>
                <AdminTableCell className={CELL_CLASS}>
                  <AppIdentityCell client={client} />
                </AdminTableCell>
                <AdminTableCell align="center" className={CELL_CLASS}>
                  <StatusBadge status={client.status} />
                  <p className="mt-1 text-[11px] leading-4 text-slate-400 dark:text-slate-500">
                    Added {formatDate(client.createdAt)}
                  </p>
                </AdminTableCell>
                <AdminTableCell align="center" className={ACTIONS_CELL_CLASS}>
                  <RowMenu
                    client={client}
                    onEdit={onEdit}
                    onRegenerate={onRegenerate}
                    onRegenerateSecret={onRegenerateSecret}
                    onDelete={onDelete}
                  />
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      {/* Mobile / tablet card view */}
      <ul className="min-h-0 flex-1 space-y-3 overflow-auto p-4 lg:hidden">
        {clients.map((client) => (
          <li
            key={client.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40"
          >
            <div className="flex items-start justify-between gap-3">
              <NameCell client={client} />
              <RowMenu
                client={client}
                onEdit={onEdit}
                onRegenerate={onRegenerate}
                onRegenerateSecret={onRegenerateSecret}
                onDelete={onDelete}
              />
            </div>

            <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Client ID
                </span>
                <div className="min-w-0 flex-1">
                  <ClientIdCell clientId={client.clientId} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Secret
                </span>
                <SecretCell last4={client.clientSecretLast4} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="shrink-0 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Platform
                </span>
                <PlatformBadge type={client.clientType} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="shrink-0 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  App identity
                </span>
                <div className="min-w-0 text-right">
                  <AppIdentityCell client={client} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={client.status} />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(client.createdAt)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function DeveloperClientsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      className="min-h-0 flex-1 overflow-hidden"
      aria-label="Loading developer clients"
    >
      <div className="hidden lg:block">
        <AdminTable className="w-full table-fixed">
          <TableHeader />
          <AdminTableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <AdminTableRow key={index} className="h-20">
                <AdminTableCell className={CELL_CLASS}>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-28 max-w-full rounded" />
                      <Skeleton className="h-3 w-40 max-w-full rounded" />
                    </div>
                  </div>
                </AdminTableCell>
                <AdminTableCell className={CELL_CLASS}>
                  <Skeleton className="h-7 w-full rounded-md" />
                  <Skeleton className="mt-1.5 h-3 w-16 rounded" />
                </AdminTableCell>
                <AdminTableCell className={CELL_CLASS}>
                  <Skeleton className="h-7 w-20 rounded-lg" />
                </AdminTableCell>
                <AdminTableCell className={CELL_CLASS}>
                  <Skeleton className="h-4 w-full max-w-32 rounded" />
                </AdminTableCell>
                <AdminTableCell align="center" className={CELL_CLASS}>
                  <Skeleton className="mx-auto h-7 w-20 rounded-lg" />
                  <Skeleton className="mx-auto mt-1.5 h-3 w-24 rounded" />
                </AdminTableCell>
                <AdminTableCell align="center" className={ACTIONS_CELL_CLASS}>
                  <Skeleton className="mx-auto size-8 rounded-lg" />
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-44 max-w-full rounded" />
              </div>
            </div>
            <Skeleton className="h-7 w-full rounded-md" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-20 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeveloperClientsEmptyState({
  query,
  onCreate,
}: {
  query: string;
  onCreate: () => void;
}) {
  const isSearching = query !== "";

  return (
    <div className="flex min-h-80 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <KeyRound className="size-5" />
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
        {isSearching ? "No matching clients" : "No developer clients yet"}
      </h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
        {isSearching
          ? `Nothing matches "${query}". Try a different name, email, or client ID, or clear the current filters.`
          : "Register a partner platform to issue its client ID and secret."}
      </p>
      {!isSearching && (
        <Button
          type="button"
          onClick={onCreate}
          className="mt-5 h-10 rounded-lg bg-blue-600 px-4 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus />
          New Client
        </Button>
      )}
    </div>
  );
}
