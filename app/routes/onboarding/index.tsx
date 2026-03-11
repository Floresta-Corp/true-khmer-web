import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { OnboardingHeader } from "~/components/onboarding/onboarding-header";
import { OnboardingRomdoulCorners } from "~/components/onboarding/onboarding-romdoul-corners";

export function meta() {
  return [{ title: "Onboarding | True Khmer" }];
}

export default function OnboardingWelcomePage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <OnboardingHeader title="Welcome" titlePosition="right" />

      <main className="relative flex min-h-[calc(100vh-60px)] items-center justify-center overflow-hidden bg-white px-6 py-12 sm:px-10 md:px-16 lg:px-24 xl:px-80 xl:py-16">
        <OnboardingRomdoulCorners />

        <section className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 text-center">
          <div className="tk-fade-up rounded-full border border-black/10 px-3.5 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2894FA]">
              Built by Cambodians, for Cambodians
            </p>
          </div>

          <h1 className="tk-fade-up-1 leading-[1.04]">
            <span className="block text-5xl font-normal text-[#1D4DB4] md:text-6xl">
              Welcome to
            </span>
            <span className="text-6xl font-bold text-[#40A6F2] md:text-7xl">
              True
            </span>{" "}
            <span className="text-6xl font-bold text-[#1D4DB4] md:text-7xl">
              Khmer
            </span>
          </h1>

          <p className="tk-fade-up-2 max-w-md text-xl font-medium leading-8 text-[#62748E]">
            Let&apos;s take 2 minutes to set up your profile and get you earning
            your first points.
          </p>

          <Link
            to="/onboarding/profile"
            className="tk-fade-up-3 inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white"
          >
            Let&apos;s get started
            <ArrowRight size={20} />
          </Link>
        </section>
      </main>
    </div>
  );
}
