import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
  sendLoginEmailOtp,
  verifyLoginEmailOtp,
  verifyLoginTotp,
} from "~/api/two-factor/two-factor.server";
import {
  createUserSession,
  destroyPendingTwoFactorLogin,
  getPendingTwoFactorLogin,
} from "~/lib/server/session.server";
import { sanitizeRedirectPath } from "~/lib/redirects";
import { destinationFromAuthFlow } from "./auth-flow.server";

export type LoginTwoFactorActionData = {
  errors?: {
    code?: string;
    form?: string;
  };
  message?: string;
};

function supportsMethod(methods: string[], method: "totp" | "email") {
  if (method === "email")
    return methods.includes("email") || methods.includes("otp");
  return methods.includes("totp");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const pendingLogin = await getPendingTwoFactorLogin(request);
  if (!pendingLogin) {
    throw redirect("/login");
  }

  return {
    methods: pendingLogin.methods,
    expiresAt: pendingLogin.expiresAt,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const pendingLogin = await getPendingTwoFactorLogin(request);
  if (!pendingLogin) {
    throw redirect("/login");
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "verify");
  const method = String(formData.get("method") || "totp") as "totp" | "email";
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  if (!supportsMethod(pendingLogin.methods, method)) {
    return { errors: { form: "This verification method is not available." } };
  }

  if (intent === "send-email") {
    try {
      await sendLoginEmailOtp(request, {
        twoFactorToken: pendingLogin.twoFactorToken,
      });
      return { message: "A new verification code was sent to your email." };
    } catch (error) {
      return {
        errors: {
          form:
            error instanceof ProtectedApiError
              ? error.message
              : "Unable to send email code. Please try again.",
        },
      };
    }
  }

  const code = String(formData.get("code") || "").trim();
  const trustDevice = formData.get("trustDevice") === "true";
  if (!/^\d{6}$/.test(code)) {
    return { errors: { code: "Enter the 6-digit verification code." } };
  }

  try {
    const result =
      method === "email"
        ? await verifyLoginEmailOtp(request, {
            twoFactorToken: pendingLogin.twoFactorToken,
            code,
            trustDevice,
          })
        : await verifyLoginTotp(request, {
            twoFactorToken: pendingLogin.twoFactorToken,
            code,
            trustDevice,
          });
    const destination = result.data.authFlow
      ? destinationFromAuthFlow(result.data.authFlow, redirectTo)
      : redirectTo;
    const clearPendingCookie = await destroyPendingTwoFactorLogin(request);

    return createUserSession(request, result.data, destination, {
      rememberMe: pendingLogin.rememberMe,
      extraSetCookie: [clearPendingCookie, result.setCookie].flatMap(
        (cookie) => (Array.isArray(cookie) ? cookie : cookie ? [cookie] : []),
      ),
    });
  } catch (error) {
    return {
      errors: {
        form:
          error instanceof ProtectedApiError
            ? error.message
            : "Verification failed. Please try again.",
      },
    };
  }
}
