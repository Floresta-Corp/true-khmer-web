import { Crown } from "lucide-react";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";
import type { LeaderboardEntry } from "~/features/myspace/types";
import { cn } from "~/lib/utils";
import { StandingAvatar } from "./standing-avatar";
import { StandingUnavailable } from "./standing-unavailable";

interface StandingLeaderboardTabProps {
  leaderboard: {
    entries: LeaderboardEntry[];
    me: { rank: number | null; totalPoints: number };
  } | null;
}

const PODIUM_STYLES = {
  1: {
    ring: "ring-[#fbbf24]",
    badge: "bg-[#fbbf24]",
    block: "h-24 bg-linear-to-b from-[#fef3c7] to-[#fffbeb]",
  },
  2: {
    ring: "ring-[#cbd5e1]",
    badge: "bg-[#94a3b8]",
    block: "h-16 bg-linear-to-b from-[#f1f5f9] to-[#f8fafc]",
  },
  3: {
    ring: "ring-[#fdba74]",
    badge: "bg-[#f97316]",
    block: "h-12 bg-linear-to-b from-[#ffedd5] to-[#fff7ed]",
  },
} as const;

export function StandingLeaderboardTab({
  leaderboard,
}: StandingLeaderboardTabProps) {
  if (!leaderboard) {
    return <StandingUnavailable label="leaderboard" />;
  }

  if (leaderboard.entries.length === 0) {
    return (
      <section className="rounded-3xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="py-10 text-center text-sm text-[#64748b] dark:text-slate-400">
          No one on the leaderboard yet.
        </p>
      </section>
    );
  }

  const podium = leaderboard.entries.slice(0, 3);
  const rest = leaderboard.entries.slice(3);
  const me = leaderboard.entries.find((entry) => entry.isMe);
  // Second place on the left, first in the middle, third on the right.
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (
    <div className="space-y-6">
      {leaderboard.me.rank && (
        <div className="flex items-center gap-4 rounded-3xl border border-[#bfdbfe] bg-[#eff6ff] p-4 sm:px-6 dark:border-blue-900 dark:bg-blue-950/40">
          <span className="text-2xl font-bold text-[#2563eb]">
            #{leaderboard.me.rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0f172a] dark:text-slate-100">
              Your position
            </p>
            <p className="text-xs text-[#64748b] dark:text-slate-400">
              {leaderboard.me.rank === 1
                ? "You're leading the community. Amazing work!"
                : `${leaderboard.me.totalPoints.toLocaleString()} pts — keep contributing to climb higher.`}
            </p>
          </div>
        </div>
      )}

      <section className="rounded-3xl border bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-end justify-center gap-2 sm:gap-6">
          {podiumOrder.map((entry) => {
            // Styled by podium position, since tied users share a rank number.
            const place = (podium.indexOf(entry) + 1) as 1 | 2 | 3;
            const style = PODIUM_STYLES[place];
            const isFirst = place === 1;
            return (
              <div
                key={entry.userId}
                className="flex max-w-36 min-w-0 flex-1 flex-col items-center"
              >
                {isFirst && (
                  <Crown className="mb-1 size-6 fill-[#fbbf24] text-[#f59e0b]" />
                )}
                <div className="relative">
                  <StandingAvatar
                    name={entry.displayName}
                    avatarKey={entry.avatarKey}
                    className={cn(
                      "ring-4 ring-offset-2",
                      style.ring,
                      isFirst
                        ? "size-16 text-xl sm:size-20 sm:text-2xl"
                        : "size-14 text-base sm:size-16 sm:text-lg",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute -bottom-2 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white",
                      style.badge,
                    )}
                  >
                    {entry.rank}
                  </span>
                </div>
                <ProfileLinkWrapper
                  authorId={entry.userId}
                  isAuthor={entry.isMe}
                  className="mt-4 w-full truncate text-center text-sm font-semibold text-[#0f172a] dark:text-slate-100"
                >
                  {entry.displayName}
                </ProfileLinkWrapper>
                <p className="text-xs font-bold text-[#2563eb]">
                  {entry.totalPoints.toLocaleString()} pts
                </p>
                {entry.isMe && <YouPill className="mt-1" />}
                <div className={cn("mt-3 w-full rounded-t-2xl", style.block)} />
              </div>
            );
          })}
        </div>

        {rest.length > 0 && (
          <ol className="mt-2 space-y-1 border-t pt-4">
            {rest.map((entry) => (
              <li
                key={entry.userId}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-[#f8fafc] dark:hover:bg-slate-800",
                  entry.isMe &&
                    "bg-[#eff6ff] hover:bg-[#eff6ff] dark:bg-blue-950/40 dark:hover:bg-blue-950/60",
                )}
              >
                <span className="w-8 shrink-0 text-center text-sm font-bold text-[#94a3b8]">
                  {entry.rank}
                </span>
                <StandingAvatar
                  name={entry.displayName}
                  avatarKey={entry.avatarKey}
                  className="text-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <ProfileLinkWrapper
                      authorId={entry.userId}
                      isAuthor={entry.isMe}
                      className="truncate text-sm font-semibold text-[#0f172a] dark:text-slate-100"
                    >
                      {entry.displayName}
                    </ProfileLinkWrapper>
                    {entry.isMe && <YouPill />}
                  </div>
                  {entry.tier && (
                    <p className="text-[10px] font-bold tracking-wider text-[#ea580c] uppercase">
                      {entry.tier.name}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-sm font-bold text-[#0f172a] dark:text-slate-100">
                  {entry.totalPoints.toLocaleString()}
                  <span className="ml-0.5 text-xs font-semibold text-[#94a3b8]">
                    pts
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}

        {!me && leaderboard.me.rank && (
          <p className="mt-4 border-t pt-4 text-center text-xs font-semibold text-[#64748b] dark:text-slate-400">
            Showing the top {leaderboard.entries.length}. Keep contributing to
            join them!
          </p>
        )}
      </section>
    </div>
  );
}

function YouPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full bg-[#2563eb] px-2 py-0.5 text-[10px] font-bold text-white uppercase",
        className,
      )}
    >
      You
    </span>
  );
}
