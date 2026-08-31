interface OAuthClientBrandingProps {
  clientName: string;
  clientLogo: string | null;
}

export function OAuthClientBranding({
  clientName,
  clientLogo,
}: OAuthClientBrandingProps) {
  return (
    <>
      {clientLogo ? (
        <img
          src={clientLogo}
          alt={`${clientName} logo`}
          className="h-8 short:h-7"
        />
      ) : null}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 short:text-xl">
          Sign in to {clientName}
        </h1>
      </div>
      <div className="border-t border-slate-100 pt-3 short:pt-2">
        <p className="text-[14px] leading-snug font-bold text-slate-900">
          TrueKhmer will allow {clientName} to access this info about you
        </p>
      </div>
    </>
  );
}
