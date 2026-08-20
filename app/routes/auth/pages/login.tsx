import { useState } from "react";
import { motion } from "motion/react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { z } from "zod";
import { FormDivider } from "~/routes/auth/components/form-divider";
import { FormError } from "~/routes/auth/components/form-error";
import { GoogleAuthButton } from "~/routes/auth/components/google-auth-button";
import { InlineMessage } from "~/routes/auth/components/inline-message";
import {
  AuthBrandPanel,
  AuthPageShell,
} from "~/routes/auth/components/page-shell";
import { PasswordField } from "~/routes/auth/components/password-field";
import {
  action as loginAction,
  loader as loginLoader,
} from "~/routes/auth/domain/login.server";
import type { LoginActionData } from "~/routes/auth/domain/auth.types";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { sanitizeRedirectPath } from "~/lib/redirects";

const LOGIN_NOTICE_MESSAGES = {
  reset_password_success: "Password reset completed successfully.",
} as const;

export const loader = loginLoader;
export const action = loginAction;

const loginFormSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email is required"),
  password: z.string().trim().min(1, "Password is required"),
});

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

function getLoginFieldErrors(values: {
  email: string;
  password: string;
}): LoginFieldErrors {
  const parsed = loginFormSchema.safeParse(values);
  if (parsed.success) {
    return {};
  }

  const errors: LoginFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (field === "email" && !errors.email) {
      errors.email = issue.message;
    }
    if (field === "password" && !errors.password) {
      errors.password = issue.message;
    }
  }

  return errors;
}

export function meta() {
  return [{ title: "Login | True Khmer" }];
}

export default function LoginPage() {
  const actionData = useActionData<LoginActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const notice = searchParams.get("notice");
  const successMessage = notice
    ? (LOGIN_NOTICE_MESSAGES[notice as keyof typeof LOGIN_NOTICE_MESSAGES] ??
      "")
    : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [clientErrors, setClientErrors] = useState<LoginFieldErrors>({});
  const [googleError, setGoogleError] = useState("");
  const isSubmitting = navigation.state === "submitting";
  const isFormValid = loginFormSchema.safeParse({ email, password }).success;

  function validateCurrentValues(nextValues?: {
    email: string;
    password: string;
  }) {
    const values = nextValues ?? { email, password };
    const errors = getLoginFieldErrors(values);
    setClientErrors(errors);
    return errors;
  }

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
          <h1 className="text-3xl leading-9 font-bold text-[#111827]">
            Welcome Back
          </h1>
          <p className="text-base leading-6 font-normal text-[#4B5563]">
            Please enter your details to sign in.
          </p>
        </motion.header>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <GoogleAuthButton
            className="h-12 rounded-lg border-[#E5E7EB] bg-white px-4 py-3 text-base font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB]"
            redirectTo={redirectTo}
            onError={setGoogleError}
          />
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <FormDivider
            label="or"
            className="py-4"
            lineClassName="bg-[#E5E7EB]"
            labelClassName="text-sm font-normal normal-case tracking-normal text-[#4B5563]"
          />
        </motion.div>

        <InlineMessage tone="success" message={successMessage} />
        <FormError message={googleError} />
        <FormError message={actionData?.errors?.form} />

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Form
            method="post"
            className="space-y-6"
            onSubmit={(event) => {
              const errors = validateCurrentValues();
              if (errors.email || errors.password) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input
              type="hidden"
              name="rememberMe"
              value={rememberMe ? "true" : "false"}
            />

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm leading-5 font-semibold text-[#111827]"
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
                onChange={(event) => {
                  const nextEmail = event.target.value;
                  setEmail(nextEmail);
                  validateCurrentValues({ email: nextEmail, password });
                }}
                placeholder="name@example.com"
                className="h-12 rounded-lg border-[#E5E7EB] bg-white px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-[#6B7280] focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
              />
              {clientErrors.email || actionData?.errors?.email ? (
                <p className="text-xs text-red-500">
                  {clientErrors.email ?? actionData?.errors?.email}
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
                onChange={(event) => {
                  const nextPassword = event.target.value;
                  setPassword(nextPassword);
                  validateCurrentValues({ email, password: nextPassword });
                }}
                placeholder="••••••••"
                error={clientErrors.password ?? actionData?.errors?.password}
                labelClassName="text-sm font-semibold leading-5 text-[#111827]"
                inputClassName="h-12 rounded-lg border-[#E5E7EB] bg-white px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-[#6B7280] focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label className="flex items-center gap-2 text-sm leading-5 font-semibold text-[#1D283A]">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="size-4 rounded border-[#E8E8E8] bg-white data-[state=checked]:border-[#2F6FE4] data-[state=checked]:bg-[#2F6FE4]"
                />
                Remember me
              </Label>

              <Button
                asChild
                variant="link"
                className="group h-auto px-0 text-sm leading-5 font-semibold text-[#1C5DD4] no-underline transition-colors duration-200 hover:text-[#164CB0] hover:no-underline"
              >
                <Link to="/forgot-password">
                  <span className="relative">
                    Forgot password?
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-center scale-x-0 rounded-full bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"
                    />
                  </span>
                </Link>
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="h-10 w-full rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </Form>
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center text-sm leading-5 font-normal text-[#4B5563]"
        >
          New to True Khmer?{" "}
          <Link
            to="/register"
            className="group font-semibold text-[#1C5DD4] no-underline transition-colors duration-200 hover:text-[#164CB0] hover:no-underline"
          >
            <span className="relative">
              Join the community
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 h-px w-full origin-center scale-x-0 rounded-full bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"
              />
            </span>
          </Link>
        </motion.p>
      </motion.div>
    </AuthPageShell>
  );
}
