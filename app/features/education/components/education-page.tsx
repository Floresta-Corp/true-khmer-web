import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function EducationPage({
  children,
  className,
  surface = "white",
  layout = "container",
}: {
  children: ReactNode;
  className?: string;
  surface?: "white" | "muted";
  layout?: "container" | "full";
}) {
  if (layout === "full") {
    return (
      <div
        className={cn(
          "flex h-[calc(100vh-72px)] flex-col overflow-hidden font-tk-edu",
          surface === "muted" ? "bg-[#F5F6F8]" : "bg-white",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen",
        surface === "muted" ? "bg-[#F5F6F8]" : "bg-white",
      )}
    >
      <main
        className={cn(
          "site-container pt-8 pb-12 font-tk-edu sm:pt-12 sm:pb-20",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
