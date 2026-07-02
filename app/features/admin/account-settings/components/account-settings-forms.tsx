import { type ChangeEvent, type RefObject, useEffect, useState } from "react";
import { Form } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { AdminUser } from "~/types/api-client";

const inputClass =
  "h-12.5 rounded-[14px] bg-[#F8FAFC] dark:bg-slate-800 px-4.5 border-none text-sm text-[#364153] placeholder:text-[#C8D6E5] focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:border-transparent";

const labelClass =
  "block text-[11px] font-medium tracking-widest uppercase text-slate-400 mb-2";

type Props = {
  admin: AdminUser;
  isSubmitting: boolean;
  submitIntent: FormDataEntryValue | null | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hasAvatarChange: boolean;
};

export function AccountSettingsForms({
  admin,
  isSubmitting,
  submitIntent,
  fileInputRef,
  onFileChange,
  hasAvatarChange,
}: Props) {
  const [firstName, setFirstName] = useState(admin.firstName ?? "");
  const [lastName, setLastName] = useState(admin.lastName ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isPasswordChanged =
    currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

  const isProfileChanged =
    hasAvatarChange ||
    firstName !== (admin.firstName ?? "") ||
    lastName !== (admin.lastName ?? "");

  return (
    <div className="space-y-5">
      <Form method="post" encType="multipart/form-data">
        <input type="hidden" name="intent" value="update-profile" />
        <input
          ref={fileInputRef}
          id="avatarFileInput"
          type="file"
          name="avatarFile"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <UserIcon size={15} className="text-blue-500" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className={labelClass}>
                First Name
              </Label>
              <Input
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className={labelClass}>
                Last Name
              </Label>
              <Input
                name="lastName"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className={inputClass}
              />
            </div>
          </div>

          <AnimatePresence>
            {isProfileChanged && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex justify-end overflow-hidden"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting && submitIntent === "update-profile"}
                  className="px-5 py-4 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting && submitIntent === "update-profile"
                    ? "Saving…"
                    : "Save Changes"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Form>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Mail size={15} className="text-blue-500" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Email Address
          </h3>
        </div>

        <div>
          <Label className={labelClass}>Email Address</Label>
          <Input
            type="email"
            value={admin.email}
            readOnly
            className={`${inputClass} opacity-80 cursor-not-allowed`}
          />
        </div>
      </div>
      <Form method="post">
        <input type="hidden" name="intent" value="change-password" />

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Lock size={15} className="text-green-500" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Security
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className={labelClass}>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className={inputClass}
                autoComplete="current-password"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className={labelClass}>New Password</Label>
                <Input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters, no spaces"
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <Label className={labelClass}>Confirm New Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isPasswordChanged && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex justify-end overflow-hidden"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting && submitIntent === "change-password"}
                  className="px-5 py-4 cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting && submitIntent === "change-password"
                    ? "Updating…"
                    : "Update Password"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Form>
    </div>
  );
}
