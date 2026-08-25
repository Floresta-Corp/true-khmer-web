import { useMemo, useState } from "react";
import { ShieldCheck, Mail, Smartphone } from "lucide-react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { FormError } from "~/routes/auth/components/form-error";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/routes/auth/components/input-otp";
import {
  AuthBrandPanel,
  AuthPageShell,
} from "~/routes/auth/components/page-shell";
import {
  action as loginTwoFactorAction,
  loader as loginTwoFactorLoader,
  type LoginTwoFactorActionData,
} from "~/routes/auth/domain/login-2fa.server";
import { sanitizeRedirectPath } from "~/lib/redirects";

export const loader = loginTwoFactorLoader;
export const action = loginTwoFactorAction;

export function meta() {
  return [{ title: "Two-factor verification | True Khmer" }];
}

export default function LoginTwoFactorPage() {
  const { methods, expiresAt } = useLoaderData<typeof loader>();
  const actionData = useActionData<LoginTwoFactorActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const emailAvailable = methods.includes("email") || methods.includes("otp");
  const totpAvailable = methods.includes("totp");
  const [method, setMethod] = useState<"totp" | "email">(
    totpAvailable ? "totp" : "email",
  );
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const isSubmitting = navigation.state === "submitting";
  const activeIntent = navigation.formData?.get("intent");
  const expiresAtLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(expiresAt)),
    [expiresAt],
  );

  return (
    <AuthPageShell
      backTo="/login"
      backLabel="Back to Login"
      leftSectionClassName="items-start justify-center px-6 py-10 sm:px-10 lg:px-8 lg:py-0 xl:px-12"
      contentClassName="max-w-md pb-10 pt-20 lg:pt-36 xl:pt-40"
      backLinkClassName="left-6 top-8 text-sm font-semibold normal-case tracking-normal text-[#1C5DD4] hover:text-[#164CB0] sm:left-10 lg:left-1/2 lg:top-16 lg:-translate-x-56 xl:top-24"
      backIconClassName="h-auto w-auto rounded-none border-0"
      rightPanelContent={<AuthBrandPanel />}
      rightPanelContentClassName="items-stretch justify-stretch text-left"
      showRightPanelOverlay={false}
    >
      <div className="space-y-8">
        <header className="space-y-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#EEF3FD]">
            <ShieldCheck className="size-6 text-[#2F6FE4]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl leading-9 font-bold text-[#111827]">
              Verify your sign in
            </h1>
            <p className="text-base leading-6 font-normal text-[#4B5563]">
              Enter a 6-digit code to finish signing in. This challenge expires
              at {expiresAtLabel}.
            </p>
          </div>
        </header>

        <FormError message={actionData?.errors?.form} />
        {actionData?.message ? (
          <p className="rounded-lg border border-[#CFE8D8] bg-[#F0FDF4] px-3 py-2 text-sm font-medium text-[#166534]">
            {actionData.message}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F3F6FB] p-1">
          <button
            type="button"
            disabled={!totpAvailable}
            onClick={() => {
              setMethod("totp");
              setCode("");
            }}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              method === "totp"
                ? "bg-white text-[#111827] shadow-sm"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Smartphone className="size-4" />
            App
          </button>
          <button
            type="button"
            disabled={!emailAvailable}
            onClick={() => {
              setMethod("email");
              setCode("");
            }}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              method === "email"
                ? "bg-white text-[#111827] shadow-sm"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Mail className="size-4" />
            Email
          </button>
        </div>

        <Form method="post" className="space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input type="hidden" name="method" value={method} />
          <input
            type="hidden"
            name="trustDevice"
            value={trustDevice ? "true" : "false"}
          />
          <input type="hidden" name="code" value={code} />

          <div className="space-y-3">
            <Label className="block text-sm leading-5 font-semibold text-[#111827]">
              Verification code
            </Label>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              containerClassName="justify-between"
              inputMode="numeric"
              pattern="[0-9]*"
            >
              <InputOTPGroup className="gap-2 rounded-none">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-12 rounded-lg border border-[#E5E7EB] bg-white text-lg font-semibold text-[#111827] first:rounded-lg first:border-l last:rounded-lg data-[active=true]:border-[#2F6FE4] data-[active=true]:ring-[#2F6FE4]/20"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {actionData?.errors?.code ? (
              <p className="text-xs text-red-500">{actionData.errors.code}</p>
            ) : null}
          </div>

          <Label className="flex items-center gap-2 text-sm leading-5 font-semibold text-[#1D283A]">
            <Checkbox
              checked={trustDevice}
              onCheckedChange={(checked) => setTrustDevice(checked === true)}
              className="size-4 rounded border-[#E8E8E8] bg-white data-[state=checked]:border-[#2F6FE4] data-[state=checked]:bg-[#2F6FE4]"
            />
            Trust this device
          </Label>

          <Button
            type="submit"
            name="intent"
            value="verify"
            disabled={isSubmitting || code.length !== 6}
            className="h-10 w-full rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
          >
            {isSubmitting && activeIntent !== "send-email"
              ? "Verifying..."
              : "Verify and sign in"}
          </Button>

          {method === "email" ? (
            <Button
              type="submit"
              name="intent"
              value="send-email"
              variant="link"
              disabled={isSubmitting}
              className="h-auto w-full px-0 text-sm leading-5 font-semibold text-[#1C5DD4] hover:text-[#164CB0]"
            >
              {isSubmitting && activeIntent === "send-email"
                ? "Sending..."
                : "Send email code"}
            </Button>
          ) : null}
        </Form>

        <p className="text-center text-sm leading-5 font-normal text-[#4B5563]">
          Need another account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#1C5DD4] transition-colors hover:text-[#164CB0]"
          >
            Back to login
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
