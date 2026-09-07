import { OAuthCardShell } from "./oauth-card-shell";

export function OAuthOriginError() {
  return (
    <OAuthCardShell mainClassName="space-y-2 text-center">
      <h1 className="text-lg font-bold text-slate-900">Unable to continue</h1>
      <p className="text-[13px] leading-relaxed text-slate-500">
        This sign-in window was not opened from a trusted application. Please
        close this window and try again.
      </p>
    </OAuthCardShell>
  );
}
