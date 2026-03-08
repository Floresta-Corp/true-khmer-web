import { Form, redirect, useActionData } from "react-router";
import { OnboardingBackContinueActions } from "~/components/onboarding/onboarding-back-continue-actions";
import { OnboardingCurrentTierCard } from "~/components/onboarding/onboarding-current-tier-card";
import { OnboardingFormError } from "~/components/onboarding/onboarding-form-error";
import { OnboardingHeader } from "~/components/onboarding/onboarding-header";
import { OnboardingRomdoulCorners } from "~/components/onboarding/onboarding-romdoul-corners";
import { OnboardingStepIntro } from "~/components/onboarding/onboarding-step-intro";
import { OnboardingTierPathCard } from "~/components/onboarding/onboarding-tier-path-card";
import type { Route } from "./+types/tier";
import { saveStep4Complete } from "~/services/onboarding.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { handleOnboardingActionError } from "~/features/onboarding/shared/onboarding-action-error.server";

export async function action({ request }: Route.ActionArgs) {
  await requireAuthenticatedUser(request);

  try {
    const result = await saveStep4Complete(request);
    return redirect(
      "/onboarding/completed",
      result.setCookie
        ? {
            headers: { "Set-Cookie": result.setCookie },
          }
        : {},
    );
  } catch (error) {
    return handleOnboardingActionError({
      error,
      request,
      fallbackMessage: "Unable to complete onboarding. Please try again.",
    });
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

      <main className="relative flex min-h-[calc(100vh-60px)] items-start justify-center overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 md:px-12 lg:px-20 xl:px-80 xl:py-8">
        <OnboardingRomdoulCorners />

        <Form
          method="post"
          className="relative z-10 flex w-full max-w-lg flex-col gap-6 pb-6 sm:gap-7 sm:pb-8"
        >
          <OnboardingStepIntro
            currentStep={4}
            totalSteps={4}
            stepLabel="Your Starting Rank"
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
            descriptionClassName="text-sm font-normal leading-6 text-[#98A2B3]"
          />

          <OnboardingCurrentTierCard />
          <OnboardingTierPathCard />

          <OnboardingFormError message={actionData?.errors?.form} />

          <OnboardingBackContinueActions
            backTo="/onboarding/contribution"
            continueLabel="Complete your setup"
            showContinueIcon={false}
            containerClassName="flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between"
            backButtonClassName="justify-center sm:justify-start"
            continueButtonClassName="justify-center"
          />
        </Form>
      </main>
    </div>
  );
}
