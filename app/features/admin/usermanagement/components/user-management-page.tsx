import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search, Users } from "lucide-react";

import { MOCK_USERS } from "../mock-users";
import type { User, UserStatus } from "../types";
import {
  AddUserModal,
  UserTable,
  UserProfileOverlay,
} from "./user-management-components";

type UserManagementPageProps = {
  userRole?: string;
  triggerAddModal?: boolean;
  initialAddModalOpen?: boolean;
  onModalTriggered?: () => void;
};

type CreatedUser = {
  email: string;
  password: string;
};

export function UserManagementPage({
  userRole,
  triggerAddModal,
  initialAddModalOpen = false,
  onModalTriggered,
}: UserManagementPageProps) {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all");
  const [sortBy, setSortBy] = useState<keyof User | "none">("none");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(initialAddModalOpen);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    "reset" | "suspend" | null
  >(null);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);

  useEffect(() => {
    if (triggerAddModal || initialAddModalOpen) {
      setCreatedUser(null);
      setShowAddModal(true);
      onModalTriggered?.();
    }
  }, [initialAddModalOpen, onModalTriggered, triggerAddModal]);

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
    );
    setSelectedUser((prev) =>
      prev && prev.id === userId ? { ...prev, ...updates } : prev,
    );
  };

  const isSuperAdmin = userRole === "Super Admin";

  const redactEmail = (email: string) => {
    if (isSuperAdmin) return email;

    const [name, domain] = email.split("@");

    return `${name.substring(0, 2)}***@***${domain.substring(domain.length - 4)}`;
  };

  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    if (sortBy !== "none") {
      result = [...result].sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        return 0;
      });
    }

    return result;
  }, [filterStatus, searchQuery, sortBy, sortDirection, users]);

  const handleSort = (key: keyof User) => {
    if (sortBy === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(key);
    setSortDirection("asc");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 relative">
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        <div className="max-w-350 mx-auto space-y-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                User Management
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Manage platform users, roles, and access permissions.
              </p>
            </div>
            <button
              onClick={() => {
                setCreatedUser(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Plus size={16} />
              <span>Add New User</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="bg-slate-50/50 dark:bg-slate-800 py-2.5 pl-11 pr-4 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-64"
                  />
                </div>
                <select className="bg-slate-50/50 dark:bg-slate-800 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
                  <option>All Tiers</option>
                  <option>Tier 1</option>
                  <option>Tier 2</option>
                  <option>Tier 3</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(event) =>
                    setFilterStatus(event.target.value as UserStatus | "all")
                  }
                  className="bg-slate-50/50 dark:bg-slate-800 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl transition-all">
                  <Download size={14} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {filteredUsers.length > 0 ? (
              <UserTable
                users={filteredUsers}
                activeDropdown={activeDropdown}
                isSuperAdmin={isSuperAdmin}
                setActiveDropdown={setActiveDropdown}
                setSelectedUser={setSelectedUser}
                setConfirmationAction={setConfirmationAction}
                handleSort={handleSort}
                updateUser={updateUser}
                redactEmail={redactEmail}
              />
            ) : (
              <EmptyUsersState
                filterStatus={filterStatus}
                onClearFilter={() => setFilterStatus("all")}
              />
            )}
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserProfileOverlay
          selectedUser={selectedUser}
          confirmationAction={confirmationAction}
          showPointsModal={showPointsModal}
          showTierModal={showTierModal}
          setShowPointsModal={setShowPointsModal}
          setShowTierModal={setShowTierModal}
          setSelectedUser={setSelectedUser}
          setConfirmationAction={setConfirmationAction}
          updateUser={updateUser}
        />
      )}

      <AddUserModal
        show={showAddModal}
        createdUser={createdUser}
        onClose={() => setShowAddModal(false)}
        setCreatedUser={setCreatedUser}
      />
    </div>
  );
}

function EmptyUsersState({
  filterStatus,
  onClearFilter,
}: {
  filterStatus: UserStatus | "all";
  onClearFilter: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700">
        <Users size={40} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        No members found
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        {filterStatus !== "all"
          ? `There are currently no users with the status "${filterStatus}". Try checking another category or clearing filters.`
          : "We couldn't find any members matching your search criteria. Try a different name or email address."}
      </p>
      {filterStatus !== "all" && (
        <button
          onClick={onClearFilter}
          className="mt-6 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
        >
          Show all members
        </button>
      )}
    </div>
  );
}
