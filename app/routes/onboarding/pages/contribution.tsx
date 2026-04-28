import { useState } from "react";
import { Form, data, redirect, useActionData } from "react-router";
import { OnboardingHeader } from "~/routes/onboarding/components/onboarding-header";
import { OnboardingBackContinueActions } from "~/routes/onboarding/components/onboarding-back-continue-actions";
import { OnboardingFormError } from "~/routes/onboarding/components/onboarding-form-error";
import { OnboardingRomdoulCorners } from "~/routes/onboarding/components/onboarding-romdoul-corners";
import { OnboardingStepIntro } from "~/routes/onboarding/components/onboarding-step-intro";
import { SelectableContributionCard } from "~/routes/onboarding/components/selectable-contribution-card";
import { saveStep3Contributions } from "~/services/onboarding.server";
import type { Route } from "./+types/contribution";
import { requireOnboardingIncomplete } from "~/lib/server/route-guards.server";
import { onboardingContributionCards } from "~/routes/onboarding/domain/contribution/contribution-cards";
import {
  isContributionInputUnchanged,
  parseContributionForm,
  validateContributionInput,
} from "~/routes/onboarding/domain/contribution/contribution-form";
import { useOnboardingContributionLayoutData } from "~/routes/onboarding/domain/contribution/use-onboarding-contribution-layout-data";
import { handleOnboardingActionError } from "~/routes/onboarding/domain/shared/onboarding-action-error.server";

const selectableContributionKeys = new Set<string>(
  onboardingContributionCards.map((card) => card.key),
);
const featuredContributionCard = onboardingContributionCards.find(
  (card) => card.layout === "featured",
);
const standardContributionCards = onboardingContributionCards.filter(
  (card) => card.layout !== "featured",
);

export async function action({ request }: Route.ActionArgs) {
  const guard = await requireOnboardingIncomplete(request);
  const guardSetCookie = guard.setCookie;
  const cookieHeader = (setCookie?: string) => {
    const headerValue = setCookie ?? guardSetCookie;
    return headerValue ? { headers: { "Set-Cookie": headerValue } } : {};
  };

  const formInput = parseContributionForm(await request.formData());
  const errors = validateContributionInput(formInput.selectedKeys);
  if (errors.form) return data({ errors }, cookieHeader());

  if (isContributionInputUnchanged(formInput)) {
    return redirect("/onboarding/tier", cookieHeader());
  }

  try {
    const result = await saveStep3Contributions(
      request,
      formInput.selectedKeys,
    );
    return redirect("/onboarding/tier", cookieHeader(result.setCookie));
  } catch (error) {
    const handled = await handleOnboardingActionError({
      error,
      request,
      fallbackMessage: "Unable to save contributions. Please try again.",
    });

    if (handled instanceof Response) return handled;
    return data(handled, cookieHeader());
  }
}

export function meta() {
  return [{ title: "Onboarding Contribution | True Khmer" }];
}

export default function OnboardingContributionPage() {
  const actionData = useActionData<typeof action>();
  const onboardingLayoutData = useOnboardingContributionLayoutData();
  const savedContributionKeysFromState =
    onboardingLayoutData.savedContributions?.contributionKeys ?? [];
  const savedContributionKeys = savedContributionKeysFromState
    .filter((key) => selectableContributionKeys.has(key))
    .sort();
  const [selected, setSelected] = useState<string[]>(
    () => savedContributionKeys,
  );
  const canContinue = selected.length > 0;

  function toggleCard(key: string) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white text-[#111827]">
      <OnboardingHeader title="How You'll Engage" titlePosition="right" />

      <main className="relative flex min-h-[calc(100vh-60px)] items-start justify-center overflow-hidden px-6 py-10 font-['Inter'] sm:px-10 md:px-16 lg:px-24 xl:px-80">
        <OnboardingRomdoulCorners />

        <Form
          method="post"
          className="relative z-10 flex w-full max-w-191 flex-col items-start gap-10 py-0"
        >
          {selected.map((key) => (
            <input key={key} type="hidden" name="selected" value={key} />
          ))}
          {savedContributionKeys.map((key) => (
            <input
              key={`initial-${key}`}
              type="hidden"
              name="initialSelected"
              value={key}
            />
          ))}

          <OnboardingStepIntro
            centered
            currentStep={3}
            totalSteps={4}
            stepLabel="How You'll Engage"
            stepBadgeClassName="rounded-full border border-black/10 px-3.75 py-2"
            stepTextClassName="text-xs uppercase tracking-widest text-[#2F6FE4]"
            titleClassName="text-[26.25px] font-semibold leading-[31.5px] tracking-[-0.6563px] text-[#1D283A]"
            descriptionClassName="text-[14px] font-normal leading-5.25 text-[#99A1AF]"
            title={
              <>
                How do you <span className="text-[#2894FA]">plan</span> to use
                the True Khmer App?
              </>
            }
            description={
              <>
                This helps us personalize your experience.
                <br className="hidden sm:block" />
                You can explore everything and add or remove roles anytime.
              </>
            }
          />

          {featuredContributionCard ? (
            <SelectableContributionCard
              key={featuredContributionCard.key}
              title={featuredContributionCard.title}
              description={featuredContributionCard.description}
              icon={featuredContributionCard.icon}
              selected={selected.includes(featuredContributionCard.key)}
              onClick={() => toggleCard(featuredContributionCard.key)}
              layout="featured"
              className="tk-fade-up-1"
            />
          ) : null}

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {standardContributionCards.map((card, index) => (
              <SelectableContributionCard
                key={card.key}
                title={card.title}
                description={card.description}
                icon={card.icon}
                selected={selected.includes(card.key)}
                onClick={() => toggleCard(card.key)}
                className={
                  index === 0
                    ? "tk-fade-up-1"
                    : index === 1
                      ? "tk-fade-up-2"
                      : "tk-fade-up-3"
                }
              />
            ))}
          </div>

          <p className="tk-fade-up-2 text-sm font-normal italic leading-5.25 text-[#99A1AF]">
            Pick at least 1 to continue
          </p>

          <div className="tk-fade-up-2">
            <OnboardingFormError message={actionData?.errors?.form} />
          </div>

          <OnboardingBackContinueActions
            backTo="/onboarding/interest"
            continueDisabled={!canContinue}
            containerClassName="tk-fade-up-3 mt-2"
            continueButtonClassName="min-w-[144px] justify-center"
          />
        </Form>
      </main>
    </div>
  );
}
