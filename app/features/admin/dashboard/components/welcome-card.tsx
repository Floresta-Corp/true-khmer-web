import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { resolveImageURL } from "~/lib/utils";
import type { AdminUser } from "~/types/api-client";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "TK"
  );
}

interface WelcomeCardProps {
  admin: AdminUser;
  className?: string;
}

export function WelcomeCard({ admin, className = "" }: WelcomeCardProps) {
  const greeting = getGreeting(new Date().getHours());
  const firstName = admin.firstName?.trim() || "there";
  const fullName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();
  const initials = getInitials(fullName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative overflow-hidden rounded-xl border border-(--admin-border) bg-linear-to-br from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-900/60 ${className}`}
    >
      {/* Decorative banner */}
      <img
        src="/images/myspace-header.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right dark:opacity-20"
      />

      <div className="relative flex items-center gap-5 px-6 py-5 md:px-8 md:py-10">
        <Avatar className="h-16 w-16 shrink-0 border-4 border-white shadow-sm md:h-25 md:w-25 dark:border-slate-800">
          <AvatarImage src={resolveImageURL(admin.avatarKey)} alt={firstName} />
          <AvatarFallback className="text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-2xl font-bold text-(--admin-text) md:text-3xl">
            {greeting},{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {firstName}
            </span>
            !
          </h2>
          <p className="mt-1 text-sm text-(--admin-text-secondary) md:text-base">
            Here's what's happening with True Khmer today.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
