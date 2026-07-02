import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { resolveImageURL } from "~/lib/utils";
import type { AdminUser } from "~/types/api-client";

function formatRole(role: string) {
  return role
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

type Props = {
  admin: AdminUser;
  initials: string;
  fullName: string;
  roles: string;
  avatarPreview: string | undefined;
  onCameraClick: () => void;
};

export function AccountSettingsProfileCard({
  admin,
  initials,
  fullName,
  avatarPreview,
  roles,
  onCameraClick,
}: Props) {
  const displaySrc =
    avatarPreview ??
    (admin.avatarKey ? resolveImageURL(admin.avatarKey) : undefined);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="h-1 bg-blue-600" />
      <div className="p-8 flex flex-col items-center text-center">
        <button
          type="button"
          onClick={onCameraClick}
          className="relative group focus:outline-none cursor-pointer"
          aria-label="Change avatar"
        >
          <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            {displaySrc ? (
              <Avatar className="w-full h-full rounded-full">
                <AvatarImage src={displaySrc} alt={fullName} />
                <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">
                {initials}
              </span>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={20} className="text-white" />
          </div>
        </button>

        <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
          {fullName}
        </h2>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-400">
          {roles ? formatRole(roles) : "-"}
        </p>
      </div>
    </div>
  );
}
