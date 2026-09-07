import { User, Mail } from "lucide-react";

interface OAuthScopeListProps {
  user: {
    name: string;
    email: string;
  };
}

export function OAuthScopeList({ user }: OAuthScopeListProps) {
  return (
    <div className="space-y-3.5 pt-1 short:space-y-3 short:pt-0">
      <div className="flex items-start gap-3">
        <User className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
        <div>
          <div className="text-[14px] leading-tight font-semibold text-slate-900">
            {user.name}
          </div>
          <div className="text-[12px] font-normal text-slate-500">
            Full name and profile photo
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
        <div>
          <div className="text-[14px] leading-tight font-semibold text-slate-900">
            {user.email}
          </div>
          <div className="text-[12px] font-normal text-slate-500">
            Verified email address
          </div>
        </div>
      </div>
    </div>
  );
}
