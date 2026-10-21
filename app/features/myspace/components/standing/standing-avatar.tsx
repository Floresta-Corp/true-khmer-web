import { cn, resolveImageURL } from "~/lib/utils";

interface StandingAvatarProps {
  name: string;
  avatarKey: string | null;
  className?: string;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function StandingAvatar({
  name,
  avatarKey,
  className,
}: StandingAvatarProps) {
  return (
    <div
      className={cn(
        "size-10 shrink-0 overflow-hidden rounded-full bg-indigo-100",
        className,
      )}
    >
      {avatarKey ? (
        <img
          src={resolveImageURL(avatarKey)}
          alt={name}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-[0.8em] font-bold text-indigo-500">
          {initials(name)}
        </div>
      )}
    </div>
  );
}
