import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useFetcher, useNavigate } from "react-router";
import QRCode from "qrcode";
import { KeyRound } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { showActionSuccessToast } from "~/components/notification-toast";
import { OtpCodeField } from "./OtpCodeField";
import { SetupActions, TwoFASetupLayout } from "./TwoFASetupLayout";
import type { SettingsActionData } from "../types";
import type { AuthTwoFactorTotpSetupResponse } from "~/types/api-client";

type TotpSetupStep = "password" | "qr" | "verify";

const STEPS: Record<TotpSetupStep, { current: number; label: string }> = {
  password: { current: 1, label: "Confirm your password" },
  qr: { current: 2, label: "Scan the QR code" },
  verify: { current: 3, label: "Enter the 6-digit code" },
};

const primaryButton =
  "h-11 w-full rounded-lg bg-[#2F6FE4] font-semibold text-white hover:bg-[#1F62DF]";
const secondaryButton =
  "h-11 w-full rounded-lg border-[#D1D9E6] font-semibold text-[#344256] hover:bg-[#F0F4FA]";

function AuthenticatorQrCode({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(canvas, value, {
      width: 200,
      margin: 1,
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    });
  }, [value]);

  return (
    <div className="flex justify-center rounded-xl border border-[#E5EAF2] bg-white p-4">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="size-50 rounded-lg"
        aria-label="Authenticator app setup QR code"
      />
    </div>
  );
}

export function AuthenticatorSetupView({ enabled }: { enabled: boolean }) {
  const fetcher = useFetcher<SettingsActionData>();
  const navigate = useNavigate();
  // The TOTP secret only exists in the action response, so a refresh
  // intentionally restarts setup from the password step.
  const [totpSetup, setTotpSetup] =
    useState<AuthTwoFactorTotpSetupResponse | null>(null);
  const [step, setStep] = useState<TotpSetupStep>("password");
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const data = fetcher.data;
  const pendingIntent = fetcher.formData?.get("intent")?.toString();
  const isSubmitting = fetcher.state !== "idle";
  const verified = data?.ok && data.intent === "totp-verify";
  const currentStep = totpSetup ? step : "password";

  useEffect(() => {
    if (data?.setup) {
      setTotpSetup(data.setup);
      setStep("qr");
    }
    if (data?.ok && data.intent === "totp-verify") {
      showActionSuccessToast(data.message ?? "Authenticator app is enabled.");
      navigate("/settings/2fa", { replace: true });
    }
  }, [data, navigate]);

  if (enabled && !verified) {
    return <Navigate to="/settings/2fa" replace />;
  }

  return (
    <TwoFASetupLayout
      title="Set up authenticator app"
      description="Use an app such as Google Authenticator, Authy, or 1Password to generate sign-in codes."
      step={{ ...STEPS[currentStep], total: 3 }}
    >
      {currentStep === "password" || !totpSetup ? (
        <fetcher.Form method="post" className="space-y-6">
          <input type="hidden" name="intent" value="totp-setup" />
          <div className="space-y-2">
            <Label
              htmlFor="totp-password"
              className="text-sm font-semibold text-[#1A2233]"
            >
              Current password
            </Label>
            <Input
              id="totp-password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              className="h-11 border-[#E5EAF2] bg-white"
            />
            {data?.intent === "totp-setup" && data.errors?.password ? (
              <p className="text-xs text-red-500">{data.errors.password}</p>
            ) : null}
            {data?.intent === "totp-setup" && data.errors?.form ? (
              <p className="text-xs text-red-500">{data.errors.form}</p>
            ) : null}
          </div>
          <SetupActions>
            <Button asChild variant="outline" className={secondaryButton}>
              <Link to="/settings/2fa">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={primaryButton}
            >
              {pendingIntent === "totp-setup" ? "Checking..." : "Continue"}
            </Button>
          </SetupActions>
        </fetcher.Form>
      ) : currentStep === "qr" ? (
        <div className="space-y-6">
          <AuthenticatorQrCode value={totpSetup.totpURI} />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A2233]">
              <KeyRound className="size-4 text-[#2F6FE4]" />
              Can&apos;t scan? Enter this setup key
            </div>
            <p className="rounded-lg border border-[#E5EAF2] bg-[#F8FAFC] px-3 py-2 font-mono text-xs leading-5 break-all text-[#5C6B82]">
              {totpSetup.totpURI}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#1A2233]">Backup codes</p>
            <p className="text-xs leading-5 text-[#6B7A99]">
              Save these somewhere safe. Each code signs you in once if you lose
              your device.
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#E5EAF2] bg-[#F8FAFC] p-3">
              {totpSetup.backupCodes.map((backupCode) => (
                <code
                  key={backupCode}
                  className="text-center font-mono text-xs font-semibold text-[#1A2233]"
                >
                  {backupCode}
                </code>
              ))}
            </div>
          </div>
          <SetupActions>
            <Button asChild variant="outline" className={secondaryButton}>
              <Link to="/settings/2fa">Cancel</Link>
            </Button>
            <Button
              type="button"
              className={primaryButton}
              onClick={() => setStep("verify")}
            >
              Next
            </Button>
          </SetupActions>
        </div>
      ) : (
        <fetcher.Form method="post" className="space-y-6">
          <input type="hidden" name="intent" value="totp-verify" />
          <input type="hidden" name="code" value={code} />
          <input
            type="hidden"
            name="trustDevice"
            value={trustDevice ? "true" : "false"}
          />
          <OtpCodeField
            value={code}
            onChange={setCode}
            error={
              data?.intent === "totp-verify" ? data.errors?.code : undefined
            }
          />
          <Label className="flex items-center gap-2 text-sm font-medium text-[#1D283A]">
            <Checkbox
              checked={trustDevice}
              onCheckedChange={(checked) => setTrustDevice(checked === true)}
            />
            Trust this device
          </Label>
          {data?.intent === "totp-verify" && data.errors?.form ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {data.errors.form}
            </p>
          ) : null}
          <SetupActions>
            <Button
              type="button"
              variant="outline"
              className={secondaryButton}
              onClick={() => setStep("qr")}
            >
              Back
            </Button>
            <Button
              type="submit"
              data-otp-submit
              disabled={isSubmitting || code.length !== 6}
              className={primaryButton}
            >
              {pendingIntent === "totp-verify" ? "Verifying..." : "Enable"}
            </Button>
          </SetupActions>
        </fetcher.Form>
      )}
    </TwoFASetupLayout>
  );
}
