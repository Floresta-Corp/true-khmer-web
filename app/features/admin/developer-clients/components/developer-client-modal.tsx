import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { KeyRound, Loader2, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import type { DeveloperClient, DeveloperClientStatusInput } from "../types";

export type DeveloperClientFormValues = {
  name: string;
  description: string;
  contactEmail: string;
  status: DeveloperClientStatusInput;
};

interface DeveloperClientModalProps {
  isOpen: boolean;
  /** Null means "create a new client"; a client means "edit this one". */
  client: DeveloperClient | null;
  isLoading: boolean;
  serverError?: string | null;
  onClose: () => void;
  onSubmit: (values: DeveloperClientFormValues) => void;
}

const EMPTY: DeveloperClientFormValues = {
  name: "",
  description: "",
  contactEmail: "",
  status: "ACTIVE",
};

const fieldClass =
  "w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white";

export function DeveloperClientModal({
  isOpen,
  client,
  isLoading,
  serverError = null,
  onClose,
  onSubmit,
}: DeveloperClientModalProps) {
  const isEdit = client !== null;
  const [values, setValues] = useState<DeveloperClientFormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  // Re-seed from the selected client each time the modal opens, so a cancelled
  // edit never leaks into the next one.
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setValues(
      client
        ? {
            name: client.name,
            description: client.description ?? "",
            contactEmail: client.contactEmail ?? "",
            status: client.status === "DISABLED" ? "DISABLED" : "ACTIVE",
          }
        : EMPTY,
    );
  }, [isOpen, client]);

  function update<K extends keyof DeveloperClientFormValues>(
    key: K,
    value: DeveloperClientFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  }

  function handleClose() {
    if (isLoading) return;
    onClose();
  }

  function handleSubmit() {
    if (isLoading) return;

    const name = values.name.trim();
    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    const email = values.contactEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid contact email address.");
      return;
    }

    setError(null);
    onSubmit({ ...values, name, contactEmail: email });
  }

  if (!isOpen) return null;

  const message = error ?? serverError;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-lg overflow-visible rounded-2xl border border-slate-100 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-xl p-3 dark:bg-slate-900 dark:text-white">
            <KeyRound size={22} />
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            aria-label="Close"
            className="p-2 text-slate-500 hover:text-slate-900"
          >
            <X size={20} />
          </Button>
        </div>

        <h3 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {isEdit ? "Edit Developer Client" : "New Developer Client"}
        </h3>
        <p className="mb-8 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update the partner's details, or disable the client to cut off its access immediately."
            : "Register a partner platform. A client ID is generated automatically once you save."}
        </p>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Name
            </Label>
            <Input
              value={values.name}
              maxLength={120}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Acme Portal"
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Contact Email
            </Label>
            <Input
              type="email"
              value={values.contactEmail}
              maxLength={255}
              onChange={(event) => update("contactEmail", event.target.value)}
              placeholder="dev@partner.com"
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Description
            </Label>
            <Textarea
              value={values.description}
              maxLength={1000}
              rows={3}
              onChange={(event) => update("description", event.target.value)}
              placeholder="What this partner integration is for"
              className={fieldClass}
            />
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                Status
              </Label>
              <Select
                value={values.status}
                onValueChange={(value) =>
                  update("status", value as DeveloperClientStatusInput)
                }
              >
                <SelectTrigger className="h-auto w-full rounded-md border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-slate-900 focus:ring-0 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="z-110">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DISABLED">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                A disabled client is rejected on every partner request.
              </p>
            </div>
          )}

          {message && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-500 dark:border-red-800 dark:bg-red-900/20">
              {message}
            </p>
          )}

          <div className="flex gap-4 pt-2">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-slate-100 py-5 text-[11px] font-semibold tracking-widest text-slate-500 uppercase hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-5 text-[11px] font-semibold tracking-widest text-white uppercase hover:bg-blue-800 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Client"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
