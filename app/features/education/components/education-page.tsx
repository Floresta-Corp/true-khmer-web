import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

/**
 * Page shell shared by every Education Center screen.
 *
 * Uses the app-wide `site-container` so the page gutters line up with the
 * navbar and the other feature pages. The design's `<main>` is framed at
 * 1440px, but the shared shell here is narrower and the two must agree.
 *
 * Vertical rhythm follows the design: 48px above the content, 80px below,
 * stepped down on small screens. `font-tk-edu` applies the design system's
 * Inter; portaled surfaces (dialogs, dropdowns) set it themselves since they
 * render outside this tree.
 */
export function EducationPage({
  children,
  className,
  surface = "white",
  layout = "container",
}: {
  children: ReactNode;
  className?: string;
  /** The hub sits on white; the detail/learn/quiz screens use the muted page. */
  surface?: "white" | "muted";
  /**
   * The course learning screen is the one exception to the shared gutters: the
   * design gives it a full-bleed shell with its own sidebar and scroll region,
   * so it opts out of `site-container` and the vertical rhythm.
   */
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
