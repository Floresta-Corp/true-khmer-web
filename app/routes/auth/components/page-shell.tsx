import type { MouseEvent, ReactNode } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { cn } from "~/lib/utils";

type AuthPageShellProps = {
  children: ReactNode;
  contentClassName?: string;
  backTo?: string;
  backLabel?: string;
  leftSectionClassName?: string;
  backLinkClassName?: string;
  backIconClassName?: string;
  rightPanelContent?: ReactNode;
  rightPanelContentClassName?: string;
  showRightPanelOverlay?: boolean;
};

export function AuthPageShell({
  children,
  contentClassName,
  backTo,
  backLabel = "Exit",
  leftSectionClassName,
  backLinkClassName,
  backIconClassName,
  rightPanelContent = "image",
  rightPanelContentClassName,
  showRightPanelOverlay = true,
}: AuthPageShellProps) {
  const navigate = useNavigate();

  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    if (!backTo) {
      event.preventDefault();
      navigate(-1);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <main className="flex h-screen w-full overflow-hidden bg-[#FFFFFF]">
        <section
          className={cn(
            "relative flex h-full w-full justify-center overflow-y-auto bg-[#FFFFFF] px-5 py-3 lg:w-1/2 lg:px-6 lg:py-3 xl:px-7 xl:py-4",
            leftSectionClassName,
          )}
        >
          <Link
            to={backTo ?? ".."}
            replace
            onClick={handleBack}
            className={cn(
              "group absolute top-5 left-5 z-10 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[1.1px] text-[#99A1AF] uppercase transition-colors hover:text-[#637081] lg:top-7 lg:left-7",
              backLinkClassName,
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border border-[#F3F4F6]",
                backIconClassName,
              )}
            >
              <ArrowLeft size={12} />
            </span>
            <span className="relative">
              {backLabel}
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-full origin-center scale-x-0 rounded-full bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"
              />
            </span>
          </Link>

          <div
            className={cn(
              "tk-fade-up w-full max-w-sm pt-10 pb-2 lg:pt-11 lg:pb-2",
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
              "relative flex h-full w-full items-center justify-center text-[42px] leading-8 font-semibold text-[#030213]",
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

export function AuthBrandPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#DAE2FF]">
      <img
        src="/images/auth/tk-login-cover.png"
        alt="login-cover"
        className="absolute inset-0 h-full w-auto object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C5DD4]/80 via-[#1C5DD4]/40 to-transparent" />

      <div className="relative flex h-full flex-col items-start justify-between p-16">
        <header className="w-full space-y-4">
          <div className="inline-flex rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs leading-4 font-bold tracking-widest text-white uppercase shadow-sm backdrop-blur-md">
            Global Business Excellence
          </div>
          <h2 className="text-5xl leading-[60px] font-bold text-white">
            Empowering
            <br />
            Cambodia&apos;s Future
          </h2>
        </header>

        <div className="relative w-full max-w-lg self-center overflow-hidden rounded-xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-[12px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#1C5DD4]">
                <TrendingUp className="size-5" strokeWidth={2.25} />
              </div>
              <div>
                <p className="text-sm leading-5 font-semibold text-white/80">
                  Market Growth
                </p>
                <p className="text-xl leading-7 font-bold">+24.8%</p>
              </div>
            </div>

            <svg
              viewBox="0 0 96 48"
              aria-hidden="true"
              className="h-12 w-24"
              fill="none"
            >
              <path
                d="M5 30L16 26L25 31L35 20L45 24L56 13L66 17L77 6L91 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="mt-6 grid grid-cols-2 border-t border-white/10 pt-6 text-center">
            <div className="border-r border-white/10">
              <p className="text-xs leading-4 font-normal tracking-wide text-white/60 uppercase">
                Active Users
              </p>
              <p className="text-base leading-6 font-bold">1,842</p>
            </div>
            <div>
              <p className="text-xs leading-4 font-normal tracking-wide text-white/60 uppercase">
                Projects
              </p>
              <p className="text-base leading-6 font-bold">48</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterBrandPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0046AC]">
      <img
        src="/images/auth/tk-login-cover.png"
        alt="signup-cover"
        className="absolute inset-0 h-full w-auto object-cover object-center opacity-40 mix-blend-overlay"
      />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_141%_141%_at_0%_0%,#005CE6_0%,rgba(0,92,230,0)_50%),radial-gradient(ellipse_71%_141%_at_50%_0%,#003399_0%,rgba(0,51,153,0)_50%),radial-gradient(ellipse_141%_141%_at_100%_0%,#0066CC_0%,rgba(0,102,204,0)_50%)]" />

      <div className="relative flex h-full items-center justify-center p-12">
        <div className="flex w-full max-w-lg flex-col gap-12">
          <header className="space-y-2">
            <h2 className="text-3xl leading-9 font-bold text-white">
              True Khmer
            </h2>
            <div className="h-1 w-12 rounded-full bg-indigo-300" />
          </header>

          <section className="space-y-8">
            <h3 className="text-4xl leading-[45px] font-bold text-white">
              Building the foundations of a smarter tomorrow.
            </h3>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-4">
                <img
                  src="/images/auth/signup-card-icon.svg"
                  alt=""
                  className="size-12 rounded-2xl"
                />
                <div>
                  <p className="text-xl leading-7 font-bold">
                    Digital Empowerment
                  </p>
                  <p className="text-sm leading-5 font-normal text-indigo-300">
                    Empowering Cambodia&apos;s Digital Future
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-8">
                <div>
                  <p className="text-3xl leading-9 font-bold">92%</p>
                  <p className="text-xs leading-4 font-semibold tracking-wide text-indigo-300 uppercase">
                    User Satisfaction
                  </p>
                </div>
                <div>
                  <p className="text-3xl leading-9 font-bold">250+</p>
                  <p className="text-xs leading-4 font-semibold tracking-wide text-indigo-300 uppercase">
                    Active Projects
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex -space-x-3">
                  <img
                    src="/images/auth/signup-avatar-1.jpg"
                    alt=""
                    className="size-10 rounded-full border-2 border-[#005CE6]/20 object-cover"
                  />
                  <img
                    src="/images/auth/signup-avatar-2.jpg"
                    alt=""
                    className="size-10 rounded-full border-2 border-[#005CE6]/20 object-cover"
                  />
                  <img
                    src="/images/auth/signup-avatar-3.jpg"
                    alt=""
                    className="size-10 rounded-full border-2 border-[#005CE6]/20 object-cover"
                  />
                  <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#005CE6]/20 bg-indigo-300 text-xs leading-4 font-bold text-sky-950">
                    +15k
                  </div>
                </div>
                <p className="text-sm leading-5 text-white/80 italic">
                  Join our growing community.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
