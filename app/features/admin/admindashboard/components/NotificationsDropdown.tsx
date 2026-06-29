import { useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Critical Security Alert",
    desc: "New login from an unrecognized device in Singapore.",
    time: "2 mins ago",
  },
  {
    id: 2,
    title: "Community Health Peak",
    desc: "Health index reached 94% following the new rewards rollout.",
    time: "45 mins ago",
  },
  {
    id: 3,
    title: "New Partner Application",
    desc: "FinTech Connect has applied for a Tier 2 Partner license.",
    time: "3h ago",
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 md:p-2.5 rounded-xl transition-all ${
          isOpen
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
            : "text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50"
        }`}
        aria-label="Open notifications"
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-50 dark:border-[#020617]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-50 overflow-hidden flex flex-col"
            >
              <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 text-center sm:text-left">
                <h3 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                  Notifications
                </h3>
                <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors hidden xs:inline">
                  Mark all as read
                </button>
              </div>

              <div className="max-h-[80vh] sm:max-h-120 overflow-auto py-2">
                {MOCK_NOTIFICATIONS.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Bell size={18} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] font-medium text-slate-400">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {notif.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <button className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all">
                  View Activity Log
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
