import { cn, resolveImageURL } from "~/lib/utils";

interface AuthorAvatarProps {
  name: string;
  avatarKey: string | null;
  className?: string;
}

export function AuthorAvatar({
  name,
  avatarKey,
  className,
}: AuthorAvatarProps) {
  const src = resolveImageURL(avatarKey);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe3e6] text-xs font-semibold text-slate-600",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}
