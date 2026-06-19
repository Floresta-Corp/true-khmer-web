import { z } from "zod";
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

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required"),
  redirectTo: z.string().optional(),
});

export async function superAdminAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parseResult = adminLoginSchema.safeParse(Object.fromEntries(formData));

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.flatten().fieldErrors;
    return {
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      } as AdminLoginFieldErrors,
    };
  }

  const { email, password, redirectTo } = parseResult.data;
  const sanitizedRedirectTo = sanitizeRedirectPath(redirectTo, "/tk-admin");

  try {
    const auth = await loginAdmin(request, email, password);
    const response = await createAdminSession(
      request,
      auth,
      sanitizedRedirectTo || "/tk-admin",
    );
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
