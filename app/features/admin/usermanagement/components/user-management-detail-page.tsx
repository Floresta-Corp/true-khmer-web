import { useEffect, useState, type ComponentType } from "react";
import { format } from "date-fns";
import {
  Activity,
  ArrowLeft,
  Award,
  Ban,
  BriefcaseBusiness,
  CalendarDays,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Shield,
  TrendingDown,
  TrendingUp,
  UserRound,
  Zap,
} from "lucide-react";
import { Link, useFetcher, useLoaderData } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";

import type { action, loader } from "../routes/user-management.$userId";
import { StatusBadge, UserTierBadge } from "./user-management-badges";

export function UserManagementDetailPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/tk-admin/users" aria-label="Back to user management">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              User Profile
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Account details, points, and recent activity.
            </p>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <UserSummary user={user} />
            <ManagementConsole user={user} />
          </aside>

          <section className="min-w-0 space-y-6">
            <PointsOverview points={user.points} />
            <RecentActivity activities={user.recentActivity} />
          </section>
        </div>
      </div>
    </main>
  );
}

function UserSummary({
  user,
}: {
  user: ReturnType<typeof useLoaderData<typeof loader>>["user"];
}) {
  const displayName = user.displayName || user.name;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();
  const location = [user.location?.city, user.location?.country]
    .filter(Boolean)
    .join(", ");
  const phone = [user.phoneCountry, user.phoneNumber].filter(Boolean).join(" ");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center text-center">
        <Avatar className="size-24 rounded-2xl after:rounded-2xl">
          {user.avatarUrl ? (
            <AvatarImage
              src={user.avatarUrl}
              alt={displayName}
              className="rounded-2xl"
            />
          ) : null}
          <AvatarFallback className="rounded-2xl text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            {displayName}
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {user.email}
        </p>
        <div className="mt-1 inline-flex gap-2 text-sm">
          <div>
            <StatusBadge status={user.status} />
          </div>
          <div>
            <UserTierBadge tier={user.tier} />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <dl className="space-y-4">
        <ProfileDetail
          icon={Mail}
          label="Email"
          value={user.email}
          verified={user.emailVerified}
        />
        <ProfileDetail icon={Phone} label="Phone" value={phone || "Not set"} />
        <ProfileDetail
          icon={MapPin}
          label="Location"
          value={location || "Not set"}
        />
        <ProfileDetail
          icon={BriefcaseBusiness}
          label="Occupation"
          value={user.occupation || "Not set"}
        />
        <ProfileDetail
          icon={MessageCircle}
          label="Telegram"
          value={
            user.telegramUsername
              ? `@${user.telegramUsername.replace(/^@/, "")}`
              : "Not set"
          }
        />
        <ProfileDetail
          icon={CalendarDays}
          label="Joined"
          value={formatDate(user.createdAt)}
        />
      </dl>
    </div>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  value,
  verified,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          {verified ? (
            <span className="text-xs font-sm text-emerald-600 dark:text-emerald-400">
              Verified
            </span>
          ) : null}
        </dt>
        <dd className="mt-0.5 break-words text-sm font-medium text-slate-800 dark:text-slate-200">
          {value}
        </dd>
      </div>
    </div>
  );
}

function ManagementConsole({
  user,
}: {
  user: ReturnType<typeof useLoaderData<typeof loader>>["user"];
}) {
  const suspensionAction =
    user.status === "SUSPENDED" ? "unsuspend" : "suspend";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
        Management Console
      </h2>
      <div className="mt-4 space-y-2">
        <ManagementButton icon={Award} label="Modify tier" />
        <ManagementButton icon={RotateCcw} label="Modify points" />
        <ManagementButton icon={KeyRound} label="Reset password link" />
        <SuspensionDialog
          action={suspensionAction}
          userName={user.displayName || user.name}
        />
      </div>
    </div>
  );
}

function ManagementButton({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled
      className="h-10 w-full justify-between rounded-lg px-3 shadow-none"
    >
      <span>{label}</span>
      <Icon className="text-slate-400" />
    </Button>
  );
}

function SuspensionDialog({
  action: suspensionAction,
  userName,
}: {
  action: "suspend" | "unsuspend";
  userName: string;
}) {
  const fetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(false);
  const isSubmitting = fetcher.state !== "idle";
  const isSuspend = suspensionAction === "suspend";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setOpen(false);
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={isSuspend ? "destructive" : "outline"}
          className={`h-10 w-full justify-between rounded-lg px-3 shadow-none ${
            isSuspend
              ? ""
              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
          }`}
        >
          <span>{isSuspend ? "Suspend account" : "Unsuspend account"}</span>
          {isSuspend ? <Ban /> : <Shield />}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogTitle className="text-xl font-bold">
          {isSuspend ? "Suspend account?" : "Restore account access?"}
        </DialogTitle>
        <DialogDescription className="leading-6">
          {isSuspend
            ? `${userName} will immediately lose access to the platform.`
            : `${userName} will regain access to the platform.`}
        </DialogDescription>

        {fetcher.data && "error" in fetcher.data ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {fetcher.data.error}
          </p>
        ) : null}

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <fetcher.Form method="post">
            <input type="hidden" name="action" value={suspensionAction} />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={isSuspend ? "destructive" : "default"}
              className={
                isSuspend
                  ? ""
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {isSubmitting
                ? "Updating..."
                : isSuspend
                  ? "Suspend account"
                  : "Unsuspend account"}
            </Button>
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PointsOverview({
  points,
}: {
  points: ReturnType<typeof useLoaderData<typeof loader>>["user"]["points"];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <PointCard
        label="Active points"
        value={points.activePoints}
        description="Available balance"
        icon={Zap}
        accent="blue"
      />
      <PointCard
        label="Tier points"
        value={points.tierPoints}
        description="Current tier progress"
        icon={Activity}
      />
      <PointCard
        label="Legacy points"
        value={points.legacyPoints}
        description="Lifetime accumulated"
        icon={Shield}
      />
    </div>
  );
}

function PointCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "default",
}: {
  label: string;
  value: number;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent?: "blue" | "default";
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${
        accent === "blue"
          ? "border-blue-200 dark:border-blue-900"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {label}
      </p>
      <p
        className={`mt-3 text-3xl font-bold tracking-tight tabular-nums ${
          accent === "blue"
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-950 dark:text-white"
        }`}
      >
        {value.toLocaleString()}
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Icon className="size-3.5" />
        {description}
      </div>
    </div>
  );
}

function RecentActivity({
  activities,
}: {
  activities: ReturnType<
    typeof useLoaderData<typeof loader>
  >["user"]["recentActivity"];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">
          Recent Activity
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Latest point movements and account activity.
        </p>
      </div>

      {activities.length > 0 ? (
        <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
          {activities.map((activity) => {
            const isPositive = activity.points >= 0;

            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {formatActivityDate(activity.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-lg px-2.5 py-1 text-sm font-semibold tabular-nums ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {activity.points.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-6 text-center dark:border-slate-800">
          <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
            <UserRound className="size-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            No recent activity
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Activity will appear here when points or account events occur.
          </p>
        </div>
      )}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "d MMM yyyy");
}

function formatActivityDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : format(date, "d MMM yyyy, HH:mm");
}
