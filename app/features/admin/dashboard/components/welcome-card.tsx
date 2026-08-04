import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { resolveImageURL } from "~/lib/utils";
import { getInitials } from "~/routes/onboarding/domain/profile/profile-utils";
import type { AdminUser } from "~/types/api-client";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

interface WelcomeCardProps {
  admin: AdminUser;
  className?: string;
}

export function WelcomeCard({ admin, className = "" }: WelcomeCardProps) {
  const [greeting, setGreeting] = useState("Welcome back");
  useEffect(() => setGreeting(getGreeting(new Date().getHours())), []);

  const firstName = admin.firstName?.trim() || "there";
  const fullName = `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim();
  const initials = getInitials(fullName) || "TK";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative flex items-center gap-5 overflow-hidden rounded-2xl border border-slate-200/70 p-6 sm:px-7 dark:border-blue-900/60 ${className}`}
    >
      {/* Gradient cover — light blue at the top fading to near-white;
          in dark mode a deep navy settling into the slate page background */}
      <div className="absolute inset-0 z-0 bg-linear-to-b from-[#DAEDFB] via-[#E7F4FD] to-[#F7FCFF] dark:from-blue-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Decorative romdoul blossoms — sized in % so they track the card height */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-80 dark:opacity-40 dark:brightness-150"
      >
        {/* Big blossom — top right */}
        <img
          src="/romdoul.svg"
          alt=""
          className="absolute -top-[38%] -right-18 h-[250px] w-auto rotate-[-20deg]"
        />
        {/* Medium blossom — bottom right, cropped by the bottom edge */}
        <img
          src="/romdoul.svg"
          alt=""
          className="absolute right-45 -bottom-[32%] h-[60%] w-auto"
        />
        {/* Small blossom — top left corner */}
        <img
          src="/romdoul.svg"
          alt=""
          className="absolute -top-[12%] -left-6 h-[55%] w-auto"
        />
      </div>

      <Avatar className="relative z-1 h-20 w-20 shrink-0 border-4 border-white sm:h-24 sm:w-24 dark:border-white/90">
        <AvatarImage src={resolveImageURL(admin.avatarKey)} alt={firstName} />
        <AvatarFallback className="text-xl font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="relative z-1 min-w-0">
        <h2 className="text-2xl font-extrabold text-(--admin-text) sm:text-[28px] dark:text-white">
          {greeting},{" "}
          <span className="text-blue-700 dark:text-sky-300">{firstName}</span>!
        </h2>
        <p className="mt-1.5 text-base text-(--admin-text-secondary) dark:text-blue-100/85">
          Here's what's happening with True Khmer today.
        </p>
      </div>
    </motion.div>
  );
}
