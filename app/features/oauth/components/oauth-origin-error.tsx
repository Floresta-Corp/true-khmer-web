import { OAuthHeader } from "./oauth-header";

export function OAuthOriginError() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100/70 p-4 font-sans text-slate-900">
      <div className="w-full max-w-105 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md">
        <OAuthHeader />

        <main className="space-y-2 p-6 text-center">
          <h1 className="text-lg font-bold text-slate-900">
            Unable to continue
          </h1>
          <p className="text-[13px] leading-relaxed text-slate-500">
            This sign-in window was not opened from a trusted application.
            Please close this window and try again.
          </p>
        </main>
      </div>
    </div>
  );
}
