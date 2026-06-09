export type AccessState = "SIGNUP_REQUIRED" | "ONBOARDING_REQUIRED" | "ACTIVE";
export type RequiredAction = "COMPLETE_SIGNUP" | "COMPLETE_ONBOARDING" | null;
export type AuthNextStep = "COMPLETE_SIGNUP" | "ONBOARDING" | "APP";

export type AuthFlow = {
  isNewUser: boolean;
  requiresSignupCompletion: boolean;
  requiresOnboarding: boolean;
  nextStep: AuthNextStep;
  accessState?: AccessState;
  requiredAction?: RequiredAction;
};

export type NormalizedAuthFlow = AuthFlow & {
  accessState: AccessState;
  requiredAction: RequiredAction;
};

type AccessRoutes = {
  signup: string;
  onboarding: string;
  active: string;
};

const DEFAULT_ACCESS_ROUTES = {
  signup: "/complete-signup",
  onboarding: "/onboarding/profile",
  active: "/home",
} satisfies AccessRoutes;

export function isAccessState(value: unknown): value is AccessState {
  return (
    value === "SIGNUP_REQUIRED" ||
    value === "ONBOARDING_REQUIRED" ||
    value === "ACTIVE"
  );
}

export function isRequiredAction(value: unknown): value is RequiredAction {
  return (
    value === "COMPLETE_SIGNUP" ||
    value === "COMPLETE_ONBOARDING" ||
    value === null
  );
}

export function isAuthNextStep(value: unknown): value is AuthNextStep {
  return value === "COMPLETE_SIGNUP" || value === "ONBOARDING" || value === "APP";
}

export function accessStateFromAuthFlow(authFlow: AuthFlow): AccessState {
  if (authFlow.accessState) return authFlow.accessState;
  if (authFlow.requiresSignupCompletion) return "SIGNUP_REQUIRED";
  if (authFlow.requiresOnboarding) return "ONBOARDING_REQUIRED";
  return "ACTIVE";
}

export function requiredActionFromAccessState(
  accessState: AccessState,
): RequiredAction {
  if (accessState === "SIGNUP_REQUIRED") return "COMPLETE_SIGNUP";
  if (accessState === "ONBOARDING_REQUIRED") return "COMPLETE_ONBOARDING";
  return null;
}

export function normalizeAuthFlow(authFlow: AuthFlow): NormalizedAuthFlow {
  const accessState = accessStateFromAuthFlow(authFlow);
  return {
    ...authFlow,
    accessState,
    requiredAction:
      authFlow.requiredAction !== undefined
        ? authFlow.requiredAction
        : requiredActionFromAccessState(accessState),
  };
}

export function routeForAccessState(
  accessState: AccessState,
  routes: Partial<AccessRoutes> = {},
) {
  const resolvedRoutes = { ...DEFAULT_ACCESS_ROUTES, ...routes };
  if (accessState === "SIGNUP_REQUIRED") return resolvedRoutes.signup;
  if (accessState === "ONBOARDING_REQUIRED") return resolvedRoutes.onboarding;
  return resolvedRoutes.active;
}

export function routeForAuthFlow(authFlow: AuthFlow | undefined, fallback = "/") {
  if (!authFlow) return fallback;

  if (authFlow.accessState) {
    return routeForAccessState(authFlow.accessState, { active: fallback });
  }

  if (authFlow.nextStep === "COMPLETE_SIGNUP") return DEFAULT_ACCESS_ROUTES.signup;
  if (authFlow.nextStep === "ONBOARDING") return DEFAULT_ACCESS_ROUTES.onboarding;
  return fallback;
}

export function accessErrorCodeFromPayload(payload: Record<string, unknown>) {
  if (typeof payload.code === "string") return payload.code;
  if (
    payload.requiredAction === "COMPLETE_SIGNUP" ||
    payload.accessState === "SIGNUP_REQUIRED"
  ) {
    return "SIGNUP_COMPLETION_REQUIRED";
  }
  if (
    payload.requiredAction === "COMPLETE_ONBOARDING" ||
    payload.accessState === "ONBOARDING_REQUIRED"
  ) {
    return "ONBOARDING_REQUIRED";
  }

  return undefined;
}
