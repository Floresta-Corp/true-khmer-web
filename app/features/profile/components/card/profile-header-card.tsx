import { Globe, Mail, MapPin, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { resolveImageURL } from "~/lib/utils";
import ProfileCardPopover from "./profile-card-popover";

interface ProfileHeaderCardProps {
  profileImage?: string;
  profileName?: string;
  occupation?: string;
  tierName?: string;
  cityName?: string;
  countryName?: string;
  email?: string;
  website?: string;
  profileId?: string;
}

export default function ProfileHeaderCard({
  profileImage,
  profileName,
  occupation,
  tierName,
  cityName,
  countryName,
  email,
  website,
  profileId,
}: ProfileHeaderCardProps) {
  const displayImage = resolveImageURL(profileImage);
  const websiteUrl = website
    ? website.startsWith("http")
      ? website
      : `https://${website}`
    : undefined;
  return (
    <Card className="relative w-full overflow-hidden rounded-3xl bg-white shadow-none dark:bg-slate-900">
      <img
        src="/images/myspace-header.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative flex flex-col items-start gap-5 px-6 py-6 sm:gap-6 sm:px-8 sm:py-8 md:flex-row md:items-center">
        <div className="relative z-10 h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-50 shadow-none select-none sm:h-27.5 sm:w-27.5 dark:border-slate-800">
          <img
            src={displayImage}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 text-left select-text">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-[28px] dark:text-white">
              {profileName}
            </h2>
            <svg
              className="inline-block h-5 w-5 shrink-0 fill-current text-blue-500"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </svg>
            <span className="shrink-0 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-amber-600 uppercase sm:text-[10px] dark:border-amber-900/30 dark:bg-amber-950/45 dark:text-amber-400">
              {tierName}
            </span>
          </div>
          <p className="text-sm leading-snug font-bold text-slate-500 sm:text-base dark:text-slate-400">
            {occupation}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-11 rounded-full bg-blue-600 px-5 font-bold">
            Message
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full px-5 font-bold"
          >
            <Plus />
            Follow
          </Button>
          <ProfileCardPopover profileId={profileId} />
        </div>
      </div>
      <div className="relative flex flex-wrap gap-x-5 gap-y-2.5 border-t border-slate-200/60 bg-white/40 px-6 py-4 text-xs text-slate-600 sm:px-8 sm:text-sm dark:border-slate-800/60 dark:bg-slate-950/20 dark:text-slate-400">
        {cityName && countryName && (
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="font-bold">{`${cityName}, ${countryName}`}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-1.5">
            <Mail size={14} />
            <a
              href={`mailto:${email}`}
              className="font-bold wrap-break-word text-blue-600 hover:underline"
            >
              {email}
            </a>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5">
            <Globe size={14} />
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold wrap-break-word text-blue-600 hover:underline"
            >
              {website}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
