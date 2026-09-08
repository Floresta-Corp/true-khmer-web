import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar size="lg" className={cn("shrink-0", className)}>
      <AvatarImage src={resolveImageURL(avatarKey)} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
