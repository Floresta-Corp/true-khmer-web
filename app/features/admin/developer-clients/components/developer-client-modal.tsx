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
import type {
  DeveloperClientResponse as DeveloperClient,
  UpdateDeveloperClientRequest,
} from "~/types/api-client";
import { AllowedOriginsField } from "./allowed-origins-field";
import { AndroidFingerprintsField } from "./android-fingerprints-field";
import { FieldHint, FieldLabel, fieldControlClass } from "./form-field";
import { LogoUploadField } from "./logo-upload-field";

export type DeveloperClientFormValues = {
  name: string;
  clientType: DeveloperClient["clientType"];
  description: string;
  contactEmail: string;
  status: NonNullable<UpdateDeveloperClientRequest["status"]>;
  allowedOrigins: string[];
  iosBundleIdentifier: string;
  androidPackageName: string;
  androidSha1Fingerprints: string[];
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
  clientType: "WEB",
  description: "",
  contactEmail: "",
  status: "ACTIVE",
  allowedOrigins: [],
  iosBundleIdentifier: "",
  androidPackageName: "",
  androidSha1Fingerprints: [],
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
            clientType: client.clientType,
            description: client.description ?? "",
            contactEmail: client.contactEmail ?? "",
            status: client.status === "DISABLED" ? "DISABLED" : "ACTIVE",
            allowedOrigins: client.allowedOrigins,
            iosBundleIdentifier: client.iosBundleIdentifier ?? "",
            androidPackageName: client.androidPackageName ?? "",
            androidSha1Fingerprints: client.androidSha1Fingerprints,
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

    if (values.clientType === "IOS" && !values.iosBundleIdentifier.trim()) {
      setError("Bundle identifier is required for an iOS client.");
      return;
    }
    if (values.clientType === "ANDROID") {
      if (!values.androidPackageName.trim()) {
        setError("Android package name is required.");
        return;
      }
      if (values.androidSha1Fingerprints.length === 0) {
        setError("Add at least one Android signing-certificate SHA-1.");
        return;
      }
    }

    setError(null);
    onSubmit({
      ...values,
      name,
      contactEmail: email,
      iosBundleIdentifier: values.iosBundleIdentifier.trim(),
      androidPackageName: values.androidPackageName.trim(),
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
              <FieldLabel htmlFor="client-type" required>
                Application type
              </FieldLabel>
              <Select
                value={values.clientType}
                disabled={isLoading || isEdit}
                onValueChange={(clientType) =>
                  setValues((current) => ({
                    ...current,
                    clientType: clientType as DeveloperClient["clientType"],
                    allowedOrigins: [],
                    iosBundleIdentifier: "",
                    androidPackageName: "",
                    androidSha1Fingerprints: [],
                  }))
                }
              >
                <SelectTrigger
                  id="client-type"
                  className={cn(fieldControlClass, "w-full")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEB">Web client</SelectItem>
                  <SelectItem value="IOS">iOS client</SelectItem>
                  <SelectItem value="ANDROID">Android client</SelectItem>
                </SelectContent>
              </Select>
              <FieldHint>
                Application type is permanent because each platform verifies a
                different application identity.
              </FieldHint>
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

            {values.clientType === "WEB" ? (
              <AllowedOriginsField
                origins={values.allowedOrigins}
                disabled={isLoading}
                onChange={(allowedOrigins) =>
                  update("allowedOrigins", allowedOrigins)
                }
              />
            ) : null}

            {values.clientType === "IOS" ? (
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="ios-bundle-identifier" required>
                    Bundle identifier
                  </FieldLabel>
                  <Input
                    id="ios-bundle-identifier"
                    value={values.iosBundleIdentifier}
                    maxLength={255}
                    disabled={isLoading}
                    onChange={(event) =>
                      update("iosBundleIdentifier", event.target.value)
                    }
                    placeholder="com.example.app"
                    className={cn(fieldControlClass, "font-mono")}
                  />
                  <FieldHint>
                    Must exactly match CFBundleIdentifier in the signed iOS
                    application.
                  </FieldHint>
                </div>
                {client?.redirectScheme ? (
                  <div>
                    <FieldLabel htmlFor="ios-url-scheme">
                      iOS URL scheme
                    </FieldLabel>
                    <Input
                      id="ios-url-scheme"
                      value={client.redirectScheme}
                      readOnly
                      className={cn(fieldControlClass, "font-mono text-xs")}
                    />
                    <FieldHint>
                      Generated from the client ID. Add it to CFBundleURLSchemes
                      in Info.plist, or let the SDK build plugin do it.
                    </FieldHint>
                  </div>
                ) : null}
              </div>
            ) : null}

            {values.clientType === "ANDROID" ? (
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="android-package-name" required>
                    Package name
                  </FieldLabel>
                  <Input
                    id="android-package-name"
                    value={values.androidPackageName}
                    maxLength={255}
                    disabled={isLoading}
                    onChange={(event) =>
                      update("androidPackageName", event.target.value)
                    }
                    placeholder="com.example.app"
                    className={cn(fieldControlClass, "font-mono")}
                  />
                  <FieldHint>
                    Must exactly match the Android applicationId.
                  </FieldHint>
                </div>
                <AndroidFingerprintsField
                  fingerprints={values.androidSha1Fingerprints}
                  disabled={isLoading}
                  onChange={(fingerprints) =>
                    update("androidSha1Fingerprints", fingerprints)
                  }
                />
                {client?.redirectScheme ? (
                  <div>
                    <FieldLabel htmlFor="android-url-scheme">
                      Android URL scheme
                    </FieldLabel>
                    <Input
                      id="android-url-scheme"
                      value={client.redirectScheme}
                      readOnly
                      className={cn(fieldControlClass, "font-mono text-xs")}
                    />
                    <FieldHint>
                      Generated from the client ID. Use it as android:scheme on
                      the MainActivity intent filter, with host "oauth" and path
                      "/callback".
                    </FieldHint>
                  </div>
                ) : null}
              </div>
            ) : null}

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
                    update(
                      "status",
                      value as NonNullable<
                        UpdateDeveloperClientRequest["status"]
                      >,
                    )
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
