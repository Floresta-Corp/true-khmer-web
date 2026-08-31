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

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={signingOut}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={signOut}
            loading={signingOut}
            className="w-full sm:w-auto"
          >
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
