interface OAuthClientBrandingProps {
  clientName: string;
}

export function OAuthClientBranding({ clientName }: OAuthClientBrandingProps) {
  return (
    <>
      <img src="/plumpiLogo.png" alt="Plumpi Logo" className="h-8" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to {clientName}
        </h1>
      </div>
      <div className="border-t border-slate-100 pt-3">
        <p className="text-[14px] leading-snug font-bold text-slate-900">
          TrueKhmer will allow {clientName} to access this info about you
        </p>
      </div>
    </>
  );
}
