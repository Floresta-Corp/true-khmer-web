import { useState } from "react";
import { Link, Form } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
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
        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 cursor-pointer overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ml-2"
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        {admin.avatarKey ? (
          <Avatar className="w-full h-full rounded-full border-0">
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
              className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-50 overflow-hidden p-2"
            >
              <div className="p-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  <Avatar className="w-full h-full rounded-full border-0">
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
                  className="px-4 py-2.5 text-[13px] font-bold rounded-xl cursor-pointer transition-all flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Settings size={16} className="text-slate-300" />
                  Account Settings
                </Link>
                <Link
                  to="/tk-admin/manage-moderator/team"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-[13px] font-bold rounded-xl cursor-pointer transition-all flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ShieldCheck size={16} className="text-slate-300" />
                  My team
                </Link>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                <Form method="post" action="/tk-admin/logout">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-[13px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all flex items-center gap-3 text-left cursor-pointer"
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
