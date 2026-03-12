import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { RegisterErrors } from "./auth.types";
import {
  AuthApiError,
  getAuthFieldError,
  registerUser,
} from "~/services/auth.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { sanitizeRedirectPath } from "~/lib/redirects";

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

  if (Object.keys(errors).length > 0) return { errors };

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
      if (error.status === 400) {
        return {
          errors: {
            firstName: getAuthFieldError(error.details, "firstName"),
            lastName: getAuthFieldError(error.details, "lastName"),
            email: getAuthFieldError(error.details, "email"),
            gender: getAuthFieldError(error.details, "gender"),
            occupation: getAuthFieldError(error.details, "occupation"),
            password: getAuthFieldError(error.details, "password"),
            form: error.message,
          },
        };
      }

      if (error.status === 409) {
        return {
          errors: { email: "An account with this email already exists" },
        };
      }

      return { errors: { form: error.message } };
    }

    return {
      errors: {
        form:
          error instanceof Error
            ? `Registration failed: ${error.message}`
            : "Registration failed. Please try again.",
      },
    };
  }
}

export function meta() {
  return [{ title: "Register | True Khmer" }];
}
