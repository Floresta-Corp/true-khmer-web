import { useEffect, useMemo, useRef, useState } from "react";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
  data,
  redirect,
} from "react-router";
import { OnboardingBackContinueActions } from "~/routes/onboarding/components/onboarding-back-continue-actions";
import { OnboardingFormError } from "~/routes/onboarding/components/onboarding-form-error";
import { OnboardingPageShell } from "~/routes/onboarding/components/onboarding-page-shell";
import { OnboardingRomdoulCorners } from "~/routes/onboarding/components/onboarding-romdoul-corners";
import { OnboardingStepIntro } from "~/routes/onboarding/components/onboarding-step-intro";
import { ProfilePhotoUpload } from "~/routes/onboarding/components/profile-photo-upload";

import {
  getCountries,
  saveStep1Profile,
  type SavedOnboardingProfile,
  type OnboardingOption,
} from "~/services/onboarding.server";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { destroySession, getSession } from "~/lib/server/session.server";
import { requireOnboarding } from "~/lib/server/route-guards.server";
import {
  type ProfileFormErrors,
  isProfileInputUnchanged,
  parseProfileForm,
  validateProfileInput,
} from "~/routes/onboarding/domain/profile/profile-form";
import {
  getInitials,
  readValidationIssues,
} from "~/routes/onboarding/domain/profile/profile-utils";
import { useOnboardingProfileLayoutData } from "~/routes/onboarding/domain/profile/use-onboarding-profile-layout-data";
import { useAvatarUpload } from "~/routes/onboarding/domain/profile/use-avatar-upload";
import { handleOnboardingActionError } from "~/routes/onboarding/domain/shared/onboarding-action-error.server";
import { Label } from "~/components/ui/label";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";
import { Textarea } from "~/components/ui/textarea";
import type { Route } from "./+types/onboarding-profile";

type CitiesFetcherData = {
  success: boolean;
  message?: string;
  cities: OnboardingOption[];
  countryId?: string;
};

const EMPTY_SAVED_PROFILE: SavedOnboardingProfile = {
  countryId: "",
  cityId: "",
  bio: "",
  avatarUrl: "",
  avatarKey: "",
};

export async function loader({ request }: Route.LoaderArgs) {
  let countries: OnboardingOption[] = [];
  let setCookie: string | undefined;
  let countriesError = "";

  try {
    const countriesResult = await getCountries(request);
    countries = countriesResult.data;
    if (countriesResult.setCookie) setCookie = countriesResult.setCookie;
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) {
      const session = await getSession(request);
      throw redirect("/login", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }

    countriesError =
      error instanceof Error
        ? error.message
        : "Unable to load country options from backend.";
  }

  return data(
    {
      countries,
      countriesError,
    },
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
}

export async function action({ request }: Route.ActionArgs) {
  const auth = await requireOnboarding(request);
  const authWithCookie = (setCookie?: string) => ({
    setCookie: [auth.setCookie, setCookie].flatMap((cookie) =>
      Array.isArray(cookie) ? cookie : cookie ? [cookie] : [],
    ),
  });

  const formInput = parseProfileForm(await request.formData());
  const errors: ProfileFormErrors = validateProfileInput({
    countryId: formInput.countryId,
    cityId: formInput.cityId,
  });

  if (Object.keys(errors).length > 0) {
    return withAuthData(authWithCookie(), { errors });
  }

  if (isProfileInputUnchanged(formInput)) {
    return withAuthRedirect(authWithCookie(), "/onboarding/interest");
  }

  try {
    const result = await saveStep1Profile(request, {
      countryId: formInput.countryId,
      cityId: formInput.cityId,
      bio: formInput.bio,
      ...(formInput.avatarKey ? { avatarKey: formInput.avatarKey } : {}),
    });
    return withAuthRedirect(
      authWithCookie(result.setCookie),
      "/onboarding/interest",
    );
  } catch (error) {
    const handled = await handleOnboardingActionError<ProfileFormErrors>({
      error,
      request,
      fallbackMessage: "Unable to save profile. Please try again.",
      mapProtectedError: (protectedError) => {
        const issues = readValidationIssues(protectedError.details);
        return issues.length > 0
          ? issues.join("\n")
          : protectedError.message || "Validation failed.";
      },
    });

    if (handled instanceof Response) return handled;
    return withAuthData(authWithCookie(), handled);
  }
}

export function meta() {
  return [{ title: "Onboarding Profile | True Khmer" }];
}

export default function OnboardingProfilePage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const citiesFetcher = useFetcher<CitiesFetcherData>();
  const initializedCitiesRef = useRef(false);
  const onboardingLayoutData = useOnboardingProfileLayoutData();

  const savedProfile = onboardingLayoutData.savedProfile ?? EMPTY_SAVED_PROFILE;
  const userEmail =
    onboardingLayoutData?.onboardingState?.raw?.user?.email ?? "";
  const placeholderInitials =
    getInitials(userEmail.split("@")[0] || "") || "PO";

  const [profileForm, setProfileForm] = useState({
    countryId: savedProfile.countryId,
    cityId: savedProfile.cityId,
    bio: savedProfile.bio,
  });
  const {
    avatarPreviewUrl,
    avatarKey,
    uploadError,
    uploadProgress,
    isUploading,
    handleAvatarChange,
  } = useAvatarUpload({
    initialAvatarUrl: savedProfile.avatarUrl,
    initialAvatarKey: savedProfile.avatarKey,
  });
  const [cityOptions, setCityOptions] = useState<OnboardingOption[]>([]);
  const [citiesError, setCitiesError] = useState("");

  const selectedCountryId = profileForm.countryId;
  const selectedCityId = profileForm.cityId;
  const countriesError = loaderData.countriesError;
  const countryOptions = useMemo(
    () =>
      loaderData.countries.map((country) => ({
        value: country.id,
        label: country.name,
      })),
    [loaderData.countries],
  );
  const citySelectOptions = useMemo(
    () =>
      cityOptions.map((city) => ({
        value: city.id,
        label: city.name,
      })),
    [cityOptions],
  );

  useEffect(() => {
    if (initializedCitiesRef.current) return;
    initializedCitiesRef.current = true;
    if (!savedProfile.countryId) return;
    citiesFetcher.load(
      `/api/onboarding/cities?countryId=${encodeURIComponent(savedProfile.countryId)}`,
    );
  }, [citiesFetcher, savedProfile.countryId]);

  useEffect(() => {
    if (citiesFetcher.state !== "idle" || !citiesFetcher.data) return;

    if (!selectedCountryId) {
      setCityOptions([]);
      setProfileForm((current) => ({ ...current, cityId: "" }));
      setCitiesError("");
      return;
    }

    if (
      citiesFetcher.data.countryId &&
      citiesFetcher.data.countryId !== selectedCountryId
    ) {
      return;
    }

    if (citiesFetcher.data.success) {
      const nextCities = citiesFetcher.data.cities;
      setCityOptions(nextCities);
      setProfileForm((current) => ({
        ...current,
        cityId: nextCities.some((item) => item.id === current.cityId)
          ? current.cityId
          : "",
      }));
      setCitiesError("");
      return;
    }

    setCityOptions([]);
    setProfileForm((current) => ({ ...current, cityId: "" }));
    setCitiesError(citiesFetcher.data.message || "Unable to load cities.");
  }, [citiesFetcher.state, citiesFetcher.data, selectedCountryId]);

  const isSubmitting = navigation.state === "submitting";
  const canContinue = useMemo(
    () =>
      profileForm.countryId.trim() !== "" &&
      profileForm.cityId.trim() !== "" &&
      !isUploading,
    [profileForm.countryId, profileForm.cityId, isUploading],
  );

  function handleCountryChange(nextCountryId: string) {
    setProfileForm((current) => ({
      ...current,
      countryId: nextCountryId,
      cityId: "",
    }));
    setCityOptions([]);
    setCitiesError("");
    if (!nextCountryId) return;
    citiesFetcher.load(
      `/api/onboarding/cities?countryId=${encodeURIComponent(nextCountryId)}`,
    );
  }

  return (
    <OnboardingPageShell
      headerTitle="Profile"
      headerRightText="Skip this step"
      headerRightTo="/onboarding/interest"
      mainClassName="items-center px-6 py-8 sm:px-10 md:px-16 lg:px-24 xl:px-80 xl:py-10"
    >
      <OnboardingRomdoulCorners />

      <Form
        method="post"
        className="relative z-10 flex w-full max-w-lg flex-col gap-10 py-6"
      >
        <input type="hidden" name="countryId" value={selectedCountryId} />
        <input type="hidden" name="cityId" value={selectedCityId} />
        <input type="hidden" name="avatarKey" value={avatarKey} />
        <input
          type="hidden"
          name="initialCountryId"
          value={savedProfile.countryId}
        />
        <input type="hidden" name="initialCityId" value={savedProfile.cityId} />
        <input type="hidden" name="initialBio" value={savedProfile.bio} />
        <input
          type="hidden"
          name="initialAvatarKey"
          value={savedProfile.avatarKey}
        />

        <OnboardingStepIntro
          currentStep={1}
          totalSteps={4}
          stepLabel="Your Identity"
          stepBadgeClassName="rounded-full border border-black/10 px-3.75 py-2"
          stepTextClassName="text-xs uppercase tracking-widest text-[#2F6FE4]"
          titleClassName="text-[26.25px] font-semibold leading-[31.5px] tracking-[-0.6563px] text-[#030213]"
          title={
            <>
              Build your <span className="text-[#2894FA]">profile</span>
            </>
          }
          description="This is how the community sees you."
          descriptionClassName="text-sm font-medium leading-5 text-[#99A1AF]"
        />

        <div className="tk-fade-up-1 space-y-10">
          <ProfilePhotoUpload
            avatarPreviewUrl={avatarPreviewUrl}
            placeholderInitials={placeholderInitials}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            avatarKey={avatarKey}
            uploadError={uploadError}
            onAvatarChange={handleAvatarChange}
          />

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="onboarding-country-trigger"
                  className="text-sm font-bold leading-5.25 text-[#364153]"
                >
                  Country
                </Label>
                <SingleSelectDropdown
                  id="onboarding-country"
                  value={selectedCountryId}
                  onValueChange={handleCountryChange}
                  options={countryOptions}
                  placeholder="Select country"
                  searchable
                  allowClear
                  clearLabel="Select country"
                  emptyText="No countries found"
                  triggerClassName="text-sm font-medium text-[#65758B]"
                  contentClassName="rounded-xl p-2"
                />
                {actionData?.errors?.countryId ? (
                  <p className="text-xs text-red-500">
                    {actionData.errors.countryId}
                  </p>
                ) : null}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="onboarding-city-trigger"
                  className="text-sm font-bold leading-5.25 text-[#364153]"
                >
                  City/State
                </Label>
                <SingleSelectDropdown
                  id="onboarding-city"
                  value={selectedCityId}
                  onValueChange={(nextCityId) =>
                    setProfileForm((current) => ({
                      ...current,
                      cityId: nextCityId,
                    }))
                  }
                  options={citySelectOptions}
                  placeholder={
                    selectedCountryId ? "Select city" : "Select country first"
                  }
                  disabled={!selectedCountryId}
                  loading={citiesFetcher.state === "loading"}
                  searchable
                  emptyText={
                    selectedCountryId
                      ? "No cities found"
                      : "Select country first"
                  }
                  triggerClassName="text-sm font-medium text-[#65758B]"
                  contentClassName="rounded-xl p-2"
                />
                {actionData?.errors?.cityId ? (
                  <p className="text-xs text-red-500">
                    {actionData.errors.cityId}
                  </p>
                ) : null}
              </div>
            </div>

            {countriesError ? (
              <p className="text-xs text-red-500">{countriesError}</p>
            ) : null}

            {citiesError ? (
              <p className="text-xs text-red-500">{citiesError}</p>
            ) : null}

            <div className="space-y-3">
              <Label
                htmlFor="onboarding-profile-bio"
                className="text-sm leading-5.25 text-[#364153]"
              >
                <span className="font-bold">Short Bio</span>{" "}
                <span className="font-normal">(optional)</span>
              </Label>
              <Textarea
                id="onboarding-profile-bio"
                name="bio"
                value={profileForm.bio}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
                }
                rows={3}
                className="h-20 w-full resize-none rounded-md border-transparent bg-[#F1F5F980] px-3 py-2 text-sm font-normal leading-5 text-[#62748E] placeholder:text-[#94A3B8] focus-visible:border-[#2F6FE4]/40 focus-visible:ring-[#2F6FE4]/20"
                placeholder="Tell the community a little about yourself - what you do, what you care about, what you're building..."
              />
            </div>
          </div>

          <OnboardingFormError
            message={actionData?.errors?.form}
            preserveLineBreaks
          />
        </div>

        <OnboardingBackContinueActions
          backTo="/onboarding"
          continueDisabled={!canContinue || isSubmitting}
          containerClassName="tk-fade-up-2"
        />
      </Form>
    </OnboardingPageShell>
  );
}
