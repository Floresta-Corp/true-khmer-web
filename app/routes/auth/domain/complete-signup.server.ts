import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import {
  AuthApiError,
  completeSignUp,
  formatAuthMessage,
  getAuthFieldError,
} from "~/services/auth/api.server";
import { getAccessToken, updateUserSession } from "~/lib/server/session.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireSignupCompletion } from "~/lib/server/route-guards.server";
import { destinationFromAuthFlow } from "./auth-flow.server";
import type { CompleteSignUpErrors } from "./auth.types";
import { invalidateAuthSessionCacheForRequest } from "~/services/auth/session.server";
import { sanitizePhoneNumber } from "~/lib/phone";

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = await requireSignupCompletion(request);
  return withAuthData(auth, { user: auth.user });
}

function withCompleteSignUpFormError(
  errors: CompleteSignUpErrors,
): CompleteSignUpErrors {
  if (errors.memberAgreementAccepted) {
    return { ...errors, form: errors.memberAgreementAccepted };
  }

  return errors;
}

export async function action({ request }: ActionFunctionArgs) {
  const auth = await requireSignupCompletion(request);
  const respond = <T>(payload: T) => withAuthData(auth, payload);
  const accessToken = await getAccessToken(request);
  if (!accessToken) {
    throw redirect("/login?redirectTo=/complete-signup");
  }

  const formData = await request.formData();
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const phoneCountry = String(formData.get("phone.country") || "").trim();
  const phoneNationalNumber = String(
    formData.get("phone.nationalNumber") || "",
  ).trim();
  const sanitizedPhoneNationalNumber = sanitizePhoneNumber(phoneNationalNumber);
  const gender = String(formData.get("gender") || "").trim();
  const occupation = String(formData.get("occupation") || "").trim();
  const memberAgreementAccepted =
    formData.get("memberAgreementAccepted") === "true";

  const errors: CompleteSignUpErrors = {};
  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!phoneCountry || !sanitizedPhoneNationalNumber) {
    errors.phone = "Contact number is required";
  }
  if (!gender) errors.gender = "Gender is required";
  if (!occupation) errors.occupation = "Occupation is required";
  if (!memberAgreementAccepted) {
    errors.memberAgreementAccepted = "Member agreement must be accepted";
  }

  if (Object.keys(errors).length > 0) {
    return respond({ errors: withCompleteSignUpFormError(errors) });
  }

  try {
    const response = await completeSignUp(
      {
        firstName,
        lastName,
        gender,
        occupation,
        phone: {
          country: phoneCountry,
          nationalNumber: sanitizedPhoneNationalNumber,
        },
        memberAgreementAccepted: true,
      },
      accessToken,
      request,
    );

    await invalidateAuthSessionCacheForRequest(request);

    return updateUserSession(
      request,
      response.user,
      destinationFromAuthFlow(response.authFlow, "/onboarding/profile"),
    );
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 400) {
        return respond({
          errors: withCompleteSignUpFormError({
            firstName: formatAuthMessage(
              getAuthFieldError(error.details, "firstName"),
            ),
            lastName: formatAuthMessage(
              getAuthFieldError(error.details, "lastName"),
            ),
            phone: formatAuthMessage(
              getAuthFieldError(error.details, "phone") ||
                getAuthFieldError(error.details, "phone.nationalNumber") ||
                getAuthFieldError(error.details, "phone.country") ||
                getAuthFieldError(error.details, "nationalNumber") ||
                getAuthFieldError(error.details, "phoneNumber"),
            ),
            gender: formatAuthMessage(
              getAuthFieldError(error.details, "gender"),
            ),
            occupation: formatAuthMessage(
              getAuthFieldError(error.details, "occupation"),
            ),
            memberAgreementAccepted: formatAuthMessage(
              getAuthFieldError(error.details, "memberAgreementAccepted"),
            ),
            form: formatAuthMessage(error.message),
          }),
        });
      }

      return respond({ errors: { form: formatAuthMessage(error.message) } });
    }

    return respond({
      errors: {
        form:
          error instanceof Error
            ? formatAuthMessage(`Unable to complete profile: ${error.message}`)
            : "Unable to complete profile. Please try again.",
      },
    });
  }
}

export function meta() {
  return [{ title: "Complete Profile | True Khmer" }];
}
