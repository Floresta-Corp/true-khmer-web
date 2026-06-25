import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
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
  onRemove,
  onRoleConfirm,
}: ManageModeratorTableProps) {
  return (
    <Table>
      <TableHeader className="bg-slate-50/50 dark:bg-slate-900 pointer-events-none [&_tr]:border-b dark:[&_tr]:border-slate-700">
        <TableRow className="border-b-0">
          <TableHead className="px-8 py-4 text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wide">
            Member
          </TableHead>
          <TableHead className="px-8 py-4 text-xs font-semibold text-slate-500 text-left dark:text-slate-400 uppercase tracking-wide">
            Access Role
          </TableHead>
          <TableHead className="px-10 py-4 text-xs font-semibold text-slate-500 text-center dark:text-slate-400 uppercase tracking-wide">
            Status
          </TableHead>
          <TableHead className="px-8 py-4 text-xs font-semibold text-center text-slate-500 dark:text-slate-400 uppercase tracking-wide">
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
  onRoleConfirm,
}: {
  moderators: ModeratorMember[];
  searchValue: string;
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
      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all overflow-visible data-[state=selected]:bg-transparent! has-aria-expanded:bg-transparent!"
    >
      <TableCell className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
            {getInitials(member)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {member.firstName} {member.lastName}
            </p>
            <p className="text-xs text-slate-400 font-medium">{member.email}</p>
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
      <TableCell className="px-8 py-6 text-sm font-medium text-center text-slate-500 dark:text-slate-400">
        {member.lastActive ?? "Never"}
      </TableCell>
      <TableCell className="px-8 py-6 text-right static">
        <RemoveModeratorMember
          memberId={member.id}
          firstName={member.firstName ?? ""}
          lastName={member.lastName ?? ""}
          onRemove={onRemove}
        />
      </TableCell>
    </TableRow>
  ));
}
