import { useState } from "react";
import { useNavigate } from "react-router";
import { Key } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Divider } from "./Divider";
import { SecurityRow } from "./SecurityRow";
import { TwoFactorToggle } from "./TwoFactorToggle";

export function SecurityView({
  email,
  enabled,
  onEdit2FA,
}: {
  email: string;
  enabled: boolean;
  onEdit2FA: () => void;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-[#1A2233]">Account Security</h2>

      <SecurityRow
        label="Email address"
        description="The email address associated with your account."
      >
        <span className="text-sm text-[#344256] font-medium">{email}</span>
      </SecurityRow>

      <Divider />

      <SecurityRow
        label="Password"
        description="Set a unique password to protect your account."
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="rounded-lg border-[#D1D9E6] text-[#344256] font-medium text-sm h-9 px-4 hover:bg-[#F0F4FA]"
            >
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EEF3FD] mx-auto mb-2">
                <Key className="size-5 text-[#2F6FE4]" />
              </div>
              <DialogTitle className="text-center text-[#1A2233]">
                Change your password
              </DialogTitle>
              <DialogDescription className="text-center text-[#6B7A99]">
                We'll send a password reset link to{" "}
                <span className="font-medium text-[#344256]">{email}</span>.
                Click the link in the email to set a new password.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-lg border-[#D1D9E6] text-[#344256]"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-lg bg-[#2F6FE4] hover:bg-[#1F62DF] text-white"
                onClick={() => { setOpen(false); navigate("/forgot-password"); }}
              >
                Send reset link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SecurityRow>

      <Divider />

      <SecurityRow
        label="2-step verification"
        description="Make your account extra secure. Along with your password, you'll need to enter a code"
      >
        <TwoFactorToggle enabled={enabled} onEditSettings={onEdit2FA} />
      </SecurityRow>
    </div>
  );
}
