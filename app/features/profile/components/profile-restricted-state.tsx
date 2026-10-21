import { Lock, Users } from "lucide-react";
import { Link, useLocation } from "react-router";
import BackToButton from "~/components/back-to-button";
import { Button } from "~/components/ui/button";
import type { ProfileRestrictedCode } from "~/features/profile/types";

interface ProfileRestrictedStateProps {
  code: ProfileRestrictedCode;
}

/**
 * Shown instead of the profile when the member's "Your Profile" visibility
 * doesn't include the current viewer.
 */
export function ProfileRestrictedState({ code }: ProfileRestrictedStateProps) {
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;
  const membersOnly = code === "PROFILE_MEMBERS_ONLY";
  const Icon = membersOnly ? Users : Lock;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center text-gray-400">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
        {membersOnly
          ? "This profile is for members only"
          : "This profile is private"}
      </p>
      <p className="mt-1 max-w-sm text-sm">
        {membersOnly
          ? "Sign in to your True Khmer account to see this member's profile."
          : "This member has chosen to keep their profile to themselves."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <BackToButton to={membersOnly ? "/" : -1} />
        {membersOnly ? (
          <Button
            asChild
            className="h-10 rounded-lg bg-[#2F6FE4] px-6 text-sm font-semibold text-white hover:bg-[#1F62DF] [a]:hover:bg-[#1F62DF]"
          >
            <Link to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}>
              Sign in
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

interface ProfileSectionHiddenProps {
  isSignedIn: boolean;
  className?: string;
}

/**
 * Shown in place of a section the member's visibility settings hide from the
 * current viewer. The API only reports that the section is hidden, so an
 * anonymous viewer is invited to sign in (it may be members-only), while a
 * signed-in member is told it's private.
 */
export function ProfileSectionHidden({
  isSignedIn,
  className,
}: ProfileSectionHiddenProps) {
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center text-gray-500 ${className ?? ""}`}
    >
      <Lock className="mb-3 h-5 w-5" aria-hidden />
      <p className="text-sm font-medium">
        {isSignedIn
          ? "This member keeps their contributions private"
          : "This member's contributions are hidden"}
      </p>
      {!isSignedIn ? (
        <Link
          to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="mt-2 text-sm font-semibold text-[#0050d4] hover:text-[#0045b8]"
        >
          Sign in to see more
        </Link>
      ) : null}
    </div>
  );
}
