import type { ActionFunctionArgs } from "react-router";
import { sanitizeRedirectPath } from "~/lib/redirects";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { loginAdmin } from "~/lib/server/auth/admin/api-admin.server";
import { createAdminSession } from "~/lib/server/session.server";

export type AdminLoginFieldErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export type AdminLoginActionData = {
  errors?: AdminLoginFieldErrors;
};

export async function superAdminAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
    "/tk-admin",
  );

  const errors: AdminLoginFieldErrors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const { data: auth } = await loginAdmin(request, email, password);
    const response = createAdminSession(auth, redirectTo || "/tk-admin");
    return response;
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      if (error.status === 401) {
        return { errors: { form: "Invalid email or password" } };
      }
      return {
        errors: { form: "Unable to sign in right now. Please try again." },
      };
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
