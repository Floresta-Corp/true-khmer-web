import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, UserPlus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { email: string; role: string }) => void;
  isLoading: boolean;
}

const ROLE_OPTIONS = [
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Moderator", value: "MODERATOR" },
];

export function InviteMemberModal({
  isOpen,
  onClose,
  onSend,
  isLoading = false,
}: InviteMemberModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[1].value);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSend = () => {
    if (isLoading) return;
    const normalizedEmail = inviteEmail.trim();
    if (!normalizedEmail) {
      setEmailError("Email address is required");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError(null);
    onSend({ email: normalizedEmail, role });
    if (!isLoading) {
      setInviteEmail("");
      setRole(ROLE_OPTIONS[1].value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(e.target.value);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setEmailError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-10 overflow-visible border border-slate-100 dark:border-slate-800 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="p-3 dark:bg-slate-900 dark:text-white rounded-xl">
            <UserPlus size={24} />
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2 text-slate-500 hover:text-slate-900"
          >
            <X size={20} />
          </Button>
        </div>

        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">
          Invite Team Member
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
          Send an invitation email to add a new administrator or moderator to
          your workspace.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </Label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={handleEmailChange}
              placeholder="name@company.com"
              className={`w-full bg-slate-50 dark:bg-slate-950 rounded-xl py-5 px-4 text-sm dark:text-white focus:outline-none transition-all ${
                emailError
                  ? "border-2 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border border-slate-100 dark:border-slate-800 focus:border-slate-900"
              }`}
            />
            {emailError && (
              <p className="text-xs font-semibold text-red-500 ml-1 transition-all">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Assign Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:text-white dark:border-slate-800 rounded-md py-3 px-4 text-sm focus:outline-none focus:border-slate-900 transition-all focus:ring-0 focus:ring-offset-0 h-auto [&>svg]:opacity-50">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>

              <SelectContent className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-110">
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6 flex gap-4">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="flex-1 py-5 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-200 rounded-xl text-[11px] font-semibold uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="flex-1 py-5 bg-blue-600 text-white rounded-xl text-[11px] font-semibold uppercase tracking-widest hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
