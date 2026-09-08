import { cn, resolveImageURL } from "~/lib/utils";

interface BlogCommentAvatarProps {
  name: string;
  avatarKey: string | null;
  className?: string;
}

export default function BlogCommentAvatar({
  name,
  avatarKey,
  className,
}: BlogCommentAvatarProps) {
  return (
    <div
      className={cn(
        "h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#dfe3e6]",
        className,
      )}
    >
      <img
        src={resolveImageURL(avatarKey)}
        alt={name || "Author avatar"}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
