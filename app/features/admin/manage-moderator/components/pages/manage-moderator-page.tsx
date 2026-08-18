import { useEffect, useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { InviteMemberModal } from "../invite-member-modal";
import { InviteSuccessModal } from "../invite-success-modal";
import { ManageModeratorPagination } from "../manage-moderator-pagination";
import { ManageModeratorTable } from "../manage-moderator-table";
import { ManageModeratorToolbar } from "../manage-moderator-toolbar";
import type { ManageModTeamLoaderData } from "../../types";

export default function ManageModeratorPage() {
  const { moderators, pagination, currentUserId } =
    useLoaderData<ManageModTeamLoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const location = useLocation();
  const fetcher = useFetcher();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fetcherError, setFetcherError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const lastIntent = useRef<string | null>(null);

  const roleParam = searchParams.get("role");
  const roleFilter =
    roleParam === "moderator" || roleParam === "super_admin"
      ? roleParam
      : ("all" as const);

  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  const handleSendInvitation = (data: { email: string; role: string }) => {
    lastIntent.current = "invite";
    setInviteError(null);
    const formData = new FormData();
    formData.append("intent", "invite");
    formData.append("email", data.email);
    formData.append("role", data.role);
    fetcher.submit(formData, { method: "post" });
  };

  const handleCursor = (cursor: string | null) => {
    setSearchParams((prev) => {
      if (cursor) prev.set("cursor", cursor);
      else prev.delete("cursor");
      return prev;
    });
  };

  const handleRemove = (id: string) => {
    lastIntent.current = "remove";
    const formData = new FormData();
    formData.append("intent", "remove");
    formData.append("memberId", id);
    fetcher.submit(formData, { method: "post" });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("search", value);
    else nextParams.delete("search");
    nextParams.delete("page");
    nextParams.delete("cursor");
    setSearchParams(nextParams, { replace: true });
  };

  const handleRoleChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== "all") nextParams.set("role", value);
    else nextParams.delete("role");
    nextParams.delete("cursor");
    setSearchParams(nextParams, { replace: true });
  };

  const handleRoleConfirm = (
    memberId: string,
    currentRole: string,
    newRole: string,
  ) => {
    lastIntent.current = "update-role";
    const formData = new FormData();
    formData.append("intent", "update-role");
    formData.append("memberId", memberId);
    formData.append("currentRole", currentRole);
    formData.append("role", newRole);
    fetcher.submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.state === "idle" && lastIntent.current !== null) {
      const intent = lastIntent.current;
      lastIntent.current = null;

      if (fetcher.data?.ok) {
        if (intent === "invite") {
          setShowSuccessModal(true);
          setShowInviteModal(false);
          setInviteError(null);
        } else if (intent === "remove") {
          toast.success("Moderator removed successfully.");
        } else if (intent === "update-role") {
          toast.success("Moderator role updated successfully.");
        }
        setFetcherError(null);
      } else {
        const actions: Record<string, string> = {
          invite: "send invitation",
          remove: "remove member",
          "update-role": "update moderator role",
        };
        const label = actions[intent] ?? "perform action";
        const message =
          fetcher.data?.message ?? `Failed to ${label}. Please try again.`;
        if (intent === "invite") {
          setInviteError(message);
        } else {
          setFetcherError(message);
          toast.error(message);
        }
      }
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <div className="max-w-full space-y-10 p-10">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold tracking-tighter text-slate-900 dark:text-white">
            Team Member
          </h1>
          <p className="font-sans font-medium text-slate-500">
            Manage administrative privileges and workspace collaboration.
          </p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-6 text-[11px] font-semibold tracking-widest text-white uppercase transition-all active:scale-95"
        >
          <UserPlus size={16} /> Invite Member
        </Button>
      </div>

      {fetcherError && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-600 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
          {fetcherError}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <ManageModeratorToolbar
          searchValue={searchInput}
          roleValue={roleFilter}
          onSearchChange={handleSearchChange}
          onRoleChange={handleRoleChange}
        />
        <ManageModeratorTable
          moderators={moderators}
          isLoading={isLoading}
          searchValue={searchInput}
          onClearSearch={() => handleSearchChange("")}
          onRemove={handleRemove}
          onRoleConfirm={handleRoleConfirm}
          currentUserId={currentUserId}
        />
        <ManageModeratorPagination
          pagination={pagination}
          hasCursor={Boolean(searchParams.get("cursor"))}
          onCursorChange={handleCursor}
        />
      </div>

      <InviteMemberModal
        isOpen={showInviteModal}
        isLoading={fetcher.state !== "idle" && lastIntent.current === "invite"}
        onClose={() => {
          setShowInviteModal(false);
          setInviteError(null);
        }}
        onSend={handleSendInvitation}
        serverError={inviteError}
      />

      <InviteSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
