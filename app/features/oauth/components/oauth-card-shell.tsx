import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { OAuthHeader } from "./oauth-header";

interface OAuthCardShellProps {
  children: ReactNode;
  mainClassName?: string;
}

// Every OAuth screen renders inside the popup the opener launches, which is
// only about 500x650. The card is centred and framed at desktop sizes, but at
// popup height it gives its outer margin and padding back to the content so the
// whole card fits without the window scrolling.
export function OAuthCardShell({
  children,
  mainClassName,
}: OAuthCardShellProps) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-slate-100/70 p-4 font-sans text-slate-900 short:p-2">
      <div className="w-full max-w-105 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md">
        <OAuthHeader />

        <main
          className={cn(
            "space-y-5 p-6 short:space-y-4 short:p-5",
            mainClassName,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
