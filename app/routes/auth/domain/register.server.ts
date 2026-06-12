import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { RegisterErrors } from "./auth.types";
import {
  AuthApiError,
  formatAuthMessage,
  getAuthErrorCode,
  getAuthFieldError,
  loginWithGoogle,
  registerUser,
} from "~/services/auth/api.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { sanitizeRedirectPath } from "~/lib/redirects";
import { getPasswordValidationError } from "./password-validation";
import { createUserSession } from "~/lib/server/session.server";
import { destinationFromAuthFlow } from "./auth-flow.server";

const USER_ALREADY_EXISTS_CODE = "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";

function getRegisterFormError(
  passwordError?: string,
  hasFieldError?: boolean,
  generalError?: string,
) {
  if (passwordError) return passwordError;
  if (!hasFieldError) return generalError;
  return undefined;
}

function withRegisterFormError(errors: RegisterErrors): RegisterErrors {
  if (errors.password) {
    return { ...errors, form: errors.password };
  }

  return errors;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  const firstName = String(formData.get("firstName") || "");
  const lastName = String(formData.get("lastName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const phoneCountry = String(formData.get("phone.country") || "").trim();
  const phoneNationalNumber = String(
    formData.get("phone.nationalNumber") || "",
  ).trim();
  const gender = String(formData.get("gender") || "");
  const occupation = String(formData.get("occupation") || "");
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  if (intent === "google") {
    const idToken = String(formData.get("idToken") || "").trim();
    const rememberMe = formData.get("rememberMe") !== "false";
    if (!idToken) {
      return { errors: { form: "Google sign-in was not completed." } };
    }

    try {
      const auth = await loginWithGoogle(idToken, request);
      const destination = auth.authFlow
        ? destinationFromAuthFlow(auth.authFlow)
        : redirectTo;
      return createUserSession(auth, destination, { rememberMe });
    } catch (error) {
      if (error instanceof AuthApiError) {
        return { errors: { form: formatAuthMessage(error.message) } };
      }
      return {
        errors: {
          form:
            error instanceof Error
              ? formatAuthMessage(`Google sign-in failed: ${error.message}`)
              : "Google sign-in failed. Please try again.",
        },
      };
    }
  }

  const errors: RegisterErrors = {};

  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!email) errors.email = "Email is required";
  else if (!email.includes("@")) errors.email = "Must be a valid email";
  if (!phoneCountry || !phoneNationalNumber) {
    errors.phone = "Phone number is required";
  }
  if (!gender) errors.gender = "Gender is required";
  if (!occupation) errors.occupation = "Occupation is required";
  const passwordError = getPasswordValidationError(password);
  if (passwordError) errors.password = passwordError;

  if (Object.keys(errors).length > 0) {
    return { errors: withRegisterFormError(errors) };
  }

  try {
    const registerResponse = await registerUser(
      {
        email,
        password,
        firstName,
        lastName,
        phone: {
          country: phoneCountry,
          nationalNumber: phoneNationalNumber,
        },
        gender,
        occupation,
      },
      request,
    );

    return redirect(
      `/verify-otp?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}&otpSent=${registerResponse.otpSent ? "1" : "0"}&message=${encodeURIComponent(registerResponse.message || "")}&from=register`,
    );
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (getAuthErrorCode(error.details) === USER_ALREADY_EXISTS_CODE) {
        const duplicateEmailMessage =
          "An account with this email already exists. Please sign in.";

        return {
          errors: {
            email: duplicateEmailMessage,
            form: duplicateEmailMessage,
          },
        };
      }

      if (error.status === 400) {
        const firstNameError = formatAuthMessage(
          getAuthFieldError(error.details, "firstName"),
        );
        const lastNameError = formatAuthMessage(
          getAuthFieldError(error.details, "lastName"),
        );
        const emailError = formatAuthMessage(
          getAuthFieldError(error.details, "email"),
        );
        const phoneError = formatAuthMessage(
          getAuthFieldError(error.details, "phone") ||
            getAuthFieldError(error.details, "phone.nationalNumber") ||
            getAuthFieldError(error.details, "phone.country") ||
            getAuthFieldError(error.details, "nationalNumber") ||
            getAuthFieldError(error.details, "phoneNumber"),
        );
        const genderError = formatAuthMessage(
          getAuthFieldError(error.details, "gender"),
        );
        const occupationError = formatAuthMessage(
          getAuthFieldError(error.details, "occupation"),
        );
        const passwordError = formatAuthMessage(
          getAuthFieldError(error.details, "password"),
        );
        const hasFieldError = !!(
          firstNameError ||
          lastNameError ||
          emailError ||
          phoneError ||
          genderError ||
          occupationError ||
          passwordError
        );

        return {
          errors: withRegisterFormError({
            firstName: firstNameError,
            lastName: lastNameError,
            email: emailError,
            phone: phoneError,
            gender: genderError,
            occupation: occupationError,
            password: passwordError,
            form: getRegisterFormError(
              passwordError,
              hasFieldError,
              formatAuthMessage(error.message),
            ),
          }),
        };
      }

      return { errors: { form: formatAuthMessage(error.message) } };
    }

    return {
      errors: {
        form:
          error instanceof Error
            ? formatAuthMessage(`Registration failed: ${error.message}`)
            : "Registration failed. Please try again.",
      },
    };
  }
}

export function meta() {
  return [{ title: "Register | True Khmer" }];
}
