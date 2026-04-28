import { Form, data, redirect, useActionData } from "react-router";
import { OnboardingBackContinueActions } from "~/routes/onboarding/components/onboarding-back-continue-actions";
import { OnboardingCurrentTierCard } from "~/routes/onboarding/components/onboarding-current-tier-card";
import { OnboardingFormError } from "~/routes/onboarding/components/onboarding-form-error";
import { OnboardingHeader } from "~/routes/onboarding/components/onboarding-header";
import { OnboardingRomdoulCorners } from "~/routes/onboarding/components/onboarding-romdoul-corners";
import { OnboardingStepIntro } from "~/routes/onboarding/components/onboarding-step-intro";
import { OnboardingTierPathCard } from "~/routes/onboarding/components/onboarding-tier-path-card";
import type { Route } from "./+types/tier";
import { saveStep4Complete } from "~/services/onboarding.server";
import { requireOnboardingIncomplete } from "~/lib/server/route-guards.server";
import { handleOnboardingActionError } from "~/routes/onboarding/domain/shared/onboarding-action-error.server";

export async function action({ request }: Route.ActionArgs) {
  const guard = await requireOnboardingIncomplete(request);
  const guardSetCookie = guard.setCookie;
  const cookieHeader = (setCookie?: string) => {
    const headerValue = setCookie ?? guardSetCookie;
    return headerValue ? { headers: { "Set-Cookie": headerValue } } : {};
  };

  try {
    const result = await saveStep4Complete(request);
    return redirect("/onboarding/completed", cookieHeader(result.setCookie));
  } catch (error) {
    const handled = await handleOnboardingActionError({
      error,
      request,
      fallbackMessage: "Unable to complete onboarding. Please try again.",
    });

    if (handled instanceof Response) return handled;
    return data(handled, cookieHeader());
  }
}

export function meta() {
  return [{ title: "Onboarding Tier | True Khmer" }];
}

export default function OnboardingTierPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#111827]">
      <OnboardingHeader title="Your Tier" titlePosition="right" />

      <main className="relative flex min-h-[calc(100vh-60px)] items-start justify-center overflow-x-hidden overflow-y-auto px-6 py-10 font-['Inter'] sm:px-8 sm:py-10 md:px-12 lg:px-20 xl:px-80">
        <OnboardingRomdoulCorners />

        <Form
          method="post"
          className="relative z-10 flex w-full max-w-121.5 flex-col gap-10 pb-6 sm:pb-8"
        >
          <OnboardingStepIntro
            currentStep={4}
            totalSteps={4}
            stepLabel="Your Starting Rank"
            stepBadgeClassName="rounded-full border border-black/10 px-3.75 py-2"
            stepTextClassName="text-xs uppercase tracking-widest text-[#2F6FE4]"
            titleClassName="text-[26.25px] font-semibold leading-[31.5px] tracking-[-0.6563px] text-[#1D283A]"
            descriptionClassName="text-[14px] font-normal leading-5.25 text-[#99A1AF]"
            title={
              <>
                Your <span className="text-[#2894FA]">journey begins</span> here
              </>
            }
            description={
              <>
                Every True Khmer member starts at{" "}
                <span className="font-bold">Neary</span> but there are greater
                ranks to earn. Your actions shape how fast you rise.
              </>
            }
          />

          <div className="tk-fade-up-1">
            <OnboardingCurrentTierCard />
          </div>
          <div className="tk-fade-up-2">
            <OnboardingTierPathCard />
          </div>

          <div className="tk-fade-up-2">
            <OnboardingFormError message={actionData?.errors?.form} />
          </div>

          <OnboardingBackContinueActions
            backTo="/onboarding/contribution"
            continueLabel="Complete your setup"
            showContinueIcon={false}
            containerClassName="tk-fade-up-3 flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between"
            backButtonClassName="justify-center sm:justify-start"
            continueButtonClassName="justify-center"
          />
        </Form>
      </main>
    </div>
  );
}
