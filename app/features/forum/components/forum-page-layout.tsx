import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ForumPageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ForumPageLayout({
  children,
  className,
  contentClassName,
}: ForumPageLayoutProps) {
  return (
    <div className={cn("min-h-screen w-full bg-[#f8fafc]", className)}>
      <main
        className={cn(
          "mx-auto w-full max-w-300 px-4 pt-8 pb-10 md:px-10 lg:px-6",
          contentClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}
