import { useFetcher, useLoaderData, useLocation, useNavigation, useSearchParams } from "react-router";
import type { loader } from "../routes/manage-moderator";
import { useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { InviteMemberModal } from "../components/invite-member-modal";
import { InviteSuccessModal } from "../components/invite-success-modal";
import { Button } from "~/components/ui/button";
import { ManageModeratorPagination } from "../components/manage-moderator-pagination";
import { ManageModeratorTable } from "../components/manage-moderator-table";
import { ManageModeratorToolbar } from "../components/manage-moderator-toolbar";

export default function ManageModeratorPage() {
  const { moderators, pagination } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const location = useLocation();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fetcherError, setFetcherError] = useState<string | null>(null);
  const lastIntent = useRef<string | null>(null);
  const fetcher = useFetcher();
  const applySearchParams = (nextParams: URLSearchParams) => {
    setSearchParams(nextParams, { replace: true });
  };
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  // Show skeleton when the route loader is revalidating (e.g. search, page change)
  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

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

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set("search", value);
    } else {
      nextParams.delete("search");
    }
    nextParams.delete("page");
    applySearchParams(nextParams);
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
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        if (lastIntent.current === "invite") {
          setShowSuccessModal(true);
          setShowInviteModal(false);
        }
        setFetcherError(null);
      } else {
        const actions = {
          invite: "send invitation",
          remove: "remove member",
          "update-role": "update moderator role",
        };
        const action =
          actions[lastIntent.current as keyof typeof actions] ??
          "perform action";
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
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tighter">
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
        <ManageModeratorToolbar
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
        />
        <ManageModeratorTable
          moderators={moderators}
          isLoading={isLoading}
          searchValue={searchInput}
          onClearSearch={() => handleSearchChange("")}
          onRemove={handleRemove}
          onRoleConfirm={handleRoleConfirm}
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
