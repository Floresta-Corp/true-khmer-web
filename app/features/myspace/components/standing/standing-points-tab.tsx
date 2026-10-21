import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, History, PieChart } from "lucide-react";
import type {
  PointsBreakdownItem,
  PointsTransaction,
} from "~/features/myspace/types";
import { cn } from "~/lib/utils";
import { getActivityStyle } from "./standing-activity-style";
import { StandingUnavailable } from "./standing-unavailable";

interface StandingPointsTabProps {
  history: {
    totalPoints: number;
    breakdown: PointsBreakdownItem[];
    transactions: PointsTransaction[];
    hasMore: boolean;
  } | null;
  page: number;
}

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

function groupByMonth(transactions: PointsTransaction[]) {
  const groups: { month: string; items: PointsTransaction[] }[] = [];
  for (const transaction of transactions) {
    const month = monthFormatter.format(new Date(transaction.createdAt));
    const last = groups.at(-1);
    if (last?.month === month) {
      last.items.push(transaction);
    } else {
      groups.push({ month, items: [transaction] });
    }
  }
  return groups;
}

export function StandingPointsTab({ history, page }: StandingPointsTabProps) {
  if (!history) {
    return <StandingUnavailable label="points history" />;
  }

  const breakdownTotal = history.breakdown.reduce(
    (sum, item) => sum + Math.max(item.points, 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <section className="rounded-3xl border bg-white p-5 sm:p-6 lg:col-span-2 lg:self-start dark:border-slate-800 dark:bg-slate-900">
        <SectionTitle icon={<PieChart className="size-4.5 text-[#2563eb]" />}>
          Points breakdown
        </SectionTitle>

        {history.breakdown.length === 0 ? (
          <EmptyState>
            Join a forum thread, volunteer or complete a course to start earning
            points.
          </EmptyState>
        ) : (
          <>
            <ul className="mt-5 space-y-1">
              {history.breakdown.map((item) => {
                const style = getActivityStyle(item.actionType);
                const Icon = style.icon;
                const share = breakdownTotal
                  ? Math.round(
                      (Math.max(item.points, 0) / breakdownTotal) * 100,
                    )
                  : 0;
                return (
                  <li
                    key={item.actionType}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#f8fafc] dark:hover:bg-slate-800"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        style.className,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-[#0f172a] dark:text-slate-100">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#64748b] dark:text-slate-400">
                        {item.count} {item.count === 1 ? "time" : "times"} ·{" "}
                        {share > 0 && share < 1 ? "<1" : share}%
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-[#0f172a] dark:text-slate-100">
                      {item.points.toLocaleString()}
                      <span className="ml-0.5 text-xs font-semibold text-[#64748b] dark:text-slate-400">
                        {Math.abs(item.points) === 1 ? "pt" : "pts"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <section className="rounded-3xl border bg-white p-5 sm:p-6 lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
        <SectionTitle icon={<History className="size-4.5 text-[#2563eb]" />}>
          Points history
        </SectionTitle>

        {history.transactions.length === 0 ? (
          <EmptyState>Your points activity will show up here.</EmptyState>
        ) : (
          <div className="mt-6 space-y-6">
            {groupByMonth(history.transactions).map((group) => (
              <div key={group.month}>
                <p className="mb-2 text-[11px] font-bold tracking-wider text-[#64748b] uppercase dark:text-slate-400">
                  {group.month}
                </p>
                <ul>
                  {group.items.map((transaction) => {
                    const style = getActivityStyle(transaction.actionType);
                    const Icon = style.icon;
                    const isDeduction = transaction.points < 0;
                    return (
                      <li
                        key={transaction.id}
                        className="flex items-center gap-3 rounded-xl border-b border-slate-100 px-1 py-4 transition-colors last:border-0 hover:bg-[#f8fafc] dark:border-slate-800 dark:hover:bg-slate-800"
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full",
                            style.className,
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-[#0f172a] dark:text-slate-100">
                            {transaction.label}
                          </p>
                          <p className="text-xs text-[#64748b] dark:text-slate-400">
                            {dayFormatter.format(
                              new Date(transaction.createdAt),
                            )}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold",
                            isDeduction
                              ? "bg-red-50 text-red-500"
                              : "bg-emerald-50 text-emerald-600",
                          )}
                        >
                          {isDeduction ? "" : "+"}
                          {transaction.points}{" "}
                          {Math.abs(transaction.points) === 1 ? "pt" : "pts"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {(page > 1 || history.hasMore) && (
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <PageLink to={`?tab=points&page=${page - 1}`} hidden={page <= 1}>
              <ChevronLeft className="size-4" />
              Newer
            </PageLink>
            <span className="text-xs font-semibold text-[#64748b] dark:text-slate-400">
              Page {page}
            </span>
            <PageLink
              to={`?tab=points&page=${page + 1}`}
              hidden={!history.hasMore}
            >
              Older
              <ChevronRight className="size-4" />
            </PageLink>
          </div>
        )}
      </section>
    </div>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 border-b border-slate-100 pb-4 text-base font-semibold tracking-tight text-[#0f172a] dark:border-slate-800 dark:text-slate-100">
      {icon}
      {children}
    </h2>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto max-w-xs py-10 text-center text-sm text-[#64748b] dark:text-slate-400">
      {children}
    </p>
  );
}

function PageLink({
  to,
  hidden,
  children,
}: {
  to: string;
  hidden: boolean;
  children: ReactNode;
}) {
  if (hidden) return <span className="w-20" />;
  return (
    <Link
      to={to}
      preventScrollReset
      className="flex w-20 items-center justify-center gap-1 rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#2563eb] transition-colors hover:bg-[#dbeafe]"
    >
      {children}
    </Link>
  );
}
