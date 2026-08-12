import { useState } from "react";
import { Link, Form } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { AdminUser } from "~/types/api-client";
import { resolveImageURL } from "~/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type AdminUserMenuProps = {
  admin: AdminUser;
};

export default function AdminUserMenu({ admin }: AdminUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = getInitials(
    `${admin.firstName ?? ""} ${admin.lastName ?? ""}`,
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-white text-slate-400 transition-all hover:bg-slate-50 md:h-10 md:w-10 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        {admin.avatarKey ? (
          <Avatar className="h-full w-full rounded-full border-0">
            <AvatarImage
              src={resolveImageURL(admin.avatarKey)}
              alt={admin.firstName ?? ""}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ) : (
          <UserIcon size={16} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-2 flex items-center gap-3 border-b border-slate-50 p-4 dark:border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white">
                  <Avatar className="h-full w-full rounded-full border-0">
                    <AvatarImage
                      src={resolveImageURL(admin.avatarKey)}
                      alt={admin.firstName ?? ""}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {`${admin.firstName ?? ""} ${admin.lastName ?? ""}`}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">
                    {admin.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  to="/tk-admin/account-settings"
                  onClick={() => setIsOpen(false)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <Settings size={16} className="text-slate-300" />
                  Account Settings
                </Link>
              </div>

              <div className="mt-2 border-t border-slate-50 pt-2 dark:border-slate-800">
                <Form method="post" action="/tk-admin/logout">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-[13px] font-bold text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </Form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
