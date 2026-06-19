import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Bell, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Props = {
  show: boolean;
  onClose: () => void;
};

export function SendNotificationDialog({ show, onClose }: Props) {
  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg p-0 overflow-hidden gap-0 bg-white dark:bg-[#020617] border-slate-100 dark:border-slate-800"
      >
        <NotificationForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function NotificationForm({ onClose }: { onClose: () => void }) {
  const fetcher = useFetcher<{ ok: boolean; error: string | null }>();
  const isSubmitting = fetcher.state !== "idle";
  const result = fetcher.data;

  const [notifType, setNotifType] = useState("system");

  useEffect(() => {
    if (result?.ok) {
      const timer = window.setTimeout(onClose, 1800);
      return () => window.clearTimeout(timer);
    }
  }, [result, onClose]);

  return (
    <AnimatePresence mode="wait">
      {result?.ok ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Notification Sent
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Your broadcast has been delivered to all users.
          </p>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Header */}
          <DialogHeader className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-row items-center gap-3 space-y-0">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Bell size={18} />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Send Notification
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="ml-auto text-slate-400 hover:text-slate-900 dark:hover:text-white"
              onClick={onClose}
            >
              ✕
            </Button>
          </DialogHeader>

          {/* Form */}
          <fetcher.Form
            method="post"
            action="/tk-admin/notifications/broadcast"
            className="p-6 space-y-5"
          >
            {/* Title */}
            <FieldWrapper label="Title" htmlFor="notif-title" required>
              <Input
                id="notif-title"
                name="title"
                required
                placeholder="e.g. Platform Update"
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
              />
            </FieldWrapper>

            {/* Body */}
            <FieldWrapper label="Body" htmlFor="notif-body" required>
              <Textarea
                id="notif-body"
                name="body"
                required
                placeholder="Write your notification message here…"
                rows={3}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 resize-none"
              />
            </FieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Type">
                <input type="hidden" name="type" value={notifType} />
                <Select value={notifType} onValueChange={setNotifType}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-10 text-slate-900 dark:text-slate-100 focus:ring-amber-500/20 focus:border-amber-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    {(
                      [
                        ["system", "System"],
                        ["forum", "Forum"],
                        ["profile_view", "Profile View"],
                        ["new_message", "New Message"],
                        ["achievement", "Achievement"],
                        ["event_reminder", "Event Reminder"],
                        ["application", "Application"],
                        ["launchpad_update", "Launchpad Update"],
                        ["points", "Points"],
                      ] as const
                    ).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-800"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>

              <FieldWrapper label="Image URL" htmlFor="notif-image">
                <Input
                  id="notif-image"
                  name="imageUrl"
                  placeholder="https://…"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                />
              </FieldWrapper>
            </div>

            {/* Web + Mobile routes */}
            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Web Route" htmlFor="notif-web">
                <Input
                  id="notif-web"
                  name="webRoute"
                  placeholder="/home"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                />
              </FieldWrapper>

              <FieldWrapper label="Mobile Route" htmlFor="notif-mobile">
                <Input
                  id="notif-mobile"
                  name="mobileRoute"
                  placeholder="home"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                />
              </FieldWrapper>
            </div>

            {/* Error */}
            {result?.error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                <AlertCircle
                  size={16}
                  className="text-rose-500 mt-0.5 shrink-0"
                />
                <p className="text-sm text-rose-700 dark:text-rose-400">
                  {result.error}
                </p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending…
                </>
              ) : (
                "Broadcast Notification"
              )}
            </Button>
          </fetcher.Form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FieldWrapper({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-0.5"
      >
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
