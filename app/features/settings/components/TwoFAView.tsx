import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
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
import type { SettingsActionData } from "../types";
import type { AuthTwoFactorSettingsResponse } from "~/types/api-client";

type Method = "totp" | "email";

function MethodStatus({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        enabled ? "bg-[#ECFDF3] text-[#027A48]" : "bg-[#F3F6FB] text-[#667085]"
      }`}
    >
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}

function MethodPanel({
  icon,
  title,
  description,
  enabled,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E5EAF2] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FD]">
            {icon}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-[#1A2233]">
                {title}
              </h3>
              <MethodStatus enabled={enabled} />
            </div>
            <p className="max-w-xl text-sm leading-5 text-[#6B7A99]">
              {description}
            </p>
          </div>
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}

function MethodAction({
  enabled,
  setupTo,
  onDisable,
}: {
  enabled: boolean;
  setupTo: string;
  onDisable: () => void;
}) {
  if (enabled) {
    return (
      <Button
        variant="outline"
        onClick={onDisable}
        className="h-9 rounded-lg border-[#D1D9E6] px-4 text-sm font-semibold text-[#344256] hover:bg-[#F0F4FA]"
      >
        Disable
      </Button>
    );
  }

  return (
    <Button
      asChild
      className="h-9 rounded-lg bg-[#2F6FE4] px-4 text-sm font-semibold text-white hover:bg-[#1F62DF]"
    >
      <Link to={setupTo}>Set up</Link>
    </Button>
  );
}

export function TwoFAView({
  email,
  setupNewPassword,
  settings,
}: {
  email: string;
  setupNewPassword: boolean;
  settings: AuthTwoFactorSettingsResponse;
}) {
  const fetcher = useFetcher<SettingsActionData>();
  const [disableMethod, setDisableMethod] = useState<Method | null>(null);
  // Result from before the dialog was opened, so old errors don't reappear.
  const [staleData, setStaleData] = useState<SettingsActionData>();
  const data = fetcher.data;
  const disableErrors =
    data !== staleData && data?.intent?.endsWith("-disable")
      ? data.errors
      : undefined;

  function openDisableDialog(method: Method) {
    setStaleData(fetcher.data);
    setDisableMethod(method);
  }
  const pendingIntent = fetcher.formData?.get("intent")?.toString();
  const isSubmitting = fetcher.state !== "idle";
  const totpEnabled = settings.methods.authenticatorApp.enabled;
  const emailEnabled = settings.methods.emailOtp.enabled;

  useEffect(() => {
    if (
      data?.ok &&
      (data.intent === "totp-disable" || data.intent === "email-disable")
    ) {
      setDisableMethod(null);
    }
  }, [data]);

  return (
    <div className="space-y-8">
      <Link
        to="/settings"
        className="inline-flex items-center gap-2 text-sm text-[#6B7A99] transition-colors hover:text-[#344256]"
      >
        <ArrowLeft className="size-4" />
        Back to Security
      </Link>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#1A2233]">
          2-step verification
        </h2>
        <p className="text-sm text-[#6B7A99]">
          Choose one or both verification methods for your account.
        </p>
      </div>

      <div className="rounded-2xl border border-[#D7E7FF] bg-[#F7FAFF] p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 text-[#2F6FE4]" />
          <div>
            <p className="text-sm font-semibold text-[#1A2233]">
              {settings.twoFactorEnabled
                ? "Your account has 2-step verification enabled."
                : "Your account does not have 2-step verification enabled."}
            </p>
            <p className="mt-1 text-sm leading-5 text-[#5C6B82]">
              Login challenges use a short-lived 2FA token. Account changes use
              your current authenticated session.
            </p>
          </div>
        </div>
      </div>

      {data?.message && disableMethod === null ? (
        <p className="rounded-lg border border-[#CFE8D8] bg-[#F0FDF4] px-3 py-2 text-sm font-medium text-[#166534]">
          {data.message}
        </p>
      ) : null}

      <div className="space-y-4">
        <MethodPanel
          icon={<Mail className="size-5 text-[#2F6FE4]" />}
          title="Email OTP"
          description={`Send login and setup verification codes to ${settings.methods.emailOtp.email || email}.`}
          enabled={emailEnabled}
        >
          <MethodAction
            enabled={emailEnabled}
            setupTo="/settings/2fa/email"
            onDisable={() => openDisableDialog("email")}
          />
        </MethodPanel>
        <MethodPanel
          icon={<Smartphone className="size-5 text-[#2F6FE4]" />}
          title="Authenticator app"
          description="Use apps such as Google Authenticator, Authy, 1Password, or iCloud Passwords to generate time-based codes."
          enabled={totpEnabled}
        >
          <MethodAction
            enabled={totpEnabled}
            setupTo="/settings/2fa/authenticator"
            onDisable={() => openDisableDialog("totp")}
          />
        </MethodPanel>
      </div>

      <Dialog
        open={disableMethod !== null}
        onOpenChange={(open) => {
          if (!open) setDisableMethod(null);
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-[#FFF4ED]">
              <CheckCircle2 className="size-5 text-[#F79009]" />
            </div>
            <DialogTitle className="text-center text-[#1A2233]">
              Disable{" "}
              {disableMethod === "totp" ? "authenticator app" : "email OTP"}?
            </DialogTitle>
            <DialogDescription className="text-center">
              {disableMethod === "totp"
                ? "Your authenticator and backup codes will be removed. To turn this back on, you'll need to set it up again."
                : "To turn this back on, you'll need to verify your email again."}
            </DialogDescription>
          </DialogHeader>
          {setupNewPassword ? (
            <p className="rounded-lg border border-[#FEDF89] bg-[#FFFAEB] px-3 py-2 text-sm font-medium text-[#B54708]">
              Your account doesn&apos;t have a password yet.{" "}
              <Link to="/settings" className="underline">
                Set a password
              </Link>{" "}
              before disabling 2-step verification.
            </p>
          ) : null}
          {disableErrors?.form ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {disableErrors.form}
            </p>
          ) : null}
          <fetcher.Form method="post" className="space-y-4">
            <input
              type="hidden"
              name="intent"
              value={
                disableMethod === "totp" ? "totp-disable" : "email-disable"
              }
            />
            <div className="space-y-2">
              <Label htmlFor="disable-2fa-password">Current password</Label>
              <Input
                id="disable-2fa-password"
                name="password"
                type="password"
                autoComplete="current-password"
                disabled={setupNewPassword}
                className="h-11 border-[#E5EAF2] bg-white"
              />
              {disableErrors?.password ? (
                <p className="text-xs text-red-500">{disableErrors.password}</p>
              ) : null}
            </div>
            <DialogFooter className="rounded-b-2xl">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDisableMethod(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || setupNewPassword}
                className="bg-[#D92D20] text-white hover:bg-[#B42318]"
              >
                {pendingIntent?.endsWith("-disable")
                  ? "Disabling..."
                  : "Disable"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
