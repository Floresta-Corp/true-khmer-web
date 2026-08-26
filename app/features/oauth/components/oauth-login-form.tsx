import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useActionData, useNavigation, useSubmit } from "react-router";
import { FormError } from "~/routes/auth/components/form-error";
import { PasswordField } from "~/routes/auth/components/password-field";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { OAuthLoginActionData } from "../types";
import {
  oauthLoginSchema,
  type OAuthLoginFormValues,
} from "../lib/oauth-login-schema";

export function OAuthLoginForm() {
  const actionData = useActionData<OAuthLoginActionData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OAuthLoginFormValues>({
    resolver: zodResolver(oauthLoginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onValid = () => {
    if (formRef.current) submit(formRef.current);
  };

  return (
    <>
      <FormError message={actionData?.errors?.form} />

      <Form
        method="post"
        className="space-y-4"
        ref={formRef}
        noValidate
        onSubmit={handleSubmit(onValid)}
      >
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
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
            {...register("email")}
          />
          {(errors.email?.message ?? actionData?.errors?.email) ? (
            <p className="text-xs text-red-500">
              {errors.email?.message ?? actionData?.errors?.email}
            </p>
          ) : null}
        </div>

        <PasswordField
          id="password"
          label="Password"
          showToggle
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message ?? actionData?.errors?.password}
          labelClassName="text-sm font-semibold text-slate-800"
          inputClassName="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </Form>
    </>
  );
}
