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
  registerUser,
} from "~/services/auth.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { sanitizeRedirectPath } from "~/lib/redirects";

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
  const firstName = String(formData.get("firstName") || "");
  const lastName = String(formData.get("lastName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const gender = String(formData.get("gender") || "");
  const occupation = String(formData.get("occupation") || "");
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  const errors: RegisterErrors = {};

  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!email) errors.email = "Email is required";
  else if (!email.includes("@")) errors.email = "Must be a valid email";
  if (!gender) errors.gender = "Gender is required";
  if (!occupation) errors.occupation = "Occupation is required";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return { errors: withRegisterFormError(errors) };
  }

  try {
    const registerResponse = await registerUser(
      { email, password, firstName, lastName, gender, occupation },
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
          genderError ||
          occupationError ||
          passwordError
        );

        return {
          errors: withRegisterFormError({
            firstName: firstNameError,
            lastName: lastNameError,
            email: emailError,
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
