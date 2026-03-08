import { redirect } from "react-router";
import {
  AuthSessionExpiredError,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { destroySession, getSession } from "~/lib/server/session.server";

type OnboardingActionErrorShape<TErrors extends { form?: string }> = {
  errors: TErrors;
};

type HandleOnboardingActionErrorArgs = {
  error: unknown;
  request: Request;
  fallbackMessage: string;
  mapProtectedError?: (error: ProtectedApiError) => string | null | undefined;
};

export async function handleOnboardingActionError<
  TErrors extends { form?: string } = { form: string },
>({
  error,
  request,
  fallbackMessage,
  mapProtectedError,
}: HandleOnboardingActionErrorArgs): Promise<
  Response | OnboardingActionErrorShape<TErrors>
> {
  if (error instanceof AuthSessionExpiredError) {
    const session = await getSession(request);
    return redirect("/login", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  if (error instanceof ProtectedApiError) {
    const mappedMessage = mapProtectedError?.(error);
    return { errors: { form: mappedMessage || error.message } as TErrors };
  }

  return { errors: { form: fallbackMessage } as TErrors };
}
