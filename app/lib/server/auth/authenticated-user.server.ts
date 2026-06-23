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

function readPhoneInput(value: unknown) {
  if (!isObject(value)) return null;

  const country = readString(value.country);
  const nationalNumber = readString(value.nationalNumber);
  if (!country || !nationalNumber) return null;

  return { country, nationalNumber };
}

function readUserRole(userRecord: Record<string, unknown>) {
  return readString(userRecord.role) || readString(userRecord.userRole);
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
      readString(existingProfile.avatarKey) ||
      readString(userRecord.avatarKey) ||
      null,
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
      readString(userRecord.avatarKey) ||
      null,
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
    role: readUserRole(userRecord) || undefined,
    name,
    firstName: readString(userRecord.firstName) || undefined,
    lastName: readString(userRecord.lastName) || undefined,
    gender: readString(userRecord.gender) || undefined,
    occupation: readString(userRecord.occupation) || null,
    phone: readPhoneInput(userRecord.phone),
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
    image: readString(userRecord.image) || null,
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
    role: readUserRole(userRecord) || state.raw.user.role || undefined,
    name,
    profile: profileFromOnboardingState(userRecord, state, name),
  };
}
