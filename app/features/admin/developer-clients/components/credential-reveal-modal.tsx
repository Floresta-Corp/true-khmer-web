import {
  Check,
  Copy,
  Info,
  PartyPopper,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { copyToClipboard } from "~/lib/clipboard";
import type { RevealedCredentialKind } from "../types";

interface CredentialRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  kind: RevealedCredentialKind;
  name: string;
  value: string;

  isNew: boolean;
}

const COPY_LABEL: Record<RevealedCredentialKind, string> = {
  clientId: "Client ID",
  clientSecret: "Client Secret",
};

export function CredentialRevealModal({
  isOpen,
  onClose,
  kind,
  name,
  value,
  isNew,
}: CredentialRevealModalProps) {
  const [copied, setCopied] = useState(false);
  const isSecret = kind === "clientSecret";

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  async function handleCopy() {
    const label = COPY_LABEL[kind];
    const ok = await copyToClipboard(value, {
      successMessage: `${label} copied to clipboard.`,
      errorMessage: `Failed to copy the ${label.toLowerCase()}.`,
    });
    if (ok) setCopied(true);
  }

  const heading = isNew
    ? "Client created"
    : isSecret
      ? "Client secret regenerated"
      : "Client ID regenerated";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg dark:bg-slate-900 dark:ring-slate-800">
        <DialogHeader className="flex-row items-start gap-3 border-b border-slate-100 px-5 py-4 pr-12 sm:px-6 dark:border-slate-800">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            {isNew ? (
              <PartyPopper className="size-5" />
            ) : (
              <RefreshCw className="size-5" />
            )}
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
              {heading}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isNew ? (
                <>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {name}
                  </span>{" "}
                  is registered. Send them the secret below — it will not be
                  shown again.
                </>
              ) : (
                <>
                  The previous {isSecret ? "secret" : "client ID"} for{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {name}
                  </span>{" "}
                  stopped working immediately. Send them the new one.
                </>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {COPY_LABEL[kind]}
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 pl-3 dark:border-slate-700 dark:bg-slate-950/50">
              <code className="min-w-0 flex-1 truncate font-mono text-sm text-slate-800 dark:text-slate-200">
                {value}
              </code>
              <Button
                type="button"
                variant={copied ? "outline" : "default"}
                size="lg"
                onClick={handleCopy}
                className={
                  copied
                    ? "shrink-0 rounded-lg border-emerald-200 bg-emerald-50 font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "shrink-0 rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700"
                }
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" /> Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {isSecret ? (
            <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/30">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
                Copy this now — only a hash is stored, so it cannot be shown
                again. If it is lost, regenerate a new one. It belongs on the
                partner's <span className="font-semibold">backend only</span>;
                it must never be shipped to a browser.
              </p>
            </div>
          ) : (
            <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
              <Info className="mt-0.5 size-4 shrink-0 text-slate-500 dark:text-slate-400" />
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                The client ID is a public identifier — the partner's login page
                sends it in the clear, and it stays visible in this table. The
                client secret is the credential, and is issued separately.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-b-2xl border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950/40">
          <Button
            type="button"
            size="lg"
            onClick={onClose}
            className="h-10 rounded-lg bg-slate-900 px-5 font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
