import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { ListModeratorsResponse } from "~/types/api-client";

import { EmptySearchState, EmptyTeamState } from "./empty-search-state";
import { ModeratorRoles } from "./moderator-roles";
import { ModeratorStatusBadge } from "./moderator-status-badge";
import RemoveModeratorMember from "./remove-moderator-member";
import ManageModeratorSkeleton from "./manage-moderator-skeleton";

type ModeratorMember = ListModeratorsResponse["moderators"][number];

interface ManageModeratorTableProps {
  moderators: ModeratorMember[];
  searchValue: string;
  isLoading?: boolean;
  currentUserId?: string;
  onClearSearch: () => void;
  onRemove: (id: string) => void;
  onRoleConfirm: (
    memberId: string,
    currentRole: ModeratorMember["role"] | string,
    newRole: ModeratorMember["role"],
  ) => void;
}

function getInitials(member: ModeratorMember) {
  return (
    member.firstName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() ?? "?"
  );
}

export function ManageModeratorTable({
  moderators,
  searchValue,
  isLoading,
  onClearSearch,
  currentUserId,
  onRemove,
  onRoleConfirm,
}: ManageModeratorTableProps) {
  return (
    <Table>
      <TableHeader className="pointer-events-none bg-slate-50/50 dark:bg-slate-900 [&_tr]:border-b dark:[&_tr]:border-slate-700">
        <TableRow className="border-b-0">
          <TableHead className="px-8 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Member
          </TableHead>
          <TableHead className="px-8 py-4 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Access Role
          </TableHead>
          <TableHead className="px-10 py-4 text-center text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Status
          </TableHead>
          <TableHead className="px-8 py-4 text-center text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Last activity
          </TableHead>
          <TableHead className="px-8 py-4 text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="relative divide-y divide-slate-50 dark:divide-slate-800">
        {isLoading ? (
          <ManageModeratorSkeleton />
        ) : (
          <ManageModeratorTableContent
            moderators={moderators}
            searchValue={searchValue}
            onClearSearch={onClearSearch}
            currentUserId={currentUserId}
            onRemove={onRemove}
            onRoleConfirm={onRoleConfirm}
          />
        )}
      </TableBody>
    </Table>
  );
}

function ManageModeratorTableContent({
  moderators,
  searchValue,
  onClearSearch,
  onRemove,
  currentUserId,
  onRoleConfirm,
}: {
  moderators: ModeratorMember[];
  searchValue: string;
  currentUserId?: string;
  onClearSearch: () => void;
  onRemove: (id: string) => void;
  onRoleConfirm: ManageModeratorTableProps["onRoleConfirm"];
}) {
  if (moderators.length === 0 && searchValue) {
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <EmptySearchState searchTerm={searchValue} onClear={onClearSearch} />
        </TableCell>
      </TableRow>
    );
  }

  if (moderators.length === 0 && !searchValue) {
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <EmptyTeamState />
        </TableCell>
      </TableRow>
    );
  }

  return moderators.map((member) => (
    <TableRow
      key={member.id}
      className="group overflow-visible transition-all hover:bg-slate-50/50 has-aria-expanded:bg-transparent! data-[state=selected]:bg-transparent! dark:hover:bg-slate-800/20"
    >
      <TableCell className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-400 dark:bg-slate-800">
            {getInitials(member)}
          </div>
          <div>
            <p className="text-sm leading-tight font-semibold text-slate-900 dark:text-white">
              {member.firstName} {member.lastName}
            </p>
            <p className="text-xs font-medium text-slate-400">{member.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-8 py-6">
        <ModeratorRoles
          currentRole={member.role}
          memberId={member.id}
          onRoleConfirm={onRoleConfirm}
        />
      </TableCell>
      <TableCell className="px-8 py-6 text-center">
        <ModeratorStatusBadge status={member.status ?? ""} />
      </TableCell>
      <TableCell className="px-8 py-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
        {member.lastActive ?? "Never"}
      </TableCell>
      <TableCell className="static px-8 py-6 text-right">
        {member.id !== currentUserId && (
          <RemoveModeratorMember
            memberId={member.id}
            firstName={member.firstName ?? ""}
            lastName={member.lastName ?? ""}
            onRemove={onRemove}
          />
        )}
      </TableCell>
    </TableRow>
  ));
}
