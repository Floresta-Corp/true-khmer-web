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
    <Card className="shadow-none overflow-hidden rounded-3xl  relative w-full bg-linear-to-br from-indigo-50/70 via-sky-50 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
      <div className="flex flex-col md:flex-row gap-5 sm:gap-6 items-start md:items-center px-6 py-6 sm:px-8 sm:py-8">
        <div className="w-20 h-20 sm:w-27.5 sm:h-27.5 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-slate-50 shrink-0 relative z-10 select-none">
          <img
            src={displayImage}
            alt="Profile"
            className="object-cover h-full w-full"
          />
        </div>

        <div className="text-left select-text flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              {profileName}
            </h2>
            <svg
              className="w-5 h-5 text-blue-500 fill-current inline-block shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
            </svg>
            <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/45 rounded-full border border-amber-100 dark:border-amber-900/30 shrink-0">
              {tierName}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-base leading-snug">
            {occupation}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 h-11 px-5 rounded-full font-bold">
            Message
          </Button>
          <Button
            variant="outline"
            className="h-11 px-5 rounded-full font-bold"
          >
            <Plus />
            Follow
          </Button>
          <ProfileCardPopover profileId={profileId} />
        </div>
      </div>
      <div className="border-t border-slate-200/60 dark:border-slate-800/60 px-6 py-4 sm:px-8 bg-white/40 dark:bg-slate-950/20 flex flex-wrap gap-x-5 gap-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
              className="font-bold text-blue-600 hover:underline wrap-break-word"
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
              className="font-bold text-blue-600 hover:underline wrap-break-word"
            >
              {website}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
