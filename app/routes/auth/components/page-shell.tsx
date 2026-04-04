import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { cn } from "~/lib/utils";

type AuthPageShellProps = {
  children: ReactNode;
  contentClassName?: string;
  backTo?: string;
  backLabel?: string;
  rightPanelContent?: ReactNode;
  rightPanelContentClassName?: string;
  showRightPanelOverlay?: boolean;
};

export function AuthPageShell({
  children,
  contentClassName,
  backLabel = "Exit",
  rightPanelContent = "image",
  rightPanelContentClassName,
  showRightPanelOverlay = true,
}: AuthPageShellProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <main className="flex h-screen w-full overflow-hidden bg-[#FFFFFF]">
        <section className="relative flex h-full w-full justify-center overflow-y-auto bg-[#FFFFFF] px-5 py-3 lg:w-1/2 lg:px-6 lg:py-3 xl:px-7 xl:py-4">
          <Link
            to=".."
            onClick={() => navigate(-1)}
            className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[1.1px] text-[#99A1AF] transition-colors hover:text-[#637081] lg:left-7 lg:top-7"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#F3F4F6]">
              <ArrowLeft size={12} />
            </span>
            {backLabel}
          </Link>

          <div
            className={cn(
              "tk-fade-up w-full max-w-sm pb-2 pt-10 lg:pb-2 lg:pt-11",
              contentClassName,
            )}
          >
            {children}
          </div>
        </section>

        <section className="relative hidden h-full w-1/2 items-center justify-center bg-linear-to-br from-[#5B87DE] to-[#6997ED] lg:flex">
          {showRightPanelOverlay ? (
            <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(63.32%_81.49%_at_50%_50%,rgba(255,255,255,1)_0%,rgba(0,0,0,0)_100%)]" />
          ) : null}
          <div
            className={cn(
              "relative flex h-full w-full items-center justify-center text-[42px] font-semibold leading-8 text-[#030213]",
              rightPanelContentClassName,
            )}
          >
            {rightPanelContent}
          </div>
        </section>
      </main>
    </div>
  );
}
