import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { FormError } from "~/routes/auth/components/form-error";
import { PasswordField } from "~/routes/auth/components/password-field";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { OAuthLoginActionData } from "../types";

export function OAuthLoginForm() {
  const actionData = useActionData<OAuthLoginActionData>();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <FormError message={actionData?.errors?.form} />

      <Form method="post" className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-slate-800"
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
            className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
          {actionData?.errors?.email ? (
            <p className="text-xs text-red-500">{actionData.errors.email}</p>
          ) : null}
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          showToggle
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          error={actionData?.errors?.password}
          labelClassName="text-sm font-semibold text-slate-800"
          inputClassName="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
        />

        <Button
          type="submit"
          disabled={isSubmitting || !email || !password}
          className="h-11 w-full rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </Form>
    </>
  );
}
