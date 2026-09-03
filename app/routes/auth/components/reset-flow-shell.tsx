import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import LogoSvg from "~/components/icons/logoSvg";

type ResetFlowShellProps = {
  children?: ReactNode;
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  backTo?: string;
  backLabel?: string;
  contentClassName?: string;
  descriptionClassName?: string;
};

export function ResetFlowShell({
  children,
  icon: Icon,
  title,
  description,
  backTo = "/login",
  backLabel = "Return to sign in",
  contentClassName,
  descriptionClassName,
}: ResetFlowShellProps) {
  return (
    <main className="min-h-dvh bg-white px-7 pt-10 pb-10 sm:px-10 sm:pt-12 lg:px-16 lg:pt-25 short:pt-6 short:pb-6">
      <div className="mx-auto flex w-full max-w-[1440px] justify-center">
        <section
          className={cn(
            "flex w-full max-w-[346px] flex-col items-center",
            "sm:max-w-[484px]",
            contentClassName,
          )}
        >
          <LogoSvg
            width={120}
            height={47}
            className="h-9 w-auto object-contain sm:h-[47px]"
            aria-label="True Khmer"
          />

          <div className="mt-14 flex w-full flex-col items-center sm:mt-[100px] short:mt-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F6FF] short:h-16 short:w-16">
              <Icon
                className="h-10 w-10 text-[#2F6FE4] short:h-8 short:w-8"
                strokeWidth={1.75}
              />
            </div>

            <header className="mt-6 flex w-full flex-col items-center gap-2 text-center">
              <h1 className="text-[2rem] leading-10 font-bold text-[#2E3139] short:text-2xl short:leading-8">
                {title}
              </h1>
              <div
                className={cn(
                  "max-w-[346px] text-sm leading-[1.45] font-normal text-[#777777] sm:max-w-[536px] sm:text-base sm:leading-6",
                  descriptionClassName,
                )}
              >
                {description}
              </div>
            </header>

            {children ? (
              <div className="mt-6 w-full sm:mt-9">{children}</div>
            ) : null}
          </div>

          <Link
            to={backTo}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#2F6FE4] transition-colors hover:text-[#1F62DF] short:mt-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
