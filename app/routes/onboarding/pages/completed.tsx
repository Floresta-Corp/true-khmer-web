import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { withAuthData } from "~/lib/server/auth-response.server";
import { OnboardingPageShell } from "~/routes/onboarding/components/onboarding-page-shell";
import { OnboardingRomdoulCorners } from "~/routes/onboarding/components/onboarding-romdoul-corners";
import type { Route } from "./+types/completed";
import { requireUser } from "~/lib/server/route-guards.server";
import { STARTING_MEMBER_TIER } from "~/lib/tiers";

export async function loader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request, { forceFresh: true });
  return withAuthData(auth, null);
}

export function meta() {
  return [{ title: "Onboarding Completed | True Khmer" }];
}

export default function OnboardingCompletedPage() {
  return (
    <OnboardingPageShell
      headerTitle="Setup Completed!"
      headerTitlePosition="right"
      mainClassName="items-center justify-center px-6 py-16.75 sm:px-8 md:px-12 lg:px-20 xl:px-84"
    >
      <OnboardingRomdoulCorners />

      <section className="relative z-10 flex w-full max-w-263 flex-col items-center gap-8 text-center">
        <div className="tk-fade-up flex w-full flex-col items-center justify-center px-2">
          <h1 className="w-full text-[0px] leading-0 font-medium text-[#174FB4]">
            <span className="block text-[48px] leading-17.5 font-normal text-[#174FB4]">
              You&apos;re in.
            </span>
            <span className="text-[68px] leading-17.5 font-medium text-[#174FB4]">
              Explore at your{" "}
            </span>
            <span className="text-[68px] leading-17.5 font-bold text-[#32A8FF]">
              Pace.
            </span>
          </h1>
        </div>

        <p className="tk-fade-up-1 max-w-153.5 text-[20px] leading-7.5 font-medium text-[#65758B]">
          Your profile is live and you&apos;ve already earned{" "}
          <span className="font-bold text-[#2F6FE4]">10 points</span> for
          setting up. Your journey as a{" "}
          <span className="font-bold">{STARTING_MEMBER_TIER.name}</span> begins
          now.
        </p>

        <div className="tk-fade-up-2 w-full max-w-121.5 rounded-2xl border border-[#2F6FE4] bg-[#82CAFF1A] px-5 py-4">
          <div className="flex items-center gap-3.25">
            <div className="flex size-6 shrink-0 items-center justify-center text-[#2F6FE4]">
              <Sparkles size={24} />
            </div>

            <div className="flex min-w-0 flex-1 items-end justify-between gap-3">
              <div className="w-54 text-left">
                <p className="text-sm leading-5 font-semibold text-black">
                  10 points earned
                </p>
                <p className="text-xs leading-5 font-medium text-[#65758B]">
                  Profile complete
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs leading-5 font-normal text-[#48566A]">
                  Current tier
                </p>
                <p className="text-base leading-5 font-semibold text-[#2F6FE4]">
                  {STARTING_MEMBER_TIER.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="tk-fade-up-2 max-w-114.75 text-sm leading-5.25 font-normal text-[#65758B]">
          Your suggested first actions are waiting whenever you&apos;re ready.
        </p>

        <Link
          to="/"
          className="tk-fade-up-3 inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white"
        >
          Go to home
          <ArrowRight size={24} />
        </Link>
      </section>
    </OnboardingPageShell>
  );
}
