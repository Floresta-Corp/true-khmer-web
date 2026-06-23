import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { Shield } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormError } from "~/routes/auth/components/form-error";
import {
  AuthBrandPanel,
  AuthPageShell,
} from "~/routes/auth/components/page-shell";
import { PasswordField } from "~/routes/auth/components/password-field";
import {
  adminLoginAction,
  type AdminLoginActionData,
} from "../service/admin-login.action";
import { adminLoginLoader } from "../service/admin-login.loader";

export const loader = adminLoginLoader;
export const action = adminLoginAction;

function formatCooldown(seconds: number) {
  if (seconds <= 0) return "a moment";
  if (seconds === 1) return "1 second";
  return `${seconds} seconds`;
}

const noticeMessages: Record<string, string> = {
  moderator_invite_accepted:
    "Your moderator account has been created. Sign in to continue.",
};

export default function AdminLoginPage() {
  const actionData = useActionData<AdminLoginActionData>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const notice = searchParams.get("notice");
  const noticeMessage = notice ? noticeMessages[notice] : undefined;
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const isSubmitting = navigation.state === "submitting";
  const isCoolingDown = cooldownSeconds > 0;

  useEffect(() => {
    setCooldownSeconds(actionData?.retryAfterSeconds ?? 0);
  }, [actionData?.retryAfterSeconds]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timeoutId = window.setTimeout(() => {
      setCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [cooldownSeconds]);

  return (
    <AuthPageShell
      backTo="/"
      backLabel="Back to Home"
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
              Admin Access
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-9 text-[#111827]">
            Admin Sign In
          </h1>
          <p className="text-base font-normal leading-6 text-[#4B5563]">
            Sign in with your admin credentials to receive a verification code.
          </p>
        </motion.header>

        <FormError message={actionData?.errors?.form} />
        {noticeMessage ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {noticeMessage}
          </p>
        ) : null}
        {isCoolingDown ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Try again in {formatCooldown(cooldownSeconds)}.
          </p>
        ) : null}

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Form method="post" className="space-y-6">
            {redirectTo ? (
              <input type="hidden" name="redirectTo" value={redirectTo} />
            ) : null}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-semibold leading-5 text-[#111827]"
              >
                Email Address
              </Label>
              <Input
                autoFocus
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="h-12 rounded-lg border-[#E5E7EB] bg-white px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-[#6B7280] focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
              />
              {actionData?.errors?.email ? (
                <p className="text-xs text-red-500">
                  {actionData.errors.email}
                </p>
              ) : null}
            </div>

            <PasswordField
              id="password"
              name="password"
              label="Password"
              showToggle={true}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              error={actionData?.errors?.password}
              labelClassName="text-sm font-semibold leading-5 text-[#111827]"
              inputClassName="h-12 rounded-lg border-[#E5E7EB] bg-white px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-[#6B7280] focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
            />

            <label className="flex items-center gap-3 text-sm font-medium text-[#374151]">
              <input
                type="checkbox"
                name="rememberMe"
                value="true"
                className="h-4 w-4 rounded border-[#D1D5DB] text-[#2F6FE4] focus:ring-[#2F6FE4]"
              />
              Remember this admin session
            </label>

            <Button
              type="submit"
              disabled={isSubmitting || isCoolingDown || !email || !password}
              className="h-10 w-full rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
            >
              {isSubmitting
                ? "Sending code..."
                : isCoolingDown
                  ? "Please wait"
                  : "Continue"}
            </Button>
          </Form>
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center text-sm font-normal leading-5 text-[#4B5563]"
        >
          Not an admin?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#1C5DD4] transition-colors hover:text-[#164CB0]"
          >
            Sign in as a user
          </Link>
        </motion.p>
      </motion.div>
    </AuthPageShell>
  );
}
