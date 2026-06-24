import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import type { loader } from "../routes/manage-moderator";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  UserPlus,
} from "lucide-react";
import { InviteMemberModal } from "../components/invite-member-modal";
import { InviteSuccessModal } from "../components/invite-success-modal";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import RemoveModeratorMember from "../components/remove-moderator-member";

export default function ManageModeratorPage() {
  const { moderators, pagination } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fetcherError, setFetcherError] = useState<string | null>(null);
  const lastIntent = useRef<string | null>(null);
  const fetcher = useFetcher();

  const handleSendInvitation = (data: { email: string; role: string }) => {
    lastIntent.current = "invite";
    const formData = new FormData();
    formData.append("intent", "invite");
    formData.append("email", data.email);
    formData.append("role", data.role);

    fetcher.submit(formData, { method: "post" });
    setShowInviteModal(false);
  };

  const handleCursor = (cursor: string | null) => {
    if (cursor) {
      setSearchParams((prev) => {
        prev.set("cursor", cursor);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("cursor");
        return prev;
      });
    }
  };

  const handleRemove = (id: string) => {
    lastIntent.current = "remove";
    const formData = new FormData();
    formData.append("intent", "remove");
    formData.append("memberId", id);
    fetcher.submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        if (lastIntent.current === "invite") {
          setShowSuccessModal(true);
          setShowInviteModal(false);
        }
        setFetcherError(null);
      } else {
        const action =
          lastIntent.current === "invite" ? "send invitation" : "remove member";
        setFetcherError(
          fetcher.data.message ?? `Failed to ${action}. Please try again.`,
        );
      }
      lastIntent.current = null;
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Team Member
          </h1>
          <p className="text-slate-500 font-medium font-sans">
            Manage administrative privileges and workspace collaboration.
          </p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-3 px-8 py-6 bg-blue-600 text-white rounded-xl text-[11px] font-semibold uppercase tracking-widest active:scale-95 transition-all"
        >
          <UserPlus size={16} /> Invite Member
        </Button>
      </div>

      {fetcherError && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-4 text-rose-600 dark:text-rose-400 text-sm font-medium">
          {fetcherError}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <Input
              placeholder="Search by name or email..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-950 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled
              variant="ghost"
              className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white rounded-xl transition-all"
            >
              <Filter size={20} />
            </Button>
          </div>
        </div>

        <Table className="w-full">
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/30 pointer-events-none [&_tr]:border-b dark:[&_tr]:border-slate-700">
            <TableRow className="border-b-0">
              <TableHead className="px-8 py-4 text-[12px] font-medium text-slate-500 uppercase tracking-widest">
                Member
              </TableHead>
              <TableHead className="px-8 py-4 text-[12px] font-medium text-slate-400 uppercase tracking-widest">
                Access Role
              </TableHead>
              <TableHead className="px-8 py-4 text-[12px] font-medium text-slate-400 uppercase tracking-widest">
                Status
              </TableHead>
              <TableHead className="px-8 py-4 text-[12px] font-medium text-center text-slate-400 uppercase tracking-widest">
                Last activity
              </TableHead>
              <TableHead className="px-8 py-5 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-50 dark:divide-slate-800">
            {moderators.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-8 py-12 text-center text-slate-400 text-sm"
                >
                  No team members found.
                </TableCell>
              </TableRow>
            )}
            {moderators.map((member) => (
              <TableRow
                key={member.id}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all overflow-visible data-[state=selected]:bg-transparent! has-aria-expanded:bg-transparent!"
              >
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                      {member?.firstName?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-xl text-[12px] font-semibold tracking-tight inline-block border border-slate-100 dark:border-slate-800">
                    {member.role === "MODERATOR" ? "Moderator" : member.role}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6 text-center">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-xl  bg-emerald-500" />
                    <span className="text-sm font-medium  text-slate-600 dark:text-slate-300">
                      Active
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-sm font-medium text-center text-slate-500 dark:text-slate-400">
                  {member.lastActive ?? "Never"}
                </TableCell>
                <TableCell className="px-8 py-6 text-right static">
                  <RemoveModeratorMember
                    memberId={member.id}
                    firstName={member.firstName ?? ""}
                    lastName={member.lastName ?? ""}
                    onRemove={handleRemove}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination && (pagination.hasMore || searchParams.get("cursor")) && (
          <div className="px-8 py-4  border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => handleCursor(null)}
              disabled={!searchParams.get("cursor")}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => handleCursor(pagination.nextCursor)}
              disabled={!pagination.hasMore}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <InviteMemberModal
        isOpen={showInviteModal}
        isLoading={fetcher.state !== "idle" && lastIntent.current === "invite"}
        onClose={() => setShowInviteModal(false)}
        onSend={handleSendInvitation}
      />

      <InviteSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
