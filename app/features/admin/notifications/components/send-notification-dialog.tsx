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
        className="gap-0 overflow-hidden rounded-2xl border-slate-100 bg-white p-0 sm:max-w-lg dark:border-slate-800 dark:bg-[#020617]"
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
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canSubmit = title.trim() !== "" && body.trim() !== "";

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
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Notification Sent
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your broadcast has been delivered to all users.
          </p>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Header */}
          <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b border-slate-100 p-6 pb-5 dark:border-slate-800">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-600 bg-amber-50 text-amber-600 dark:border-none dark:bg-amber-900/20 dark:text-amber-400">
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
            className="space-y-5 p-6"
          >
            {/* Title */}
            <FieldWrapper label="Title" htmlFor="notif-title" required>
              <Input
                id="notif-title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Platform Update"
                className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600"
              />
            </FieldWrapper>

            {/* Body */}
            <FieldWrapper label="Body" htmlFor="notif-body" required>
              <Textarea
                id="notif-body"
                name="body"
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your notification message here…"
                rows={3}
                className="resize-none rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600"
              />
            </FieldWrapper>

            <div className="grid grid-cols-1 gap-4">
              <FieldWrapper label="Type">
                <input type="hidden" name="type" value={notifType} />
                <Select value={notifType} onValueChange={setNotifType}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-amber-500 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    {(
                      [
                        ["system", "System"],
                        // ["forum", "Forum"],
                        // ["profile_view", "Profile View"],
                        // ["new_message", "New Message"],
                        // ["achievement", "Achievement"],
                        // ["event_reminder", "Event Reminder"],
                        // ["application", "Application"],
                        // ["launchpad_update", "Launchpad Update"],
                        // ["points", "Points"],
                      ] as const
                    ).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="text-slate-900 focus:bg-slate-100 dark:text-slate-100 dark:focus:bg-slate-800"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldWrapper>

              {/* <FieldWrapper label="Image URL" htmlFor="notif-image">
                <Input
                  id="notif-image"
                  name="imageUrl"
                  placeholder="https://…"
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl h-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
                />
              </FieldWrapper> */}
            </div>

            {/* Web + Mobile routes */}
            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Web Route" htmlFor="notif-web">
                <Input
                  id="notif-web"
                  name="webRoute"
                  placeholder="Home"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600"
                />
              </FieldWrapper>

              <FieldWrapper label="Mobile Route" htmlFor="notif-mobile">
                <Input
                  id="notif-mobile"
                  name="mobileRoute"
                  placeholder="home"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600"
                />
              </FieldWrapper>
            </div>

            {/* Error */}
            {result?.error && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-rose-500"
                />
                <p className="text-sm text-rose-700 dark:text-rose-400">
                  {result.error}
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="h-11 rounded-xl border border-amber-500 bg-amber-100 text-[11px] font-black tracking-widest text-amber-500 uppercase transition-all hover:bg-amber-600 hover:text-white focus-visible:border-amber-500 focus-visible:ring-amber-500/20 active:scale-95 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 disabled:active:scale-100 dark:border-none dark:bg-amber-800/20 dark:hover:bg-amber-600/50 dark:hover:text-amber-600 dark:disabled:border-slate-700 dark:disabled:bg-slate-800/40 dark:disabled:text-slate-600 dark:disabled:hover:bg-slate-800/40 dark:disabled:hover:text-slate-600"
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
            </div>
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
        className="pl-0.5 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-400">*</span>}
      </Label>
      {children}
    </div>
  );
}
