interface OAuthTermsNoticeProps {
  clientName: string | null;
}

export function OAuthTermsNotice({ clientName }: OAuthTermsNoticeProps) {
  return (
    <div className="space-y-2 text-[12px] leading-relaxed text-slate-600">
      <p>
        Review {clientName ? `${clientName}'s` : "the app's"}{" "}
        <a href="#" className="font-bold text-blue-600 hover:underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="#" className="font-bold text-blue-600 hover:underline">
          Terms of Service
        </a>{" "}
        to understand how your data will be used.
      </p>
      <p>
        To make changes at any time, go to your{" "}
        <a href="#" className="font-bold text-blue-600 hover:underline">
          TrueKhmer ID account
        </a>
        .
      </p>
    </div>
  );
}
