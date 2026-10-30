import { useEffect, useState } from "react";
import { Link, Navigate, useFetcher, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { showActionSuccessToast } from "~/components/notification-toast";
import { OtpCodeField } from "./OtpCodeField";
import { OtpCountdown } from "./OtpCountdown";
import { SetupActions, TwoFASetupLayout } from "./TwoFASetupLayout";
import type { SettingsActionData } from "../types";

export function EmailOtpSetupView({
  email,
  enabled,
}: {
  email: string;
  enabled: boolean;
}) {
  const fetcher = useFetcher<SettingsActionData>();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  // Kept in state so a failed verify (which replaces fetcher.data) doesn't
  // drop the countdown for the code that is still in the user's inbox.
  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(null);
  const [totalMs, setTotalMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const data = fetcher.data;
  const pendingIntent = fetcher.formData?.get("intent")?.toString();
  const isSubmitting = fetcher.state !== "idle";
  const verified = data?.ok && data.intent === "email-verify";
  const codeSent = data?.ok && data.intent === "email-send";
  const isExpired = expiresAtMs !== null && remainingMs <= 0;

  useEffect(() => {
    if (data?.ok && data.intent === "email-send" && data.expiresInMs) {
      setExpiresAtMs(Date.now() + data.expiresInMs);
      setTotalMs(data.expiresInMs);
    }
    // The server is the source of truth: end the countdown even if it still
    // had time left on this device.
    if (data?.codeExpired) {
      setExpiresAtMs(Date.now());
      setCode("");
    }
  }, [data]);

  useEffect(() => {
    if (expiresAtMs === null) return;

    const tick = () => setRemainingMs(Math.max(expiresAtMs - Date.now(), 0));
    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiresAtMs]);

  useEffect(() => {
    if (data?.ok && data.intent === "email-verify") {
      showActionSuccessToast(data.message ?? "Email OTP is enabled.");
      navigate("/settings/2fa", { replace: true });
    }
  }, [data, navigate]);

  if (enabled && !verified) {
    return <Navigate to="/settings/2fa" replace />;
  }

  return (
    <TwoFASetupLayout
      title="Set up email OTP"
      description={`We'll send a 6-digit code to ${email}. Enter it below to turn on email verification.`}
    >
      <fetcher.Form method="post" className="space-y-2">
        <input type="hidden" name="intent" value="email-send" />
        <Button
          type="submit"
          variant="outline"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg border-[#D1D9E6] font-semibold text-[#344256] hover:bg-[#F0F4FA]"
        >
          {pendingIntent === "email-send"
            ? "Sending..."
            : codeSent || expiresAtMs !== null
              ? "Resend code"
              : "Send code"}
        </Button>
        {data?.intent === "email-send" && data.errors?.form ? (
          <p className="text-xs text-red-500">{data.errors.form}</p>
        ) : null}
        {codeSent && data.message ? (
          <p className="text-xs font-medium text-[#166534]">{data.message}</p>
        ) : null}
      </fetcher.Form>

      <fetcher.Form method="post" className="space-y-6">
        <input type="hidden" name="intent" value="email-verify" />
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
            data?.intent === "email-verify" ? data.errors?.code : undefined
          }
        />
        {expiresAtMs !== null ? (
          <OtpCountdown remainingMs={remainingMs} totalMs={totalMs} />
        ) : null}
        <Label className="flex items-center gap-2 text-sm font-medium text-[#1D283A]">
          <Checkbox
            checked={trustDevice}
            onCheckedChange={(checked) => setTrustDevice(checked === true)}
          />
          Trust this device
        </Label>
        {data?.intent === "email-verify" && data.errors?.form ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {data.errors.form}
          </p>
        ) : null}
        <SetupActions>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-lg border-[#D1D9E6] font-semibold text-[#344256] hover:bg-[#F0F4FA]"
          >
            <Link to="/settings/2fa">Cancel</Link>
          </Button>
          <Button
            type="submit"
            data-otp-submit
            disabled={isSubmitting || isExpired || code.length !== 6}
            className="h-11 w-full rounded-lg bg-[#2F6FE4] font-semibold text-white hover:bg-[#1F62DF]"
          >
            {pendingIntent === "email-verify" ? "Verifying..." : "Enable"}
          </Button>
        </SetupActions>
      </fetcher.Form>
    </TwoFASetupLayout>
  );
}
