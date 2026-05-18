import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { OnboardingHeader } from "./onboarding-header";

type OnboardingPageShellProps = {
  children: ReactNode;
  headerTitle: string;
  headerRightText?: string;
  headerRightTo?: string;
  headerTitlePosition?: "center" | "right";
  mainClassName?: string;
};

export function OnboardingPageShell({
  children,
  headerTitle,
  headerRightText,
  headerRightTo,
  headerTitlePosition = "center",
  mainClassName,
}: OnboardingPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white text-[#111827] supports-[min-height:100dvh]:min-h-dvh">
      <OnboardingHeader
        title={headerTitle}
        rightText={headerRightText}
        rightTo={headerRightTo}
        titlePosition={headerTitlePosition}
      />

      <main
        className={cn(
          "relative flex flex-1 flex-col overflow-x-hidden bg-white font-['Inter']",
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}
