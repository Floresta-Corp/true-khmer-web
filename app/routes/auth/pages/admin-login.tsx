import { useState } from "react";
import { motion } from "motion/react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { Shield } from "lucide-react";
import { FormError } from "~/routes/auth/components/form-error";
import {
  AuthPageShell,
  AuthBrandPanel,
} from "~/routes/auth/components/page-shell";
import { PasswordField } from "~/routes/auth/components/password-field";
import {
  action as adminLoginAction,
  loader as adminLoginLoader,
} from "~/routes/auth/domain/admin-login.server";
import type { AdminLoginActionData } from "~/routes/auth/domain/admin-login.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const loader = adminLoginLoader;
export const action = adminLoginAction;

export default function AdminLoginPage() {
  const actionData = useActionData<AdminLoginActionData>();

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSubmitting = navigation.state === "submitting";

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
            transition: {
              staggerChildren: 0.04,
              delayChildren: 0,
            },
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
            Sign in with your admin credentials to access the admin panel.
          </p>
        </motion.header>

        <FormError message={actionData?.errors?.form} />

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

            <div className="space-y-2">
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
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="h-10 w-full rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In as Admin"}
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
