import {
  Check,
  Copy,
  KeyRound,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  AdminHeaderCell,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderRow,
  AdminTableRow,
} from "~/features/admin/components/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { copyToClipboard } from "~/lib/clipboard";
import type { DeveloperClient } from "../types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: DeveloperClient["status"] }) {
  if (status === "ACTIVE") {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
        Active
      </Badge>
    );
  }
  return (
    <Badge className="border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      Disabled
    </Badge>
  );
}

function ClientIdCell({ clientId }: { clientId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(clientId, {
      successMessage: "Client ID copied to clipboard.",
      errorMessage: "Failed to copy the client ID.",
    });
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-2">
      <code className="max-w-[16rem] truncate rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {clientId}
      </code>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Copy client ID for this developer client`}
        onClick={handleCopy}
        className="size-7 shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
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

type RowActions = {
  onEdit: (client: DeveloperClient) => void;
  onRegenerate: (client: DeveloperClient) => void;
  onDelete: (client: DeveloperClient) => void;
};

function RowMenu({
  client,
  onEdit,
  onRegenerate,
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
          className="size-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onEdit(client)}>
          <Pencil className="size-4" /> Edit details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onRegenerate(client)}>
          <RefreshCw className="size-4" /> Regenerate client ID
        </DropdownMenuItem>
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

export function DeveloperClientsTable({
  clients,
  onEdit,
  onRegenerate,
  onDelete,
}: RowActions & { clients: DeveloperClient[] }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderRow>
              <AdminHeaderCell label="Name" />
              <AdminHeaderCell label="Client ID" />
              <AdminHeaderCell label="Contact" />
              <AdminHeaderCell label="Status" />
              <AdminHeaderCell label="Created" />
              <AdminHeaderCell label="" align="right" />
            </AdminTableHeaderRow>
          </AdminTableHead>
          <AdminTableBody>
            {clients.map((client) => (
              <AdminTableRow key={client.id}>
                <AdminTableCell>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {client.name}
                  </p>
                  {client.description && (
                    <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
                      {client.description}
                    </p>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <ClientIdCell clientId={client.clientId} />
                </AdminTableCell>
                <AdminTableCell className="text-sm text-slate-600 dark:text-slate-300">
                  {client.contactEmail ?? "—"}
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={client.status} />
                </AdminTableCell>
                <AdminTableCell className="text-sm whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {formatDate(client.createdAt)}
                </AdminTableCell>
                <AdminTableCell align="right">
                  <RowMenu
                    client={client}
                    onEdit={onEdit}
                    onRegenerate={onRegenerate}
                    onDelete={onDelete}
                  />
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      {/* Mobile */}
      <ul className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {clients.map((client) => (
          <li key={client.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
                  {client.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {client.contactEmail ?? "No contact email"}
                </p>
              </div>
              <RowMenu
                client={client}
                onEdit={onEdit}
                onRegenerate={onRegenerate}
                onDelete={onDelete}
              />
            </div>
            <ClientIdCell clientId={client.clientId} />
            <div className="flex items-center justify-between">
              <StatusBadge status={client.status} />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(client.createdAt)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function DeveloperClientsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="min-h-0 flex-1 space-y-3 p-5">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-6 w-56 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="ml-auto size-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function DeveloperClientsEmptyState({ query }: { query: string }) {
  return (
    <div className="p-10 text-center">
      <div className="flex flex-col items-center space-y-3">
        <KeyRound className="size-12 text-slate-300 dark:text-slate-600" />
        <p className="text-slate-500 dark:text-slate-400">
          {query
            ? `No developer clients match your search "${query}"`
            : "No developer clients have been created yet"}
        </p>
      </div>
    </div>
  );
}
