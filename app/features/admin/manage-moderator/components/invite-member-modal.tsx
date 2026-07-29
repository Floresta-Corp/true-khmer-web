import { useEffect, useState } from "react";
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
  serverError?: string | null;
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
  serverError = null,
}: InviteMemberModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState(ROLE_OPTIONS[1].value);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Reset local state whenever the modal is closed (success or cancel).
  useEffect(() => {
    if (!isOpen) {
      setInviteEmail("");
      setRole(ROLE_OPTIONS[1].value);
      setEmailError(null);
    }
  }, [isOpen]);

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
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(e.target.value);
    if (emailError) setEmailError(null);
  };

  const handleClose = () => {
    if (isLoading) return;
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
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-visible rounded-2xl border border-slate-100 bg-white p-10 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="rounded-xl p-3 dark:bg-slate-900 dark:text-white">
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

        <h3 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Invite Team Member
        </h3>
        <p className="mb-10 text-sm leading-relaxed font-medium text-slate-500">
          Send an invitation email to add a new administrator or moderator to
          your workspace.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Email Address
            </Label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={handleEmailChange}
              placeholder="name@company.com"
              className={`w-full rounded-xl bg-slate-50 px-4 py-5 text-sm transition-all focus:outline-none dark:bg-slate-950 dark:text-white ${
                emailError
                  ? "border-2 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border border-slate-100 focus:border-slate-900 dark:border-slate-800"
              }`}
            />
            {emailError && (
              <p className="ml-1 text-xs font-semibold text-red-500 transition-all">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Assign Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-auto w-full rounded-md border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-slate-900 focus:ring-0 focus:ring-offset-0 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white [&>svg]:opacity-50">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>

              <SelectContent className="z-110 rounded-xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
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

          {serverError && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-500 dark:border-red-800 dark:bg-red-900/20">
              {serverError}
            </p>
          )}

          <div className="flex gap-4 pt-6">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-slate-100 py-5 text-[11px] font-semibold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-5 text-[11px] font-semibold tracking-widest text-white uppercase transition-all hover:bg-blue-800 active:scale-95 disabled:opacity-70"
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
