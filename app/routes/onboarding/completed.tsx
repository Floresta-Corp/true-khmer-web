import { ArrowRight, Sparkles } from "lucide-react";
import { data, Link } from "react-router";
import { OnboardingHeader } from "~/components/onboarding/onboarding-header";
import { OnboardingRomdoulCorners } from "~/components/onboarding/onboarding-romdoul-corners";
import type { Route } from "./+types/completed";
import { requireCompletedPageAccess } from "~/lib/server/route-guards.server";

export async function loader({ request }: Route.LoaderArgs) {
  const guard = await requireCompletedPageAccess(request);
  if (guard.setCookie) {
    return data(null, { headers: { "Set-Cookie": guard.setCookie } });
  }

  return null;
}

export function meta() {
  return [{ title: "Onboarding Completed | True Khmer" }];
}

export default function OnboardingCompletedPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#111827]">
      <OnboardingHeader title="Setup Completed!" titlePosition="right" />

      <main className="relative flex min-h-[calc(100vh-60px)] items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-8 sm:px-8 md:px-12 lg:px-20 xl:px-80 xl:py-16">
        <OnboardingRomdoulCorners />

        <section className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 text-center">
          <div className="tk-fade-up space-y-2">
            <h1 className="leading-[1.08]">
              <span className="block text-[44px] font-normal text-[#1D4DB4] sm:text-[52px] lg:text-[64px]">
                You&apos;re in.
              </span>
              <span className="text-[48px] font-semibold text-[#1D4DB4] sm:text-[58px] lg:text-[72px]">
                Explore at your{" "}
              </span>
              <span className="text-[48px] font-bold text-[#40A6F2] sm:text-[58px] lg:text-[72px]">
                Pace.
              </span>
            </h1>
          </div>

          <p className="tk-fade-up-1 max-w-2xl text-xl font-medium leading-8 text-[#667085]">
            Your profile is live and you&apos;ve already earned{" "}
            <span className="font-bold text-[#2F6FE4]">10 points</span> for
            setting up. Your journey as a{" "}
            <span className="font-bold">Neary</span> begins now.
          </p>

          <div className="tk-fade-up-2 w-full max-w-lg rounded-2xl border border-[#2F6FE4] bg-[#2894FA1A] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#2F6FE4]">
                <Sparkles size={18} />
              </div>

              <div className="flex min-w-0 flex-1 items-end justify-between gap-3">
                <div className="text-left">
                  <p className="text-sm font-semibold leading-5 text-black">
                    10 points earned
                  </p>
                  <p className="text-xs font-medium leading-5 text-[#667085]">
                    Profile complete
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-normal leading-5 text-[#667085]">
                    Current tier
                  </p>
                  <p className="text-base font-semibold leading-5 text-[#2F6FE4]">
                    Neary
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="tk-fade-up-2 max-w-md text-sm font-normal leading-5 text-[#667085]">
            Your suggested first actions are waiting whenever you&apos;re ready.
          </p>

          <Link
            to="/dashboard"
            className="tk-fade-up-3 inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white"
          >
            Enter my dashboard
            <ArrowRight size={20} />
          </Link>
        </section>
      </main>
    </div>
  );
}
