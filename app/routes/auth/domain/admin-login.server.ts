import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import {
  AuthApiError,
  getAuthFieldError,
  loginUser,
} from "~/services/auth/api.server";
import { createUserSession, getUser } from "~/lib/server/session.server";
import { getAuthSession } from "~/services/auth/session.server";
import { isAdminRole } from "~/lib/server/route-guards.server";
import { sanitizeRedirectPath } from "~/lib/redirects";

export type AdminLoginFieldErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export type AdminLoginActionData = {
  errors?: AdminLoginFieldErrors;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) {
    try {
      const { session } = await getAuthSession(request);
      const isActiveAdmin =
        session.authFlow.accessState === "ACTIVE" &&
        isAdminRole(session.user.role as string);

      if (isActiveAdmin) return redirect("/tk-admin/dashboard");
    } catch {
      // session expired or unavailable; fall through to login
    }
  }
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  const errors: AdminLoginFieldErrors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const auth = await loginUser(email, password, request);

    // Verify admin role
    if (!isAdminRole(auth.user.role as string)) {
      return {
        errors: {
          form: "Access denied. This account does not have admin privileges.",
        },
      };
    }

    return createUserSession(auth, redirectTo || "/tk-admin/dashboard");
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 400) {
        return {
          errors: {
            email: getAuthFieldError(error.details, "email"),
            password: getAuthFieldError(error.details, "password"),
            form: error.message,
          },
        };
      }
      if (error.status === 401) {
        return { errors: { form: "Invalid email or password" } };
      }
      return { errors: { form: error.message } };
    }
    return {
      errors: {
        form:
          error instanceof Error
            ? `Login failed: ${error.message}`
            : "Login failed. Please try again.",
      },
    };
  }
}
