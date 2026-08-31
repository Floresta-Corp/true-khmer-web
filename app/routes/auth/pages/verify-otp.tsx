import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { ArrowLeft } from "lucide-react";
import { InlineMessage } from "~/routes/auth/components/inline-message";
import { Button } from "~/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/routes/auth/components/input-otp";
import {
  action as verifyOtpAction,
  loader as verifyOtpLoader,
} from "~/routes/auth/domain/verify-otp.server";
import type { VerifyOtpActionData } from "~/routes/auth/domain/auth.types";
import { Label } from "~/components/ui/label";
import { sanitizeRedirectPath } from "~/lib/redirects";
import LogoSvg from "~/components/icons/logoSvg";

export const loader = verifyOtpLoader;
export const action = verifyOtpAction;
export function meta() {
  return [{ title: "Verify OTP | True Khmer" }];
}

const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 30;
const ENVELOPE_BODY_ICON = "/icons/verify-email-envelope-body.svg";
const ENVELOPE_FLAP_ICON = "/icons/verify-email-envelope-flap.svg";

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default function VerifyOtpPage() {
  const actionData = useActionData<VerifyOtpActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const infoMessage = searchParams.get("message") || "";
  const hasInitialOtp = searchParams.get("otpSent") !== "0";
  const backTo = searchParams.get("from") === "login" ? "/login" : "/register";

  const [otp, setOtp] = useState("");
  const otpSlots = [0, 1, 2, 3, 4, 5];
  const [isOtpClientReady, setIsOtpClientReady] = useState(false);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(
    hasInitialOtp ? OTP_EXPIRY_SECONDS : 0,
  );
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);

  const submittingIntent = navigation.formData?.get("intent");
  const isResending =
    navigation.state === "submitting" && submittingIntent === "resend";
  const isVerifying =
    navigation.state === "submitting" &&
    (submittingIntent === "verify" || submittingIntent == null);
  const verificationError =
    actionData?.errors?.email ||
    actionData?.errors?.otp ||
    actionData?.errors?.form;

  useEffect(() => {
    setIsOtpClientReady(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setOtpRemainingSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
      setResendCooldownSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (actionData?.resend?.success) {
      setOtp("");
      setOtpRemainingSeconds(OTP_EXPIRY_SECONDS);
      setResendCooldownSeconds(RESEND_COOLDOWN_SECONDS);
    }
  }, [actionData]);

  const canVerify = otp.length === 6 && !isVerifying;

  return (
    <div className="min-h-dvh bg-white">
      <main className="flex min-h-dvh w-full flex-col items-center px-4 py-8 font-['Inter'] sm:px-12 sm:py-12 lg:p-24 short:py-5">
        <div className="w-full pb-12 short:pb-6">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-sm leading-5 font-semibold text-[#1C5DD4] transition-colors hover:text-[#1F62DF]"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            <span>Back</span>
          </Link>
        </div>

        <section className="flex w-full max-w-134 flex-col items-center gap-12 short:gap-7">
          <LogoSvg
            width={123}
            height={48}
            className="h-12 w-auto object-contain short:h-10"
            aria-label="True Khmer"
          />

          <div className="flex w-full flex-col items-center gap-9 short:gap-6">
            <div className="flex w-full flex-col items-center gap-6 short:gap-4">
              <div className="flex size-20 items-center justify-center rounded-full bg-[#F1F6FF] short:size-16">
                <div className="relative size-10 short:size-8">
                  <img
                    src={ENVELOPE_BODY_ICON}
                    alt=""
                    className="absolute top-[16.67%] left-[8.33%] h-[66.66%] w-[83.34%] max-w-none"
                  />
                  <img
                    src={ENVELOPE_FLAP_ICON}
                    alt=""
                    className="absolute top-[22.13%] left-[13.89%] h-[28.27%] w-[72.22%] max-w-none"
                  />
                </div>
              </div>

              <h1 className="text-center text-[2rem] leading-10 font-medium text-[#18191C] short:text-2xl short:leading-8">
                Verify Your Email Address
              </h1>

              <div className="w-full space-y-6 text-center text-base leading-6 font-normal text-[#767F8C] short:space-y-3 short:text-sm short:leading-5">
                <p>
                  A verification code has been sent to{" "}
                  <span className="font-semibold break-words text-[#18191C]">
                    {email || "your email address"}
                  </span>
                </p>

                <p>
                  Please check your inbox and enter the verification code below
                  to verify your email address. The code will expire in{" "}
                  <span className="text-xl leading-6 font-semibold text-[#333333]">
                    {formatTimer(otpRemainingSeconds)}
                  </span>
                </p>
              </div>
            </div>

            <InlineMessage
              tone="warning"
              message={
                hasInitialOtp
                  ? undefined
                  : "We could not send your code yet. Please resend."
              }
              className="mt-4 w-full"
            />

            <InlineMessage
              tone="info"
              message={infoMessage}
              className="mt-2 w-full"
            />

            <Form method="post" className="w-full">
              <input type="hidden" name="intent" value="verify" />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="redirectTo" value={redirectTo} />

              <div>
                <Label htmlFor="otp" className="sr-only">
                  OTP code
                </Label>
                {isOtpClientReady ? (
                  <InputOTP
                    id="otp"
                    name="otp"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(nextValue) => {
                      const sanitized = nextValue
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(sanitized);
                    }}
                    containerClassName="w-full justify-center"
                    className="w-full"
                  >
                    <InputOTPGroup className="w-full justify-between border-none bg-transparent p-0">
                      {otpSlots.map((index) => (
                        <InputOTPSlot
                          key={`otp-${index}`}
                          index={index}
                          className="size-12 rounded-full border border-[#DCEBFE] text-sm font-normal text-[#2E3139] first:rounded-full first:border last:rounded-full data-[active=true]:border-[#2E88F6] data-[active=true]:text-[#2E88F6] data-[active=true]:shadow-none data-[active=true]:ring-0 data-[active=true]:aria-invalid:ring-0 max-[380px]:size-10 [&_[class*='animate-caret-blink']]:bg-[#2E88F6]"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                ) : (
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => {
                      const sanitized = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(sanitized);
                    }}
                    className="h-12 w-full rounded-full border border-[#DCEBFE] px-5 text-center text-sm tracking-[0.5em] text-[#2E3139] ring-0 outline-none placeholder:text-slate-300 focus:border-[#2E88F6]"
                  />
                )}
              </div>

              {verificationError ? (
                <div className="mt-4 space-y-1">
                  <InlineMessage
                    tone="error"
                    message={actionData?.errors?.email}
                  />
                  <InlineMessage
                    tone="error"
                    message={actionData?.errors?.otp}
                  />
                  <InlineMessage
                    tone="error"
                    message={actionData?.errors?.form}
                  />
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={!canVerify}
                className="mt-9 h-10 w-full rounded-lg bg-[#F1F5F9] px-6 text-sm leading-5 font-medium text-[#1D283A] transition-colors enabled:cursor-pointer enabled:bg-[#2F6FE4] enabled:text-white enabled:hover:bg-[#1F62DF] disabled:opacity-50 short:mt-6"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </Form>

            <InlineMessage
              tone="success"
              message={
                actionData?.resend?.success ? actionData.resend.message : ""
              }
              className="mt-4 w-full"
            />

            <Form method="post" className="text-center">
              <input type="hidden" name="intent" value="resend" />
              <input type="hidden" name="email" value={email} />

              <p className="text-base leading-6 font-normal text-[#5E6670] short:text-sm">
                Didn&apos;t receive any code?{" "}
                <Button
                  type="submit"
                  disabled={!email || isResending || resendCooldownSeconds > 0}
                  variant="link"
                  className="h-auto px-0 text-base leading-6 font-medium text-[#2F6FE4] transition-colors hover:text-[#1F62DF] hover:no-underline disabled:text-slate-400 short:text-sm"
                >
                  {isResending
                    ? "Sending..."
                    : resendCooldownSeconds > 0
                      ? `Resend in ${formatTimer(resendCooldownSeconds)}`
                      : "Resend Code"}
                </Button>
              </p>
            </Form>
          </div>
        </section>
      </main>
    </div>
  );
}
