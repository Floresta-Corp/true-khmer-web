import { OAuthHeader } from "./oauth-header";
import { OAuthLoginForm } from "./oauth-login-form";

interface OAuthUnauthorizedProps {
  clientName: string;
}

export function OAuthUnauthorized({ clientName }: OAuthUnauthorizedProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100/70 p-4 font-sans text-slate-900">
      <div className="w-full max-w-105 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md">
        <OAuthHeader />

        <main className="space-y-5 p-6">
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-slate-900">
              Sign in to continue
            </h1>
            <p className="text-[13px] leading-relaxed text-slate-500">
              Sign in to your TrueKhmer account to connect with {clientName}.
            </p>
          </div>

          <OAuthLoginForm />
        </main>
      </div>
    </div>
  );
}
