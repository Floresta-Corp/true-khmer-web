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
import { InterestSelector } from "~/components/onboarding/interest-selector";
import { OnboardingRomdoulCorners } from "~/components/onboarding/onboarding-romdoul-corners";
import { OnboardingStepIntro } from "~/components/onboarding/onboarding-step-intro";
import type { Route } from "./+types/interest";
import { getInterests, saveStep2Interests } from "~/services/onboarding.server";
import {
  AuthSessionExpiredError,
} from "~/lib/server/api-client.server";
import { destroySession, getSession } from "~/lib/server/session.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  isInterestInputUnchanged,
  parseInterestForm,
  validateInterestInput,
} from "~/features/onboarding/interest/interest-form";
import { useOnboardingInterestLayoutData } from "~/features/onboarding/interest/use-onboarding-interest-layout-data";
import { handleOnboardingActionError } from "~/features/onboarding/shared/onboarding-action-error.server";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const result = await getInterests(request);
    const interests = result.data.map((item) => ({
      id: item.id,
      label: item.name,
      icon: item.icon || "✨",
    }));

    return data(
      {
        interests,
        interestsError:
          interests.length === 0
            ? "No interests are currently available from the server."
            : "",
      },
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
      interests: [],
      interestsError: "Unable to load interests from backend.",
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  await requireAuthenticatedUser(request);

  const formInput = parseInterestForm(await request.formData());
  const errors = validateInterestInput(formInput.selectedIds);
  if (errors.form) return { errors };

  if (isInterestInputUnchanged(formInput)) {
    return redirect("/onboarding/contribution");
  }

  try {
    const result = await saveStep2Interests(request, formInput.selectedIds);
    return redirect(
      "/onboarding/contribution",
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
      fallbackMessage: "Unable to save interests. Please try again.",
    });
  }
}

export function meta() {
  return [{ title: "Onboarding Interest | True Khmer" }];
}

export default function OnboardingInterestPage() {
  const { interests, interestsError } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const onboardingLayoutData = useOnboardingInterestLayoutData();
  const savedInterestIds =
    onboardingLayoutData.savedInterests?.interestIds ?? [];
  const [selected, setSelected] = useState<string[]>(() =>
    savedInterestIds.filter((id) =>
      interests.some((interest) => interest.id === id),
    ),
  );
  const canContinue = selected.length >= 2;

  function toggleInterest(key: string) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white text-[#111827]">
      <OnboardingHeader
        title="Interest"
        rightText="Skip this step"
        rightTo="/onboarding/contribution"
      />

      <main className="relative flex min-h-[calc(100vh-60px)] items-start justify-center overflow-hidden px-6 pt-8 pb-12 sm:px-10 md:px-16 lg:px-24 xl:px-80 xl:pt-10">
        <OnboardingRomdoulCorners />

        <Form
          method="post"
          className="relative z-10 flex w-full max-w-lg flex-col items-start gap-10 py-0"
        >
          {selected.map((id) => (
            <input key={id} type="hidden" name="selected" value={id} />
          ))}
          {savedInterestIds.map((id) => (
            <input
              key={`initial-${id}`}
              type="hidden"
              name="initialSelected"
              value={id}
            />
          ))}

          <OnboardingStepIntro
            currentStep={2}
            totalSteps={4}
            stepLabel="Your Interests"
            title={
              <>
                What <span className="text-[#2894FA]">drives you</span> forward?
              </>
            }
            description={
              <>
                Select your areas of interest. We&apos;ll use this to
                personalize your feed, suggest projects, and match you with
                opportunities.
              </>
            }
          />

          <InterestSelector
            interests={interests}
            selectedIds={selected}
            onToggle={toggleInterest}
          />

          {interestsError ? (
            <p className="text-sm text-red-500">{interestsError}</p>
          ) : null}

          <p className="self-stretch text-sm font-normal italic leading-5 text-[#99A1AF]">
            Pick at least 2. You can update these anytime later.
          </p>

          <OnboardingFormError message={actionData?.errors?.form} />

          <OnboardingBackContinueActions
            backTo="/onboarding/profile"
            continueDisabled={!canContinue}
          />
        </Form>
      </main>
    </div>
  );
}
