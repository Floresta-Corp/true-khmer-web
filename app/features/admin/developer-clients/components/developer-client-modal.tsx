import { type FormEvent, useEffect, useState } from "react";
import { AlertCircle, KeyRound, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
import { cn } from "~/lib/utils";
import type { DeveloperClient, DeveloperClientStatusInput } from "../types";
import { AllowedOriginsField } from "./allowed-origins-field";
import { FieldHint, FieldLabel, fieldControlClass } from "./form-field";
import { LogoUploadField } from "./logo-upload-field";

export type DeveloperClientFormValues = {
  name: string;
  description: string;
  contactEmail: string;
  status: DeveloperClientStatusInput;
  allowedOrigins: string[];
  allowAllOrigins: boolean;
  /** The key already stored on the client; cleared when the logo is removed. */
  logoKey: string;
  /** A newly picked logo, uploaded by the action on save. */
  logoFile: File | null;
};

interface DeveloperClientModalProps {
  isOpen: boolean;

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
  allowedOrigins: [],
  allowAllOrigins: false,
  logoKey: "",
  logoFile: null,
};

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
            allowedOrigins: client.allowedOrigins,
            allowAllOrigins: client.allowAllOrigins,
            logoKey: client.logoKey ?? "",
            logoFile: null,
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    onSubmit({
      ...values,
      name,
      contactEmail: email,
      logoKey: values.logoKey.trim(),
    });
  }

  const message = error ?? serverError;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
    >
      <DialogContent className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-xl dark:bg-slate-900 dark:ring-slate-800">
        <DialogHeader className="flex-row items-start gap-3 border-b border-slate-100 px-5 py-4 pr-12 sm:px-6 dark:border-slate-800">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <KeyRound className="size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
              {isEdit ? "Edit developer client" : "New developer client"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isEdit
                ? "Update the partner's details, or disable the client to cut off its access immediately."
                : "Register a partner platform. A client ID and secret are generated on save — the secret is shown only once."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form
          id="developer-client-form"
          onSubmit={handleSubmit}
          className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6"
        >
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="client-name" required>
                  Name
                </FieldLabel>
                <Input
                  id="client-name"
                  value={values.name}
                  maxLength={120}
                  disabled={isLoading}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Acme Portal"
                  className={fieldControlClass}
                />
              </div>

              <div>
                <FieldLabel htmlFor="client-email">Contact email</FieldLabel>
                <Input
                  id="client-email"
                  type="email"
                  value={values.contactEmail}
                  maxLength={255}
                  disabled={isLoading}
                  onChange={(event) =>
                    update("contactEmail", event.target.value)
                  }
                  placeholder="dev@partner.com"
                  className={fieldControlClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="client-description">Description</FieldLabel>
              <Textarea
                id="client-description"
                value={values.description}
                maxLength={1000}
                rows={3}
                disabled={isLoading}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Sign in to continue to Acme"
                className={cn(fieldControlClass, "h-auto min-h-20 py-3")}
              />
              <FieldHint>
                Shown to end users on the partner's own login page, not just
                here.
              </FieldHint>
            </div>

            <AllowedOriginsField
              origins={values.allowedOrigins}
              allowAllOrigins={values.allowAllOrigins}
              disabled={isLoading}
              onChange={(allowedOrigins) =>
                update("allowedOrigins", allowedOrigins)
              }
              onAllowAllOriginsChange={(allowAllOrigins) =>
                update("allowAllOrigins", allowAllOrigins)
              }
            />

            <LogoUploadField
              existingKey={values.logoKey}
              file={values.logoFile}
              disabled={isLoading}
              onSelect={(logoFile) =>
                setValues((current) => ({ ...current, logoFile }))
              }
              onRemove={() =>
                setValues((current) => ({
                  ...current,
                  logoKey: "",
                  logoFile: null,
                }))
              }
            />

            {isEdit && (
              <div>
                <FieldLabel htmlFor="client-status">Status</FieldLabel>
                <Select
                  value={values.status}
                  disabled={isLoading}
                  onValueChange={(value) =>
                    update("status", value as DeveloperClientStatusInput)
                  }
                >
                  <SelectTrigger
                    id="client-status"
                    className={cn(fieldControlClass, "w-full")}
                  >
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DISABLED">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <FieldHint>
                  A disabled client is rejected on every partner request.
                </FieldHint>
              </div>
            )}

            {message && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 gap-2 rounded-b-2xl border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:gap-3 sm:px-6 dark:border-slate-800 dark:bg-slate-950/40">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 rounded-lg font-medium dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="developer-client-form"
            size="lg"
            disabled={isLoading}
            className="h-10 rounded-lg bg-blue-600 px-4 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {isLoading
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
