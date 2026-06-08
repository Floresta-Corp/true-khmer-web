import { Form, useActionData } from "react-router";
import { OnboardingBackContinueActions } from "~/routes/onboarding/components/onboarding-back-continue-actions";
import { OnboardingCurrentTierCard } from "~/routes/onboarding/components/onboarding-current-tier-card";
import { OnboardingFormError } from "~/routes/onboarding/components/onboarding-form-error";
import { OnboardingPageShell } from "~/routes/onboarding/components/onboarding-page-shell";
import { OnboardingRomdoulCorners } from "~/routes/onboarding/components/onboarding-romdoul-corners";
import { OnboardingStepIntro } from "~/routes/onboarding/components/onboarding-step-intro";
import { OnboardingTierPathCard } from "~/routes/onboarding/components/onboarding-tier-path-card";
import type { Route } from "./+types/tier";
import { saveStep4Complete } from "~/services/onboarding.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { requireOnboarding } from "~/lib/server/route-guards.server";
import { handleOnboardingActionError } from "~/routes/onboarding/domain/shared/onboarding-action-error.server";

export async function action({ request }: Route.ActionArgs) {
  const auth = await requireOnboarding(request);
  const authWithCookie = (setCookie?: string) => ({
    setCookie: [auth.setCookie, setCookie].flatMap((cookie) =>
      Array.isArray(cookie) ? cookie : cookie ? [cookie] : [],
    ),
  });

  try {
    const result = await saveStep4Complete(request);
    return withAuthRedirect(
      authWithCookie(result.setCookie),
      "/onboarding/completed",
    );
  } catch (error) {
    const handled = await handleOnboardingActionError({
      error,
      request,
      fallbackMessage: "Unable to complete onboarding. Please try again.",
    });

    if (handled instanceof Response) return handled;
    return withAuthData(authWithCookie(), handled);
  }
}

export function meta() {
  return [{ title: "Onboarding Tier | True Khmer" }];
}

export default function OnboardingTierPage() {
  const actionData = useActionData<typeof action>();

  return (
    <OnboardingPageShell
      headerTitle="Your Tier"
      headerTitlePosition="right"
      mainClassName="items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-20"
    >
      <OnboardingRomdoulCorners />

      <Form
        method="post"
        className="relative z-10 flex w-full max-w-lg flex-col gap-5 sm:gap-6 lg:gap-8"
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

        {actionData?.errors?.form ? (
          <div className="tk-fade-up-2">
            <OnboardingFormError message={actionData.errors.form} />
          </div>
        ) : null}

        <OnboardingBackContinueActions
          backTo="/onboarding/contribution"
          continueLabel="Complete your setup"
          showContinueIcon={false}
          containerClassName="tk-fade-up-3 flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between"
          backButtonClassName="justify-center sm:justify-start"
          continueButtonClassName="justify-center"
        />
      </Form>
    </OnboardingPageShell>
  );
}
