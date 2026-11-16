import { useState } from "react";
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
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dfe3e6] text-xs font-semibold text-slate-600",
        className,
      )}
    >
      {src && src !== failedSrc ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
          ref={(img) => {
            if (img?.complete && img.naturalWidth === 0) setFailedSrc(src);
          }}
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}
