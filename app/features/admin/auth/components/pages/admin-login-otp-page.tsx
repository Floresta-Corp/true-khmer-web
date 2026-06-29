import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router";
import { KeyRound, Shield } from "lucide-react";

import { Button } from "~/components/ui/button";
import { FormError } from "~/routes/auth/components/form-error";
import {
  AuthBrandPanel,
  AuthPageShell,
} from "~/routes/auth/components/page-shell";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/routes/auth/components/input-otp";
import type { AdminOtpActionData, AdminOtpLoaderData } from "../../types";

function formatRemainingTime(ms: number) {
  const totalSeconds = Math.max(Math.ceil(ms / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function AdminLoginOtpPage() {
  const loaderData = useLoaderData<AdminOtpLoaderData>();
  const actionData = useActionData<AdminOtpActionData>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [otp, setOtp] = useState("");
  const loginHref = useMemo(
    () =>
      `/tk-admin/login?redirectTo=${encodeURIComponent(loaderData.redirectTo)}`,
    [loaderData.redirectTo],
  );
  const expiresAtMs = useMemo(
    () => new Date(loaderData.expiresAt).getTime(),
    [loaderData.expiresAt],
  );
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(expiresAtMs - Date.now(), 0),
  );
  const isSubmitting = navigation.state === "submitting";
  const isExpired = remainingMs <= 0;
  const challengeExhausted = actionData?.challengeExhausted === true;
  const formDisabled = isSubmitting || isExpired || challengeExhausted;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingMs(Math.max(expiresAtMs - Date.now(), 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiresAtMs]);

  useEffect(() => {
    if (!isExpired || challengeExhausted) return;

    const timeoutId = window.setTimeout(() => {
      navigate(loginHref, { replace: true });
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [challengeExhausted, isExpired, loginHref, navigate]);

  return (
    <AuthPageShell
      backTo="/tk-admin/login"
      backLabel="Back to Admin Sign In"
      leftSectionClassName="items-start justify-center px-6 py-10 sm:px-10 lg:px-8 lg:py-0 xl:px-12"
      contentClassName="max-w-md pb-10 pt-20 lg:pt-36 xl:pt-40"
      backLinkClassName="left-6 top-8 text-sm font-semibold normal-case tracking-normal text-[#1C5DD4] hover:text-[#164CB0] sm:left-10 lg:left-1/2 lg:top-16 lg:-translate-x-56 xl:top-24"
      backIconClassName="h-auto w-auto rounded-none border-0"
      rightPanelContent={<AuthBrandPanel />}
      rightPanelContentClassName="items-stretch justify-stretch text-left"
      showRightPanelOverlay={false}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.04, delayChildren: 0 },
          },
        }}
        className="space-y-8"
      >
        <motion.header
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-[#1C5DD4]">
            <Shield className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Admin Verification
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-9 text-[#111827]">
            Enter the OTP Code
          </h1>
          <p className="text-base font-normal leading-6 text-[#4B5563]">
            We sent a six-digit code to the admin email address.
          </p>
        </motion.header>

        <div className="flex items-center gap-3 rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3 text-sm font-medium text-[#1E40AF]">
          <KeyRound className="h-5 w-5" />
          <span>
            {challengeExhausted
              ? "This code can no longer be used."
              : isExpired
              ? "This code has expired."
              : `Code expires in ${formatRemainingTime(remainingMs)}.`}
          </span>
        </div>

        <FormError message={actionData?.errors?.form} />
        {challengeExhausted || isExpired ? (
          <Link
            to={loginHref}
            replace
            className="block rounded-lg border border-[#BFDBFE] bg-white px-4 py-3 text-center text-sm font-semibold text-[#1C5DD4] transition-colors hover:bg-[#EFF6FF]"
          >
            Return to admin sign in
          </Link>
        ) : null}

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Form method="post" className="space-y-6">
            <input type="hidden" name="redirectTo" value={loaderData.redirectTo} />

            <div className="space-y-3">
              <InputOTP
                maxLength={6}
                name="otp"
                value={otp}
                onChange={setOtp}
                pattern="^[0-9]*$"
                inputMode="numeric"
                autoFocus
                containerClassName="justify-center"
                disabled={formDisabled}
              >
                <InputOTPGroup className="gap-2 border-0">
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-12 w-11 rounded-lg border border-[#E5E7EB] bg-white text-lg font-semibold text-[#111827]"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {actionData?.errors?.otp ? (
                <p className="text-center text-xs text-red-500">
                  {actionData.errors.otp}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={formDisabled || otp.length !== 6}
              className="h-10 w-full rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
            >
              {isSubmitting
                ? "Verifying..."
                : challengeExhausted || isExpired
                  ? "Sign in again"
                  : "Verify and Sign In"}
            </Button>
          </Form>
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center text-sm font-normal leading-5 text-[#4B5563]"
        >
          Need a new code?{" "}
          <Link
            to={loginHref}
            className="font-semibold text-[#1C5DD4] transition-colors hover:text-[#164CB0]"
          >
            Sign in again
          </Link>
        </motion.p>
      </motion.div>
    </AuthPageShell>
  );
}
