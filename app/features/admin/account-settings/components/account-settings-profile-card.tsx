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
  role: string;
  avatarPreview: string | undefined;
  onChangeAvatar: () => void;
};

export function AccountSettingsProfileCard({
  admin,
  initials,
  fullName,
  avatarPreview,
  role,
  onChangeAvatar,
}: Props) {
  const displaySrc =
    avatarPreview ??
    (admin.avatarKey ? resolveImageURL(admin.avatarKey) : undefined);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="h-1 bg-blue-600" />
      <div className="flex flex-col items-center p-8 text-center">
        <button
          type="button"
          onClick={onChangeAvatar}
          className="group relative cursor-pointer focus:outline-none"
          aria-label="Change avatar"
        >
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            {displaySrc ? (
              <Avatar className="h-full w-full rounded-full">
                <AvatarImage src={displaySrc} alt={fullName} />
                <AvatarFallback className="bg-blue-600 text-xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">
                {initials}
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={20} className="text-white" />
          </div>
        </button>

        <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
          {fullName}
        </h2>
        <p className="mt-1 text-[10px] font-medium tracking-widest text-slate-400 uppercase">
          {role ? formatRole(role) : "-"}
        </p>
      </div>
    </div>
  );
}
