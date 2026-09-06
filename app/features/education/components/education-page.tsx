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
          "h-[calc(100vh-72px)] overflow-hidden font-tk-edu",
          surface === "muted" ? "bg-[#F5F6F8]" : "bg-white",
          className,
        )}
      >
        {/* "full" is about the height — the screen fills the viewport below the
            navbar and scrolls its own panes rather than the page. The width
            still belongs to the site container, as on every other screen:
            without it the sidebar and lesson content run to the edges of a wide
            monitor while the navbar above them stays centred. */}
        <div className="site-container flex h-full min-h-0 flex-col">
          {children}
        </div>
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
