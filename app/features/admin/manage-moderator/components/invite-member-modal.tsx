import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: {
    email: string;
    name: string;
    role: string;
    password: string;
  }) => void;
}

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Moderator", value: "moderator" },
  { label: "Partner Manager", value: "partner_manager" },
];

export function InviteMemberModal({
  isOpen,
  onClose,
  onSend,
}: InviteMemberModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[0].value);

  const handleSend = () => {
    onSend({ email: inviteEmail, name: inviteName, role, password });
    setInviteEmail("");
    setInviteName("");
    setPassword("");
    setRole(ROLE_OPTIONS[0].value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          Invite Team Member
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
          Send an invitation email to add a new administrator or moderator to
          your workspace.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <Input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Initial Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set an initial password"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Assign Role
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-3.5 px-4 text-sm font-bold focus:outline-none focus:border-slate-900 transition-all focus:ring-0 focus:ring-offset-0 h-auto [&>svg]:opacity-50">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm font-bold py-2.5 px-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 rounded-lg my-0.5"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 border border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              Send Invitation
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
