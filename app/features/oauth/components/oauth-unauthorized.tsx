import { OAuthCardShell } from "./oauth-card-shell";
import { OAuthLoginForm } from "./oauth-login-form";

interface OAuthUnauthorizedProps {
  clientName: string | null;
  clientLogo: string | null;
}

export function OAuthUnauthorized({
  clientName,
  clientLogo,
}: OAuthUnauthorizedProps) {
  return (
    <OAuthCardShell>
      {clientLogo && (
        <img
          src={clientLogo}
          alt={`${clientName} logo`}
          className="h-8 short:h-7"
        />
      )}

      <div className="space-y-1">
        <h1 className="text-lg font-bold text-slate-900">
          Sign in to continue
        </h1>
        <p className="text-[13px] leading-relaxed text-slate-500">
          {clientName ? (
            <>
              Sign in to your TrueKhmer account to connect with{" "}
              <span className="font-semibold text-slate-700">{clientName}</span>
              .
            </>
          ) : (
            "Sign in to your TrueKhmer account to continue."
          )}
        </p>
      </div>

      <OAuthLoginForm />
    </OAuthCardShell>
  );
}
