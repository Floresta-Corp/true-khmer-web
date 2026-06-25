import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import QRCode from "qrcode";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/routes/auth/components/input-otp";
import type { SettingsActionData } from "../services/settings.action";
import type {
  AuthTwoFactorSettingsResponse,
  AuthTwoFactorTotpSetupResponse,
} from "~/types/api-client";

type Method = "totp" | "email";
type TotpSetupStep = "password" | "qr" | "verify";

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

function OtpCodeField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-[#1A2233]">
        Verification code
      </Label>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        inputMode="numeric"
        pattern="[0-9]*"
      >
        <InputOTPGroup className="gap-2 rounded-none">
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="size-11 rounded-lg border border-[#E5EAF2] bg-white text-base font-semibold text-[#1A2233] first:rounded-lg first:border-l last:rounded-lg data-[active=true]:border-[#2F6FE4] data-[active=true]:ring-[#2F6FE4]/20"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
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

function AuthenticatorQrCode({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(canvas, value, {
      width: 220,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  }, [value]);

  return (
    <div className="flex justify-center rounded-2xl border border-[#E5EAF2] bg-white p-4">
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        className="h-[220px] w-[220px] rounded-lg"
        aria-label="Authenticator app setup QR code"
      />
    </div>
  );
}

export function TwoFAView({
  email,
  settings,
  onBack,
}: {
  email: string;
  settings: AuthTwoFactorSettingsResponse;
  onBack: () => void;
}) {
  const fetcher = useFetcher<SettingsActionData>();
  const [totpOpen, setTotpOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [disableMethod, setDisableMethod] = useState<Method | null>(null);
  const [totpSetup, setTotpSetup] =
    useState<AuthTwoFactorTotpSetupResponse | null>(null);
  const [totpSetupStep, setTotpSetupStep] =
    useState<TotpSetupStep>("password");
  const [totpCode, setTotpCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [trustTotpDevice, setTrustTotpDevice] = useState(false);
  const [trustEmailDevice, setTrustEmailDevice] = useState(false);
  const data = fetcher.data;
  const pendingIntent = fetcher.formData?.get("intent")?.toString();
  const isSubmitting = fetcher.state !== "idle";
  const totpEnabled = settings.methods.authenticatorApp.enabled;
  const emailEnabled = settings.methods.emailOtp.enabled;

  useEffect(() => {
    if (data?.setup) {
      setTotpSetup(data.setup);
      setTotpSetupStep("qr");
    }
    if (data?.ok && data.intent === "totp-verify") {
      setTotpOpen(false);
      setTotpSetup(null);
      setTotpSetupStep("password");
      setTotpCode("");
    }
    if (data?.ok && data.intent === "email-verify") {
      setEmailOpen(false);
      setEmailCode("");
    }
    if (
      data?.ok &&
      (data.intent === "totp-disable" || data.intent === "email-disable")
    ) {
      setDisableMethod(null);
    }
  }, [data]);

  const actionError = data?.errors?.form;
  const activeDialog =
    totpOpen || emailOpen || disableMethod !== null ? data?.intent : undefined;

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-[#6B7A99] transition-colors hover:text-[#344256]"
      >
        <ArrowLeft className="size-4" />
        Back to Security
      </button>

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

      {actionError && activeDialog ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {actionError}
        </p>
      ) : null}
      {data?.message && !activeDialog ? (
        <p className="rounded-lg border border-[#CFE8D8] bg-[#F0FDF4] px-3 py-2 text-sm font-medium text-[#166534]">
          {data.message}
        </p>
      ) : null}

      <div className="space-y-4">
        <MethodPanel
          icon={<Smartphone className="size-5 text-[#2F6FE4]" />}
          title="Authenticator app"
          description="Use apps such as Google Authenticator, Authy, 1Password, or iCloud Passwords to generate time-based codes."
          enabled={totpEnabled}
        >
          {totpEnabled ? (
            <Button
              variant="outline"
              onClick={() => setDisableMethod("totp")}
              className="h-9 rounded-lg border-[#D1D9E6] px-4 text-sm font-semibold text-[#344256] hover:bg-[#F0F4FA]"
            >
              Disable
            </Button>
          ) : (
            <Dialog
              open={totpOpen}
              onOpenChange={(open) => {
                setTotpOpen(open);
                if (!open) {
                  setTotpSetup(null);
                  setTotpSetupStep("password");
                  setTotpCode("");
                  setTrustTotpDevice(false);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="h-9 rounded-lg bg-[#2F6FE4] px-4 text-sm font-semibold text-white hover:bg-[#1F62DF]">
                  Set up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#1A2233]">
                    Set up authenticator app
                  </DialogTitle>
                  <DialogDescription>
                    Confirm your password, scan the QR code, then enter the
                    code from your authenticator app.
                  </DialogDescription>
                </DialogHeader>

                {totpSetupStep === "password" || !totpSetup ? (
                  <fetcher.Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="totp-setup" />
                    <div className="space-y-2">
                      <Label htmlFor="totp-password">Current password</Label>
                      <Input
                        id="totp-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="h-11 border-[#E5EAF2] bg-white"
                      />
                      {data?.intent === "totp-setup" &&
                      data.errors?.password ? (
                        <p className="text-xs text-red-500">
                          {data.errors.password}
                        </p>
                      ) : null}
                    </div>
                    {data?.intent === "totp-setup" && data.errors?.form ? (
                      <p className="text-sm font-medium text-red-600">
                        {data.errors.form}
                      </p>
                    ) : null}
                    <DialogFooter className="rounded-b-2xl">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setTotpOpen(false);
                          setTotpSetup(null);
                          setTotpSetupStep("password");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                      >
                        {pendingIntent === "totp-setup"
                          ? "Starting..."
                          : "Continue"}
                      </Button>
                    </DialogFooter>
                  </fetcher.Form>
                ) : totpSetupStep === "qr" ? (
                  <div className="space-y-5">
                    <AuthenticatorQrCode value={totpSetup.totpURI} />
                    <div className="space-y-2 rounded-xl border border-[#E5EAF2] bg-[#F8FAFC] p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#1A2233]">
                        <KeyRound className="size-4 text-[#2F6FE4]" />
                        Manual setup URI
                      </div>
                      <p className="break-all text-xs leading-5 text-[#5C6B82]">
                        {totpSetup.totpURI}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F8FAFC] p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B7A99]">
                        Backup codes
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {totpSetup.backupCodes.map((code) => (
                          <code
                            key={code}
                            className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-[#1A2233]"
                          >
                            {code}
                          </code>
                        ))}
                      </div>
                    </div>
                    <DialogFooter className="rounded-b-2xl">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setTotpOpen(false);
                          setTotpSetup(null);
                          setTotpSetupStep("password");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                        onClick={() => setTotpSetupStep("verify")}
                      >
                        Next
                      </Button>
                    </DialogFooter>
                  </div>
                ) : (
                  <fetcher.Form method="post" className="space-y-5">
                    <input type="hidden" name="intent" value="totp-verify" />
                    <input type="hidden" name="code" value={totpCode} />
                    <input
                      type="hidden"
                      name="trustDevice"
                      value={trustTotpDevice ? "true" : "false"}
                    />
                    <OtpCodeField
                      value={totpCode}
                      onChange={setTotpCode}
                      error={
                        data?.intent === "totp-verify"
                          ? data.errors?.code
                          : undefined
                      }
                    />
                    <Label className="flex items-center gap-2 text-sm font-semibold text-[#1D283A]">
                      <Checkbox
                        checked={trustTotpDevice}
                        onCheckedChange={(checked) =>
                          setTrustTotpDevice(checked === true)
                        }
                      />
                      Trust this device
                    </Label>
                    <DialogFooter className="rounded-b-2xl">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTotpSetupStep("qr")}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || totpCode.length !== 6}
                        className="bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                      >
                        {pendingIntent === "totp-verify"
                          ? "Verifying..."
                          : "Enable authenticator"}
                      </Button>
                    </DialogFooter>
                  </fetcher.Form>
                )}
              </DialogContent>
            </Dialog>
          )}
        </MethodPanel>

        <MethodPanel
          icon={<Mail className="size-5 text-[#2F6FE4]" />}
          title="Email OTP"
          description={`Send login and setup verification codes to ${settings.methods.emailOtp.email || email}.`}
          enabled={emailEnabled}
        >
          {emailEnabled ? (
            <Button
              variant="outline"
              onClick={() => setDisableMethod("email")}
              className="h-9 rounded-lg border-[#D1D9E6] px-4 text-sm font-semibold text-[#344256] hover:bg-[#F0F4FA]"
            >
              Disable
            </Button>
          ) : (
            <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
              <DialogTrigger asChild>
                <Button className="h-9 rounded-lg bg-[#2F6FE4] px-4 text-sm font-semibold text-white hover:bg-[#1F62DF]">
                  Set up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#1A2233]">
                    Set up email OTP
                  </DialogTitle>
                  <DialogDescription>
                    Send a code to your email, then enter it here to enable
                    this method.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <fetcher.Form method="post">
                    <input type="hidden" name="intent" value="email-send" />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isSubmitting}
                      className="h-10 w-full rounded-lg border-[#D1D9E6] font-semibold text-[#344256] hover:bg-[#F0F4FA]"
                    >
                      {pendingIntent === "email-send"
                        ? "Sending..."
                        : "Send code"}
                    </Button>
                  </fetcher.Form>
                  {data?.intent === "email-send" && data.errors?.form ? (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                      {data.errors.form}
                    </p>
                  ) : null}
                  {data?.intent === "email-send" && data.message ? (
                    <p className="text-sm font-medium text-[#166534]">
                      {data.message}
                    </p>
                  ) : null}
                  <fetcher.Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="email-verify" />
                    <input type="hidden" name="code" value={emailCode} />
                    <input
                      type="hidden"
                      name="trustDevice"
                      value={trustEmailDevice ? "true" : "false"}
                    />
                    <OtpCodeField
                      value={emailCode}
                      onChange={setEmailCode}
                      error={
                        data?.intent === "email-verify"
                          ? data.errors?.code
                          : undefined
                      }
                    />
                    <Label className="flex items-center gap-2 text-sm font-semibold text-[#1D283A]">
                      <Checkbox
                        checked={trustEmailDevice}
                        onCheckedChange={(checked) =>
                          setTrustEmailDevice(checked === true)
                        }
                      />
                      Trust this device
                    </Label>
                    <DialogFooter className="rounded-b-2xl">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEmailOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || emailCode.length !== 6}
                        className="bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                      >
                        {pendingIntent === "email-verify"
                          ? "Verifying..."
                          : "Enable email OTP"}
                      </Button>
                    </DialogFooter>
                  </fetcher.Form>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </MethodPanel>
      </div>

      <Dialog
        open={disableMethod !== null}
        onOpenChange={(open) => {
          if (!open) setDisableMethod(null);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-[#FFF4ED]">
              <CheckCircle2 className="size-5 text-[#F79009]" />
            </div>
            <DialogTitle className="text-center text-[#1A2233]">
              Disable{" "}
              {disableMethod === "totp" ? "authenticator app" : "email OTP"}?
            </DialogTitle>
            <DialogDescription className="text-center">
              You can enable this method again later from this page.
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form method="post">
            <input
              type="hidden"
              name="intent"
              value={disableMethod === "totp" ? "totp-disable" : "email-disable"}
            />
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
                disabled={isSubmitting}
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
