import type { PropsWithChildren } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

interface ProfileLinkWrapperProps extends PropsWithChildren {
  authorId?: string | number;
  isAuthor?: boolean;
  className?: string;
}

export default function ProfileLinkWrapper({
  authorId,
  children,
  isAuthor,
  className,
}: ProfileLinkWrapperProps) {
  const link = isAuthor ? "/myspace?view=public" : `/profile/${authorId}`;
  return (
    <Link
      to={link}
      className={cn(
        "hover:text-blue-600 hover:underline transition-all",
        className,
      )}
    >
      {children}
    </Link>
  );
}
