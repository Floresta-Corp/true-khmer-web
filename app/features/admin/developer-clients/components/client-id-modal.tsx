import { motion } from "motion/react";
import { Check, Copy, Info, PartyPopper, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { copyToClipboard } from "~/lib/clipboard";

interface ClientIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  clientId: string;
  /** True after a create, false after a regenerate. */
  isNew: boolean;
}

/**
 * Shows the client ID that was just issued.
 *
 * Note this is a convenience, not a one-time secret reveal: the client ID is an
 * identifier and stays visible in the table. The API key is a separate shared
 * secret that is never shown here — the copy below says so explicitly, because
 * admins otherwise read this screen as a credential pair.
 */
export function ClientIdModal({
  isOpen,
  onClose,
  name,
  clientId,
  isNew,
}: ClientIdModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  async function handleCopy() {
    const ok = await copyToClipboard(clientId, {
      successMessage: "Client ID copied to clipboard.",
      errorMessage: "Failed to copy the client ID.",
    });
    if (ok) setCopied(true);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-xl p-3 text-emerald-600 dark:bg-slate-900 dark:text-emerald-400">
            {isNew ? <PartyPopper size={22} /> : <RefreshCw size={22} />}
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-slate-500 hover:text-slate-900"
          >
            <X size={20} />
          </Button>
        </div>

        <h3 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {isNew ? "Client created" : "Client ID regenerated"}
        </h3>
        <p className="mb-6 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
          {isNew ? (
            <>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {name}
              </span>{" "}
              can now be given the client ID below.
            </>
          ) : (
            <>
              The previous client ID for{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {name}
              </span>{" "}
              stopped working immediately. Send them the new one.
            </>
          )}
        </p>

        <div className="mb-5 space-y-2">
          <p className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Client ID
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <code className="flex-1 truncate font-mono text-sm text-slate-800 dark:text-slate-200">
              {clientId}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mb-6 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
          <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            The client ID identifies the partner — it is not a secret and stays
            visible in this table. The partner also needs the shared{" "}
            <span className="font-semibold">API key</span>, which is configured
            on the server and must be sent to them separately.
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full rounded-xl bg-blue-600 py-5 text-[11px] font-semibold tracking-widest text-white uppercase hover:bg-blue-800 active:scale-95"
        >
          Done
        </Button>
      </motion.div>
    </div>
  );
}
