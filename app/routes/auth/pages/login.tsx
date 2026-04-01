import { useState } from "react";
import { Form, Link, useActionData, useSearchParams } from "react-router";
import { Lock, Mail } from "lucide-react";
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

export const loader = loginLoader;
export const action = loginAction;
export function meta() {
  return [{ title: "Login | True Khmer" }];
}

export default function LoginPage() {
  const actionData = useActionData<LoginActionData>();
  const [searchParams] = useSearchParams();
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const successMessage = searchParams.get("message") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSignInEnabled = email.trim() !== "" && password.trim() !== "";

  return (
    <AuthPageShell>
      <div className="mt-6 space-y-5 lg:mt-8 lg:space-y-6 xl:mt-18 xl:space-y-8">
        <img
          src="/logofullcolor.svg"
          alt="True Khmer"
          className="mx-auto h-9 w-auto object-contain sm:h-10"
        />

        <h1 className="text-center text-3xl font-semibold leading-8 text-[#030213]">
          Welcome Back
        </h1>

        <GoogleButton />

        <FormDivider />

        <InlineMessage tone="success" message={successMessage} />
        <FormError message={actionData?.errors?.form} />

        <Form method="post" className="space-y-6">
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
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="h-11 rounded-lg border-transparent bg-[#F8FAFC] py-2 pl-9 pr-3 text-[12.25px] font-medium text-[#1E293B] placeholder:text-[#C8D6E5] focus-visible:ring-[#2F6FE4]/30"
              />
            </div>
            {actionData?.errors?.email ? (
              <p className="text-xs text-red-500">{actionData.errors.email}</p>
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
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              error={actionData?.errors?.password}
            />

            <div className="flex justify-end">
              <Button
                asChild
                variant="link"
                className="h-auto px-0 text-[13px] font-semibold leading-4 text-[#2F6FE4] hover:text-[#1F62DF]"
              >
                <Link to="/forgot-password">Forgot password?</Link>
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isSignInEnabled}
            className={`h-10 w-full rounded-lg text-sm font-medium transition-colors ${
              isSignInEnabled
                ? "bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                : "cursor-not-allowed bg-[#F1F5F9] text-[#0F172B] opacity-50"
            }`}
          >
            Sign in
          </Button>
        </Form>

        <p className="text-center text-sm font-medium leading-5 text-[#6A7282]">
          New to True Khmer?{" "}
          <Link to="/register" className="font-semibold text-[#2F6FE4]">
            Create account
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
