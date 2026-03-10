import { useState } from "react";
import {
  Form,
  data,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import { OnboardingHeader } from "~/components/onboarding/onboarding-header";
import { OnboardingBackContinueActions } from "~/components/onboarding/onboarding-back-continue-actions";
import { OnboardingFormError } from "~/components/onboarding/onboarding-form-error";
import { OnboardingRomdoulCorners } from "~/components/onboarding/onboarding-romdoul-corners";
import { OnboardingStepIntro } from "~/components/onboarding/onboarding-step-intro";
import { SelectableContributionCard } from "~/components/onboarding/selectable-contribution-card";
import {
  getContributions,
  saveStep3Contributions,
} from "~/services/onboarding.server";
import type { Route } from "./+types/contribution";
import {
  AuthSessionExpiredError,
} from "~/lib/server/api-client.server";
import { destroySession, getSession } from "~/lib/server/session.server";
import { requireOnboardingIncomplete } from "~/lib/server/route-guards.server";
import {
  contributionIconByKey,
  mapContributionOptionsToCards,
} from "~/features/onboarding/contribution/contribution-cards";
import {
  isContributionInputUnchanged,
  parseContributionForm,
  validateContributionInput,
} from "~/features/onboarding/contribution/contribution-form";
import { useOnboardingContributionLayoutData } from "~/features/onboarding/contribution/use-onboarding-contribution-layout-data";
import { handleOnboardingActionError } from "~/features/onboarding/shared/onboarding-action-error.server";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const result = await getContributions(request);
    if (result.data.length === 0) {
      return data(
        {
          cards: [],
          contributionsError:
            "No contribution options are available from the server.",
        },
        result.setCookie ? { headers: { "Set-Cookie": result.setCookie } } : {},
      );
    }

    const cards = mapContributionOptionsToCards(result.data);

    return data(
      { cards, contributionsError: "" },
      result.setCookie ? { headers: { "Set-Cookie": result.setCookie } } : {},
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      const session = await getSession(request);
      throw redirect("/login", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    return data({
      cards: [],
      contributionsError: "Unable to load contributions from backend.",
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const guard = await requireOnboardingIncomplete(request);
  const guardSetCookie = guard.setCookie;
  const cookieHeader = (setCookie?: string) => {
    const headerValue = setCookie ?? guardSetCookie;
    return headerValue ? { headers: { "Set-Cookie": headerValue } } : {};
  };

  const formInput = parseContributionForm(await request.formData());
  const errors = validateContributionInput(formInput.selectedIds);
  if (errors.form) return data({ errors }, cookieHeader());

  if (isContributionInputUnchanged(formInput)) {
    return redirect("/onboarding/tier", cookieHeader());
  }

  try {
    const result = await saveStep3Contributions(request, formInput.selectedIds);
    return redirect(
      "/onboarding/tier",
      cookieHeader(result.setCookie),
    );
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
  const { cards, contributionsError } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const onboardingLayoutData = useOnboardingContributionLayoutData();
  const savedContributionIds =
    onboardingLayoutData.savedContributions?.contributionIds ?? [];
  const [selected, setSelected] = useState<string[]>(() =>
    savedContributionIds.filter((id) => cards.some((card) => card.id === id)),
  );
  const canContinue = selected.length > 0;

  function toggleCard(key: string) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white text-[#111827]">
      <OnboardingHeader title="Your Contribution" />

      <main className="relative flex min-h-[calc(100vh-60px)] items-start justify-center overflow-hidden px-6 pt-8 pb-12 font-['Inter'] sm:px-10 md:px-16 lg:px-24 xl:px-80 xl:pt-10">
        <OnboardingRomdoulCorners />

        <Form
          method="post"
          className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 py-0"
        >
          {selected.map((id) => (
            <input key={id} type="hidden" name="selected" value={id} />
          ))}
          {savedContributionIds.map((id) => (
            <input
              key={`initial-${id}`}
              type="hidden"
              name="initialSelected"
              value={id}
            />
          ))}

          <OnboardingStepIntro
            centered
            currentStep={3}
            totalSteps={4}
            stepLabel="Your Contribution"
            title={
              <>
                How will you <span className="text-[#2894FA]">contribute</span>?
              </>
            }
            description="You start as a Member by default — add extra roles to unlock more features. You can switch roles anytime."
            titleClassName="text-2xl font-semibold leading-8 text-[#334155]"
            descriptionClassName="text-sm font-normal leading-5 text-[#99A1AF]"
          />

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              return (
                <SelectableContributionCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={contributionIconByKey[card.iconKey]}
                  selected={selected.includes(card.id)}
                  onClick={() => toggleCard(card.id)}
                />
              );
            })}
          </div>

          {contributionsError ? (
            <p className="w-full text-center text-sm text-red-500">
              {contributionsError}
            </p>
          ) : null}

          <OnboardingFormError message={actionData?.errors?.form} />

          <OnboardingBackContinueActions
            backTo="/onboarding/interest"
            continueDisabled={!canContinue}
          />
        </Form>
      </main>
    </div>
  );
}
