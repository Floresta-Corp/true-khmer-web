import { AuthorAvatar } from "~/components/author-avatar";
import { cn } from "~/lib/utils";

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
    <AuthorAvatar
      name={name}
      avatarKey={avatarKey}
      className={cn("h-10 w-10 text-sm", className)}
    />
  );
}
