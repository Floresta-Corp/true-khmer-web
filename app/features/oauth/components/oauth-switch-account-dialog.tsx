import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { OAUTH_LOGOUT_INTENT, type OAuthLoginActionData } from "../types";

interface OAuthSwitchAccountDialogProps {
  userName: string;
  // The sign-out went through and `__session` is destroyed, so the page can
  // drop its own copy of the credentials and put the login form up.
  onSignedOut: () => void;
}

// Switching accounts signs the user out for real, so it asks first — the
// consent card is reached from an ordinary signed-in session, and a stray
// click on a link at the bottom of the card should not end it.
export function OAuthSwitchAccountDialog({
  userName,
  onSignedOut,
}: OAuthSwitchAccountDialogProps) {
  const fetcher = useFetcher<OAuthLoginActionData>();
  const [open, setOpen] = useState(false);
  const wasPending = useRef(false);
  const signingOut = fetcher.state !== "idle";

  useEffect(() => {
    const settled = wasPending.current && fetcher.state === "idle";
    wasPending.current = fetcher.state !== "idle";
    if (settled && fetcher.data?.loggedOut) {
      setOpen(false);
      onSignedOut();
    }
  }, [fetcher.state, fetcher.data, onSignedOut]);

  // Submitted straight from the button rather than through a `fetcher.Form`:
  // a form wrapper would be the flex item in the footer and would size itself
  // to its content while the sibling `Cancel` stretched, leaving the two
  // buttons different widths.
  const signOut = () =>
    fetcher.submit({ intent: OAUTH_LOGOUT_INTENT }, { method: "post" });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-md text-center text-xs font-semibold text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:outline-none"
        >
          Not {userName}? Sign in with a different account
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8">
            Sign in with a different account?
          </DialogTitle>
          {/* The session being ended is the ordinary site session, not something
              scoped to this popup, so say so rather than let the user discover it
              on their next tab. */}
          <DialogDescription>
            This signs {userName} out of TrueKhmer in this browser, not just for
            this app. You will need to sign in again to continue.
          </DialogDescription>
        </DialogHeader>

        {/* The footer stacks by default; the two buttons here are short enough
            to sit side by side at every width, and they share the rectangular
            shape used by the rest of the consent flow. */}
        <DialogFooter className="flex-row gap-3 bg-white sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={signingOut}
              className="h-11 flex-1 rounded-full border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={signOut}
            loading={signingOut}
            className="h-11 flex-1 rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50"
          >
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
