import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { Mail, Smartphone } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { FormError } from "~/routes/auth/components/form-error";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/routes/auth/components/input-otp";
import type { Oauth2faActionData } from "../services/oauth-2fa.action";

interface OAuthTwoFactorFormProps {
  methods: string[];
  // Where verifying sends the user next — the authorization request this
  // challenge interrupted, carried through as a hidden field.
  redirectTo: string;
  actionData?: Oauth2faActionData;
}

export function OAuthTwoFactorForm({
  methods,
  redirectTo,
  actionData,
}: OAuthTwoFactorFormProps) {
  const navigation = useNavigation();
  const emailAvailable = methods.includes("email") || methods.includes("otp");
  const totpAvailable = methods.includes("totp");
  const [method, setMethod] = useState<"totp" | "email">(
    totpAvailable ? "totp" : "email",
  );
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const isSubmitting = navigation.state === "submitting";
  const activeIntent = navigation.formData?.get("intent");

  return (
    <>
      <FormError message={actionData?.errors?.form} />
      {actionData?.message ? (
        <p className="rounded-lg border border-[#CFE8D8] bg-[#F0FDF4] px-3 py-2 text-xs font-medium text-[#166534]">
          {actionData.message}
        </p>
      ) : null}

      {/* Both methods always show, with whatever the account has not enabled
          disabled rather than hidden — same as the main login's step, so the
          user can see the option exists at all. */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        {(["totp", "email"] as const).map((option) => {
          const Icon = option === "totp" ? Smartphone : Mail;
          const available = option === "totp" ? totpAvailable : emailAvailable;

          return (
            <button
              key={option}
              type="button"
              disabled={!available}
              onClick={() => {
                setMethod(option);
                setCode("");
              }}
              className={`flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                method === option
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="size-4" />
              {option === "totp" ? "App" : "Email"}
            </button>
          );
        })}
      </div>

      <Form method="post" className="space-y-5 short:space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="hidden" name="method" value={method} />
        <input
          type="hidden"
          name="trustDevice"
          value={trustDevice ? "true" : "false"}
        />
        <input type="hidden" name="code" value={code} />

        <div className="space-y-2.5">
          <Label className="block text-sm font-semibold text-slate-800">
            Verification code
          </Label>
          <InputOTP
            autoFocus
            maxLength={6}
            value={code}
            onChange={setCode}
            containerClassName="justify-between"
          >
            <InputOTPGroup className="gap-2 rounded-none">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-11 rounded-lg border border-slate-200 bg-white text-lg font-semibold text-slate-900 first:rounded-lg first:border-l last:rounded-lg data-[active=true]:border-blue-500 data-[active=true]:ring-blue-500/20 short:size-10"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {actionData?.errors?.code ? (
            <p className="text-xs text-red-500">{actionData.errors.code}</p>
          ) : null}
        </div>

        <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Checkbox
            checked={trustDevice}
            onCheckedChange={(checked) => setTrustDevice(checked === true)}
            className="size-4 rounded border-slate-300 bg-white data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
          />
          Trust this device
        </Label>

        <Button
          type="submit"
          name="intent"
          value="verify"
          data-otp-submit
          disabled={isSubmitting || code.length !== 6}
          className="h-11 w-full rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 short:h-10"
        >
          {isSubmitting && activeIntent !== "send-email"
            ? "Verifying..."
            : "Verify and continue"}
        </Button>

        {method === "email" ? (
          <Button
            type="submit"
            name="intent"
            value="send-email"
            variant="link"
            disabled={isSubmitting}
            className="h-auto w-full px-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            {isSubmitting && activeIntent === "send-email"
              ? "Sending..."
              : "Send email code"}
          </Button>
        ) : null}
      </Form>
    </>
  );
}
