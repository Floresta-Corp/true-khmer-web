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
      className={`relative flex items-center gap-5 overflow-hidden rounded-2xl p-6 sm:px-7 ${className}`}
    >
      {/* Gradient cover — True Khmer primary → accent */}
      <div className="absolute inset-0 z-0 bg-linear-to-br from-blue-100 to-sky-100 dark:from-blue-950/60 dark:to-sky-950/60" />
      {/* Decorative floral banner */}
      <img
        src="/images/myspace-header.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-right opacity-60 dark:opacity-20"
      />

      <Avatar className="relative z-1 h-20 w-20 shrink-0 border-4 border-white sm:h-24 sm:w-24 dark:border-slate-800">
        <AvatarImage src={resolveImageURL(admin.avatarKey)} alt={firstName} />
        <AvatarFallback className="text-xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="relative z-1 min-w-0">
        <h2 className="text-2xl font-extrabold text-(--admin-text) sm:text-[28px]">
          {greeting},{" "}
          <span className="text-blue-700 dark:text-blue-400">{firstName}</span>!
        </h2>
        <p className="mt-1.5 text-base text-(--admin-text-secondary)">
          Here's what's happening with True Khmer today.
        </p>
      </div>
    </motion.div>
  );
}
