import { useState } from "react";
import { motion } from "motion/react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { Lock, Mail } from "lucide-react";
import { z } from "zod";
import { FormDivider } from "~/routes/auth/components/form-divider";
import { FormError } from "~/routes/auth/components/form-error";
import { GoogleButton } from "~/routes/auth/components/google-button";
import { InlineMessage } from "~/routes/auth/components/inline-message";
import { AuthPageShell } from "~/routes/auth/components/page-shell";
import { PasswordField } from "~/routes/auth/components/password-field";
import {
  action as loginAction,
  loader as loginLoader,
} from "~/routes/auth/domain/login.server";
import type { LoginActionData } from "~/routes/auth/domain/auth.types";
import { Button } from "~/components/ui/button";
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
  const [clientErrors, setClientErrors] = useState<LoginFieldErrors>({});
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
    <AuthPageShell>
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
        className="mt-6 space-y-5 lg:mt-8 lg:space-y-6 xl:mt-18 xl:space-y-8"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <img
            src="/logofullcolor.svg"
            alt="True Khmer"
            className="mx-auto h-9 w-auto object-contain sm:h-10"
          />
        </motion.div>

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-center text-3xl font-semibold leading-8 text-[#030213]"
        >
          Welcome Back
        </motion.h1>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <GoogleButton />
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <FormDivider />
        </motion.div>

        <InlineMessage tone="success" message={successMessage} />
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

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-[13px] font-semibold leading-[19.5px] text-[#364153]"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D1D5DC]"
                />
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
                  className="h-11 rounded-lg border-transparent bg-[#F8FAFC] py-2 pl-9 pr-3 text-[12.25px] font-medium text-[#1E293B] placeholder:text-[#C8D6E5] focus-visible:ring-[#2F6FE4]/30 transition-shadow duration-200"
                />
              </div>
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
                icon={Lock}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  const nextPassword = event.target.value;
                  setPassword(nextPassword);
                  validateCurrentValues({ email, password: nextPassword });
                }}
                placeholder="••••••••"
                error={clientErrors.password ?? actionData?.errors?.password}
              />
            </div>
            <div className="flex justify-end">
              <Button
                asChild
                variant="link"
                className="h-auto px-0 text-[13px] font-semibold leading-4 text-[#2F6FE4] hover:text-[#1F62DF]"
              >
                <Link to="/forgot-password">Forgot password?</Link>
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`h-10 w-full rounded-lg text-sm font-medium transition-all duration-300 ${"bg-[#2F6FE4] text-white hover:bg-[#1F62DF] hover:shadow-md hover:-translate-y-0.5"}`}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </Form>
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center text-sm font-medium leading-5 text-[#6A7282]"
        >
          New to True Khmer?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#2F6FE4] hover:underline transition-all"
          >
            Create account
          </Link>
        </motion.p>
      </motion.div>
    </AuthPageShell>
  );
}
