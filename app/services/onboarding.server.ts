import {
  apiRequestWithAccessToken,
  apiRequestWithSession,
  type ApiResult,
} from "~/lib/server/api-client.server";
import { getUser } from "~/lib/server/session.server";

export type OnboardingState = {
  completed: boolean;
  currentStep: number;
  raw: BackendOnboardingState;
};

export type OnboardingOption = {
  id: string;
  name: string;
};

export type OnboardingContributionOption = OnboardingOption & {
  slug: string;
  iconKey: string;
  description: string;
};

export type OnboardingInterestOption = OnboardingOption & {
  slug: string;
  icon: string;
};

export type SavedOnboardingProfile = {
  countryId: string;
  cityId: string;
  bio: string;
  avatarUrl: string;
  avatarKey: string;
};

export type SavedOnboardingInterests = {
  interestIds: string[];
};

export type SavedOnboardingContributions = {
  contributionIds: string[];
};

type BackendOnboardingProfile = {
  countryId: string | null;
  cityId: string | null;
  bio: string | null;
  avatarUrl: string | null;
  avatarKey: string | null;
};

type BackendOnboardingUser = {
  id: string;
  email: string;
  role: string;
  onboardingStep: number;
  onboardingCompletedAt: string | null;
};

type BackendOnboardingState = {
  user: BackendOnboardingUser;
  profile: BackendOnboardingProfile | null;
  selectedInterestIds: string[];
  selectedContributionIds: string[];
  progress: {
    totalPoints: number;
    tier: {
      id: string;
      slug: string;
      name: string;
      rankOrder: number;
      minPoints: number;
    } | null;
  };
};

export type OnboardingStateResponse = {
  ok: boolean;
  state: BackendOnboardingState;
};

type RawOptionItem = {
  id?: unknown;
  name?: unknown;
  label?: unknown;
  title?: unknown;
  slug?: unknown;
  icon?: unknown;
  iconKey?: unknown;
  description?: unknown;
};

type OptionContainer = {
  countries?: RawOptionItem[];
  cities?: RawOptionItem[];
  interests?: RawOptionItem[];
  contributions?: RawOptionItem[];
  options?: RawOptionItem[];
  items?: RawOptionItem[];
  data?: RawOptionItem[] | Record<string, unknown>;
};

type CacheEntry<TItem> = {
  data: TItem[];
  expiresAt: number;
};

type OnboardingStateCacheEntry = {
  state: OnboardingState;
  expiresAt: number;
};

type GetOnboardingStateOptions = {
  forceFresh?: boolean;
};

// Location/interest options are relatively static and expensive to fetch,
// so we cache them for longer (10 minutes) to reduce backend load.
const OPTIONS_CACHE_TTL_MS = 10 * 60 * 1000;

// Onboarding state (current step, selections, progress) can change quickly
// while a user is going through the flow, so we use a short TTL (15 seconds)
// to avoid serving stale state while still getting some benefit from caching.
const ONBOARDING_STATE_CACHE_TTL_MS = 15 * 1000;

const countriesCache = new Map<string, CacheEntry<OnboardingOption>>();
const interestsCache = new Map<string, CacheEntry<OnboardingInterestOption>>();
const contributionsCache = new Map<
  string,
  CacheEntry<OnboardingContributionOption>
>();
const citiesCache = new Map<string, CacheEntry<OnboardingOption>>();
const onboardingStateCache = new Map<string, OnboardingStateCacheEntry>();

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function toStringOrEmpty(value: string | null | undefined) {
  return typeof value === "string" ? value : "";
}

function toStep(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
}

function parseOnboardingStateResponse(
  payload: unknown,
  context: string,
): OnboardingStateResponse {
  if (!isObject(payload)) {
    throw new Error(`${context}: response must be an object`);
  }

  if (payload.ok !== true) {
    const message =
      typeof payload.error === "string"
        ? payload.error
        : "Onboarding state response was not ok";
    throw new Error(`${context}: ${message}`);
  }

  if (!isObject(payload.state)) {
    throw new Error(`${context}: missing state object`);
  }

  const state = payload.state;
  if (!isObject(state.user)) {
    throw new Error(`${context}: missing state.user`);
  }

  const user = state.user;
  if (
    typeof user.id !== "string" ||
    typeof user.email !== "string" ||
    typeof user.role !== "string" ||
    typeof user.onboardingStep !== "number" ||
    !(
      user.onboardingCompletedAt === null ||
      typeof user.onboardingCompletedAt === "string"
    )
  ) {
    throw new Error(`${context}: invalid state.user payload`);
  }

  if (!(state.profile === null || isObject(state.profile))) {
    throw new Error(`${context}: invalid state.profile payload`);
  }

  if (!Array.isArray(state.selectedInterestIds)) {
    throw new Error(`${context}: selectedInterestIds must be an array`);
  }

  if (!Array.isArray(state.selectedContributionIds)) {
    throw new Error(`${context}: selectedContributionIds must be an array`);
  }

  if (
    !isObject(state.progress) ||
    typeof state.progress.totalPoints !== "number"
  ) {
    throw new Error(`${context}: invalid state.progress payload`);
  }

  return payload as OnboardingStateResponse;
}

function getCachedOptions<TItem>(
  cache: Map<string, CacheEntry<TItem>>,
  key: string,
) {
  const cached = cache.get(key);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setCachedOptions<TItem>(
  cache: Map<string, CacheEntry<TItem>>,
  key: string,
  data: TItem[],
) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + OPTIONS_CACHE_TTL_MS,
  });
}

async function userCacheKey(request: Request) {
  const user = await getUser(request);
  return user?.id ? String(user.id) : "anonymous";
}

function getCachedOnboardingState(key: string) {
  const cached = onboardingStateCache.get(key);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    onboardingStateCache.delete(key);
    return null;
  }

  return cached.state;
}

function setCachedOnboardingState(key: string, state: OnboardingState) {
  onboardingStateCache.set(key, {
    state,
    expiresAt: Date.now() + ONBOARDING_STATE_CACHE_TTL_MS,
  });
}

function extractOptionItems(
  payload: OptionContainer,
  key: "countries" | "cities" | "interests" | "contributions",
) {
  const directCandidate =
    payload[key] ?? payload.options ?? payload.items ?? payload.data;

  if (Array.isArray(directCandidate)) return directCandidate;

  if (isObject(directCandidate)) {
    const nestedCandidate =
      directCandidate[key] ?? directCandidate.options ?? directCandidate.items;
    if (Array.isArray(nestedCandidate)) return nestedCandidate;
  }

  return [];
}

function normalizeOptions(
  payload: OptionContainer,
  key: "countries" | "cities" | "interests" | "contributions",
): OnboardingOption[] {
  const items = extractOptionItems(payload, key);

  return items.reduce<OnboardingOption[]>((acc, item) => {
    const id = typeof item?.id === "string" ? item.id : "";
    const nameCandidate =
      typeof item?.name === "string"
        ? item.name
        : typeof item?.label === "string"
          ? item.label
          : typeof item?.title === "string"
            ? item.title
            : "";
    if (!id || !nameCandidate) {
      return acc;
    }
    acc.push({ id, name: nameCandidate });
    return acc;
  }, []);
}

function normalizeContributions(
  payload: OptionContainer,
): OnboardingContributionOption[] {
  const items = extractOptionItems(payload, "contributions");

  return items.reduce<OnboardingContributionOption[]>((acc, item) => {
    const id = typeof item?.id === "string" ? item.id : "";
    const nameCandidate =
      typeof item?.name === "string"
        ? item.name
        : typeof item?.label === "string"
          ? item.label
          : typeof item?.title === "string"
            ? item.title
            : "";

    if (!id || !nameCandidate) {
      return acc;
    }

    acc.push({
      id,
      name: nameCandidate,
      slug: typeof item?.slug === "string" ? item.slug : "",
      iconKey: typeof item?.iconKey === "string" ? item.iconKey : "",
      description:
        typeof item?.description === "string" ? item.description : "",
    });

    return acc;
  }, []);
}

function normalizeInterests(
  payload: OptionContainer,
): OnboardingInterestOption[] {
  const items = extractOptionItems(payload, "interests");

  return items.reduce<OnboardingInterestOption[]>((acc, item) => {
    const id = typeof item?.id === "string" ? item.id : "";
    const nameCandidate =
      typeof item?.name === "string"
        ? item.name
        : typeof item?.label === "string"
          ? item.label
          : typeof item?.title === "string"
            ? item.title
            : "";

    if (!id || !nameCandidate) {
      return acc;
    }

    acc.push({
      id,
      name: nameCandidate,
      slug: typeof item?.slug === "string" ? item.slug : "",
      icon: typeof item?.icon === "string" ? item.icon : "",
    });

    return acc;
  }, []);
}

export function readSavedProfile(
  raw: BackendOnboardingState,
): SavedOnboardingProfile {
  const profile = raw.profile;

  return {
    countryId: toStringOrEmpty(profile?.countryId),
    cityId: toStringOrEmpty(profile?.cityId),
    bio: toStringOrEmpty(profile?.bio),
    avatarUrl: toStringOrEmpty(profile?.avatarUrl),
    avatarKey: toStringOrEmpty(profile?.avatarKey),
  };
}

export function readSavedInterests(
  raw: BackendOnboardingState,
): SavedOnboardingInterests {
  return {
    interestIds: raw.selectedInterestIds,
  };
}

export function readSavedContributions(
  raw: BackendOnboardingState,
): SavedOnboardingContributions {
  return {
    contributionIds: raw.selectedContributionIds,
  };
}

export function normalizeOnboardingState(
  state: BackendOnboardingState,
): OnboardingState {
  const currentStep = toStep(state.user.onboardingStep);

  return {
    completed: state.user.onboardingCompletedAt !== null && currentStep >= 4,
    currentStep,
    raw: state,
  };
}

function updateStateCacheFromResponse(
  key: string,
  payload: unknown,
  context: string,
): OnboardingStateResponse {
  const parsed = parseOnboardingStateResponse(payload, context);
  setCachedOnboardingState(key, normalizeOnboardingState(parsed.state));
  return parsed;
}

export function onboardingPathForStep(step: number) {
  if (step <= 1) return "/onboarding/profile";
  if (step === 2) return "/onboarding/interest";
  if (step === 3) return "/onboarding/contribution";
  return "/onboarding/tier";
}

export function destinationFromOnboardingState(state: OnboardingState) {
  return state.completed
    ? "/dashboard"
    : onboardingPathForStep(state.currentStep);
}

export async function getOnboardingState(
  request: Request,
  options: GetOnboardingStateOptions = {},
) {
  const key = await userCacheKey(request);

  if (!options.forceFresh) {
    const cachedState = getCachedOnboardingState(key);
    if (cachedState) {
      return {
        data: {
          ok: true,
          state: cachedState.raw,
        } satisfies OnboardingStateResponse,
        state: cachedState,
      };
    }
  }

  const result = await apiRequestWithSession<OnboardingStateResponse>(
    request,
    "/onboarding/state",
  );

  const parsed = updateStateCacheFromResponse(
    key,
    result.data,
    "Invalid /onboarding/state response",
  );

  return {
    data: parsed,
    state: normalizeOnboardingState(parsed.state),
    setCookie: result.setCookie,
  };
}

export async function getOnboardingStateWithToken(
  request: Request,
  accessToken: string,
) {
  const payload = await apiRequestWithAccessToken<OnboardingStateResponse>(
    request,
    accessToken,
    "/onboarding/state",
  );

  const parsed = parseOnboardingStateResponse(
    payload,
    "Invalid /onboarding/state response",
  );
  return normalizeOnboardingState(parsed.state);
}

export async function getCountries(
  request: Request,
): Promise<ApiResult<OnboardingOption[]>> {
  const key = await userCacheKey(request);
  const cached = getCachedOptions(countriesCache, key);

  if (cached) {
    return { data: cached };
  }

  const result = await apiRequestWithSession<OptionContainer>(
    request,
    "/onboarding/locations/countries",
  );
  const data = normalizeOptions(result.data, "countries");

  setCachedOptions(countriesCache, key, data);

  return {
    data,
    setCookie: result.setCookie,
  };
}

export async function getCities(request: Request, countryId: string) {
  if (!countryId.trim()) {
    throw new Error("countryId is required");
  }

  const key = `${await userCacheKey(request)}:${countryId}`;
  const cached = getCachedOptions(citiesCache, key);

  if (cached) {
    return { data: cached };
  }

  const result = await apiRequestWithSession<OptionContainer>(
    request,
    `/onboarding/locations/cities?countryId=${encodeURIComponent(countryId)}`,
  );
  const data = normalizeOptions(result.data, "cities");

  setCachedOptions(citiesCache, key, data);

  return {
    data,
    setCookie: result.setCookie,
  };
}

export async function getCitiesByCountryName(
  request: Request,
  countryName: string,
) {
  if (!countryName.trim()) {
    throw new Error("countryName is required");
  }

  const result = await apiRequestWithSession<OptionContainer>(
    request,
    `/onboarding/locations/cities?countryName=${encodeURIComponent(countryName)}`,
  );
  const data = normalizeOptions(result.data, "cities");

  return {
    data,
    setCookie: result.setCookie,
  };
}

export async function getInterests(request: Request) {
  const key = await userCacheKey(request);
  const cached = getCachedOptions(interestsCache, key);

  if (cached) {
    return { data: cached };
  }

  const result = await apiRequestWithSession<OptionContainer>(
    request,
    "/onboarding/interests",
  );
  const data = normalizeInterests(result.data);

  setCachedOptions(interestsCache, key, data);

  return {
    data,
    setCookie: result.setCookie,
  };
}

export async function getContributions(request: Request) {
  const key = await userCacheKey(request);
  const cached = getCachedOptions(contributionsCache, key);

  if (cached) {
    return { data: cached };
  }

  const result = await apiRequestWithSession<OptionContainer>(
    request,
    "/onboarding/contributions",
  );
  const data = normalizeContributions(result.data);

  setCachedOptions(contributionsCache, key, data);

  return {
    data,
    setCookie: result.setCookie,
  };
}

export async function saveStep1Profile(
  request: Request,
  payload: {
    countryId: string;
    cityId: string;
    bio?: string;
    avatarKey?: string;
  },
) {
  const key = await userCacheKey(request);
  const result = await apiRequestWithSession<OnboardingStateResponse>(
    request,
    "/onboarding/step-1-profile",
    {
      method: "PUT",
      body: payload,
    },
  );

  const parsed = updateStateCacheFromResponse(
    key,
    result.data,
    "Invalid /onboarding/step-1-profile response",
  );

  return { ...result, data: parsed };
}

export async function saveStep2Interests(
  request: Request,
  interestIds: string[],
) {
  const key = await userCacheKey(request);
  const result = await apiRequestWithSession<OnboardingStateResponse>(
    request,
    "/onboarding/step-2-interests",
    {
      method: "PUT",
      body: { interestIds },
    },
  );

  const parsed = updateStateCacheFromResponse(
    key,
    result.data,
    "Invalid /onboarding/step-2-interests response",
  );

  return { ...result, data: parsed };
}

export async function saveStep3Contributions(
  request: Request,
  contributionIds: string[],
) {
  const key = await userCacheKey(request);
  const result = await apiRequestWithSession<OnboardingStateResponse>(
    request,
    "/onboarding/step-3-contributions",
    {
      method: "PUT",
      body: { contributionIds },
    },
  );

  const parsed = updateStateCacheFromResponse(
    key,
    result.data,
    "Invalid /onboarding/step-3-contributions response",
  );

  return { ...result, data: parsed };
}

export async function saveStep4Complete(request: Request) {
  const key = await userCacheKey(request);
  const result = await apiRequestWithSession<OnboardingStateResponse>(
    request,
    "/onboarding/step-4-complete",
    {
      method: "PUT",
    },
  );

  const parsed = updateStateCacheFromResponse(
    key,
    result.data,
    "Invalid /onboarding/step-4-complete response",
  );

  return { ...result, data: parsed };
}
