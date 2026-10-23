import { Avatar as AvatarPrimitive } from "radix-ui";
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
  // Radix only swaps the image in once it has loaded, so a broken or
  // unresolvable avatar URL falls back to the initials instead.
  return (
    <AvatarPrimitive.Root
      className={cn(
        "block size-10 shrink-0 overflow-hidden rounded-full bg-indigo-100",
        className,
      )}
    >
      {avatarKey && (
        <AvatarPrimitive.Image
          src={resolveImageURL(avatarKey)}
          alt={name}
          className="size-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback className="flex size-full items-center justify-center text-[0.8em] font-bold text-indigo-500">
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
