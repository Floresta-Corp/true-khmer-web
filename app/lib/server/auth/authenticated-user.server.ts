import type { OnboardingState } from "~/services/onboarding.server";
import type { AuthenticatedUser, Profile } from "../types";

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function profileFromSessionUser(
  userRecord: Record<string, unknown>,
  displayName: string,
): Profile {
  const existingProfile: Record<string, unknown> = isObject(userRecord.profile)
    ? userRecord.profile
    : {};

  return {
    id: readString(existingProfile.id) || undefined,
    displayName: readString(existingProfile.displayName) || displayName,
    avatarKey:
      readString(existingProfile.avatarKey) || readString(userRecord.avatarKey),
    avatarUrl:
      readString(existingProfile.avatarUrl) ||
      readString(userRecord.avatarUrl) ||
      readString(userRecord.avatar),
  };
}

function profileFromOnboardingState(
  userRecord: Record<string, unknown>,
  state: OnboardingState,
  displayName: string,
): Profile {
  const rawProfile: Record<string, unknown> = isObject(state.raw.profile)
    ? state.raw.profile
    : {};
  const existingProfile: Record<string, unknown> = isObject(userRecord.profile)
    ? userRecord.profile
    : {};

  return {
    id: readString(existingProfile.id) || undefined,
    displayName: readString(existingProfile.displayName) || displayName,
    avatarKey:
      readString(rawProfile.avatarKey) ||
      readString(existingProfile.avatarKey) ||
      readString(userRecord.avatarKey),
    avatarUrl:
      readString(rawProfile.avatarUrl) ||
      readString(existingProfile.avatarUrl) ||
      readString(userRecord.avatarUrl) ||
      readString(userRecord.avatar),
  };
}

export function authenticatedUserFromSessionUser(
  user: unknown,
): AuthenticatedUser {
  const userRecord = isObject(user) ? user : {};
  const email = readString(userRecord.email);
  const name = readString(userRecord.name) || email.split("@")[0] || "User";

  return {
    id: readString(userRecord.id),
    email,
    emailVerified: readBoolean(userRecord.emailVerified),
    name,
    firstName: readString(userRecord.firstName) || undefined,
    lastName: readString(userRecord.lastName) || undefined,
    gender: readString(userRecord.gender) || undefined,
    occupation: readString(userRecord.occupation) || null,
    phoneNumber: readString(userRecord.phoneNumber) || null,
    signupCompletedAt:
      readString(userRecord.signupCompletedAt) ||
      (userRecord.signupCompletedAt instanceof Date
        ? userRecord.signupCompletedAt
        : null),
    onboardingStep:
      typeof userRecord.onboardingStep === "number"
        ? userRecord.onboardingStep
        : undefined,
    onboardingCompletedAt:
      readString(userRecord.onboardingCompletedAt) ||
      (userRecord.onboardingCompletedAt instanceof Date
        ? userRecord.onboardingCompletedAt
        : null),
    avatar: readString(userRecord.avatar) || undefined,
    profile: profileFromSessionUser(userRecord, name),
  };
}

export function authenticatedUserFromOnboardingState(
  user: unknown,
  state: OnboardingState,
): AuthenticatedUser {
  const userRecord = isObject(user) ? user : {};
  const email = readString(userRecord.email) || state.raw.user.email;
  const name = readString(userRecord.name) || email.split("@")[0] || "User";

  return {
    id: readString(userRecord.id) || state.raw.user.id,
    email,
    emailVerified: readBoolean(userRecord.emailVerified),
    name,
    profile: profileFromOnboardingState(userRecord, state, name),
  };
}
