import { MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

interface ThreadsTitleProps {
  icon?: ReactNode;
  title?: string;
}

export default function ThreadsTitle({ icon, title }: ThreadsTitleProps) {
  return (
    <div className="flex items-center gap-1.75 px-1.75 py-3.5 text-[12px] text-[#99A1AF]">
      {icon ?? <MessageSquare className="size-2.5" />}
      <p>{title ?? "My threads"}</p>
    </div>
  );
}
