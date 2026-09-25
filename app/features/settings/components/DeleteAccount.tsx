import { useState } from "react";
import { useFetcher } from "react-router";
import { Check, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { copyToClipboard } from "~/lib/clipboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { SettingsActionData } from "../types";
import { SecurityRow } from "./SecurityRow";

export function DeleteAccount() {
  const fetcher = useFetcher<SettingsActionData>();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const pending = fetcher.state !== "idle";
  const confirmed = confirmation === "CONFIRM";
  const error = submitted && !pending ? fetcher.data?.errors?.form : undefined;

  return (
    <SecurityRow
      label="Delete account"
      description="Delete your account and lose access to True Khmer."
    >
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (pending) return;
          setOpen(nextOpen);
          setConfirmation("");
          setCopied(false);
          setSubmitted(false);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-9 rounded-lg border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Delete account
          </Button>
        </DialogTrigger>
        <DialogContent
          className="gap-6 rounded-2xl border-0 bg-white p-6 shadow-none ring-0 sm:max-w-md"
          showCloseButton={!pending}
        >
          <DialogHeader className="gap-2 pr-6">
            <DialogTitle className="text-left text-lg font-semibold tracking-tight text-[#1A2233]">
              Delete your account?
            </DialogTitle>
            <DialogDescription className="text-left leading-relaxed text-slate-500">
              You’ll be signed out and lose access to your True Khmer account.
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form
            method="post"
            className="space-y-6"
            onSubmit={(event) => {
              if (pending || !confirmed) {
                event.preventDefault();
                return;
              }
              setSubmitted(true);
            }}
          >
            <input type="hidden" name="intent" value="delete-account" />
            <div className="space-y-2 text-sm text-slate-600">
              <div id="delete-account-instructions" className="leading-relaxed">
                To confirm, enter{" "}
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <code className="font-semibold tracking-wide text-slate-900 select-text">
                    CONFIRM
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={copied ? "Copy CONFIRM again" : "Copy CONFIRM"}
                    title={copied ? "Copied!" : "Copy CONFIRM"}
                    disabled={pending}
                    className="size-6 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-200"
                    onClick={async () => {
                      setCopied(
                        await copyToClipboard("CONFIRM", {
                          successMessage: null,
                          errorMessage: null,
                        }),
                      );
                    }}
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </span>{" "}
                below.
              </div>
              <label htmlFor="delete-account-confirmation" className="sr-only">
                Enter CONFIRM to delete your account
              </label>
              <Input
                id="delete-account-confirmation"
                type="text"
                name="confirm"
                value={confirmation}
                required
                pattern="CONFIRM"
                autoComplete="off"
                spellCheck={false}
                placeholder="Enter CONFIRM"
                aria-describedby="delete-account-instructions"
                disabled={pending}
                onChange={(event) => setConfirmation(event.target.value)}
                className="h-11 rounded-lg border-slate-200 bg-white px-3 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:ring-0"
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            ) : null}
            <DialogFooter className="m-0 gap-2 border-0 bg-transparent p-0">
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-4 text-slate-600 hover:bg-slate-100"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending || !confirmed}
                className="h-10 bg-red-600 px-4 text-white shadow-none hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100"
              >
                {pending ? "Deleting account…" : "Delete account"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </SecurityRow>
  );
}
