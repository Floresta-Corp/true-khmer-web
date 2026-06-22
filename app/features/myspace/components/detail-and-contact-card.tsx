import type { ReactNode } from "react";
import { Calendar, Mail, MapPin, PhoneCall, Send, Star } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { resolveImageURL } from "~/lib/utils";

export interface DetailAndContactCardProps {
  date: string;
  location: string;
  rewardPoints: number;
  organizer: {
    avatar: string;
    name: string;
    role: string;
    phone?: string;
    email?: string;
    telegram?: string;
  };
}

function ActionLink({
  href,
  icon,
  enabled,
  ariaLabel,
}: {
  href?: string;
  icon: ReactNode;
  enabled: boolean;
  ariaLabel: string;
}) {
  if (enabled && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        title={ariaLabel}
        className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#E7ECF3] bg-white text-[#1A73E8] transition-colors hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        {icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-label={ariaLabel}
      title={ariaLabel}
      className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#E7ECF3] bg-white text-[#1A73E8] opacity-45 dark:border-slate-800 dark:bg-slate-900"
    >
      {icon}
    </button>
  );
}

export function DetailAndContactCard({
  date,
  location,
  rewardPoints,
  organizer,
}: DetailAndContactCardProps) {
  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="space-y-6 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Details & Contact
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-4 shrink-0 text-[#1A73E8]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Date
              </p>
              <p className="mt-0.5 text-[13px] font-bold leading-snug text-slate-800 dark:text-slate-200">
                {date}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#1A73E8]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Location
              </p>
              <p className="mt-0.5 text-[13px] font-bold leading-snug text-slate-800 dark:text-slate-200">
                {location}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Star className="mt-0.5 size-4 shrink-0 fill-current text-amber-500" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Impact Points
              </p>
              <p className="mt-0.5 text-[13px] font-bold leading-snug text-slate-800 dark:text-slate-200">
                {rewardPoints > 0 ? `${rewardPoints} PTS` : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-[#EEF2F7]" />

        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Contact Organizer
          </p>

          <div className="flex min-w-0 items-center gap-3">
            <img
              src={resolveImageURL(organizer.avatar)}
              alt={organizer.name}
              className="size-12 shrink-0 rounded-2xl border border-slate-100 object-cover dark:border-slate-800"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                {organizer.name}
              </div>
              <div className="mt-0.5 truncate text-sm text-slate-400">
                {organizer.role}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <ActionLink
              href={organizer.telegram}
              icon={<Send className="size-4" />}
              enabled={!!organizer.telegram}
              ariaLabel={`Message ${organizer.name} on Telegram`}
            />
            <ActionLink
              href={organizer.phone}
              icon={<PhoneCall className="size-4" />}
              enabled={!!organizer.phone}
              ariaLabel={`Call ${organizer.name}`}
            />
            <ActionLink
              href={organizer.email}
              icon={<Mail className="size-4" />}
              enabled={!!organizer.email}
              ariaLabel={`Email ${organizer.name}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
