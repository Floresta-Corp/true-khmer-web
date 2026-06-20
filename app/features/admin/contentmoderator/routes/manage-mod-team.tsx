import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  MoreVertical,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  X,
  AlertCircle,
  Key,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Trash2,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { manageModTeamLoader } from "../service/manage-mod-team.loader";
import { manageModTeamAction } from "../service/manage-mod-team.action";

export const loader = manageModTeamLoader;
export const action = manageModTeamAction;

export function meta() {
  return [{ title: "Team Management | True Khmer" }];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TeamManagementPage() {
  const { moderators, pagination } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleSendInvitation = () => {
    setShowInviteModal(false);
    setShowSuccessModal(true);
    setInviteEmail("");
  };

  const toggleStatus = (memberId: string) => {
    // TODO: wire to API action
    console.log("Toggle status", memberId);
    setActiveMenuId(null);
  };

  const removeMember = (memberId: string) => {
    // TODO: wire to API action
    console.log("Remove member", memberId);
    setActiveMenuId(null);
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
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <UserPlus size={16} /> Invite Member
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-slate-950 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Member
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Access Role
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Created At
              </th>
              <th className="px-8 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {moderators.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-12 text-center text-slate-400 text-sm"
                >
                  No team members found.
                </td>
              </tr>
            )}
            {moderators.map((member) => (
              <tr
                key={member.id}
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold tracking-tight inline-block border border-slate-100 dark:border-slate-800">
                    {member.role === "MODERATOR" ? "Moderator" : member.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Active
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                  {formatDate(member.createdAt)}
                </td>
                <td className="px-8 py-6 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenuId(
                        activeMenuId === member.id ? null : member.id,
                      )
                    }
                    className={`p-2 rounded-lg transition-all ${activeMenuId === member.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === member.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-8 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <History size={14} /> View History
                            </button>
                            <button
                              onClick={() => toggleStatus(member.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                            >
                              <ShieldAlert size={14} /> Suspend Member
                            </button>
                            <div className="h-px bg-slate-50 dark:bg-slate-800 my-1" />
                            <button
                              onClick={() => removeMember(member.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                            >
                              <Trash2 size={14} /> Remove Member
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination && (pagination.hasMore || searchParams.get("cursor")) && (
          <div className="px-8 py-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
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

      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-10 overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                  <UserPlus size={24} />
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-slate-300 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                Invite Team Member
              </h3>
              <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
                Send an invitation email to add a new administrator or moderator
                to your workspace.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:border-slate-900 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Assign Role
                  </label>
                  <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer">
                    <option>Admin</option>
                    <option>Moderator</option>
                    <option>Partner Manager</option>
                  </select>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-4 border border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvitation}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#020617] w-full max-w-sm rounded-[32px] p-10 text-center border border-slate-100 dark:border-slate-800 shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                Invitation Sent
              </h3>
              <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                The member will receive an email shortly with instructions to
                join the workspace.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
