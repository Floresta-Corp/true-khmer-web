import { useMemo } from "react";
import {
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "react-router";
import { ShieldCheck } from "lucide-react";
import { sanitizeRedirectPath } from "~/lib/redirects";
import type { Oauth2faLoader } from "../../services/oauth-2fa.loader";
import type { Oauth2faActionData } from "../../services/oauth-2fa.action";
import { OAuthCardShell } from "../oauth-card-shell";
import { OAuthTwoFactorForm } from "../oauth-two-factor-form";

export default function OAuthTwoFactorPage() {
  const { methods, expiresAt } = useLoaderData<typeof Oauth2faLoader>();
  const actionData = useActionData<Oauth2faActionData>();
  const [searchParams] = useSearchParams();
  // The authorization request this challenge interrupted. It is the only way
  // back: dropping it would strand the popup off the OAuth request it was
  // opened with, losing the clientId and origin the whole flow depends on.
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const expiresAtLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(expiresAt)),
    [expiresAt],
  );

  return (
    <OAuthCardShell>
      <div className="space-y-3 short:space-y-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
          <ShieldCheck className="size-5 text-blue-600" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 short:text-lg">
            Verify your sign in
          </h1>
          <p className="text-sm leading-relaxed text-slate-500">
            Enter a 6-digit code to finish signing in. This challenge expires at{" "}
            {expiresAtLabel}.
          </p>
        </div>
      </div>

      <OAuthTwoFactorForm
        methods={methods}
        redirectTo={redirectTo}
        actionData={actionData}
      />

      <p className="text-center text-[13px] leading-relaxed text-slate-500">
        Need another account?{" "}
        <Link
          to={redirectTo}
          className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          Back to sign in
        </Link>
      </p>
    </OAuthCardShell>
  );
}
