import {
  useEffect,
  useState,
  type ComponentProps,
  type FormEvent,
} from "react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "react-router";
import { CheckCircle2 } from "lucide-react";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import { FormDivider } from "~/routes/auth/components/form-divider";
import { FormError } from "~/routes/auth/components/form-error";
import { GoogleAuthButton } from "~/routes/auth/components/google-auth-button";
import {
  AuthPageShell,
  RegisterBrandPanel,
} from "~/routes/auth/components/page-shell";
import { PasswordField } from "~/routes/auth/components/password-field";
import {
  action as registerAction,
  loader as registerLoader,
} from "~/routes/auth/domain/register.server";
import { getPasswordValidationError } from "~/routes/auth/domain/password-validation";
import type { RegisterActionData } from "~/routes/auth/domain/auth.types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { sanitizePhoneNumber } from "~/lib/phone";
import { sanitizeRedirectPath } from "~/lib/redirects";

export const loader = registerLoader;
export const action = registerAction;

export function meta() {
  return [{ title: "Register | True Khmer" }];
}

type RegisterTextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name" | "value" | "placeholder" | "onChange" | "className"
> & {
  id: string;
  name?: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string | null;
  onChange: (value: string) => void;
};

const registerInputClasses =
  "h-12 rounded-xl border-[#C3C6D6] bg-white px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-[#434654]/50 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20";

const countryNameFormatter =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const phoneCountryOptions = getCountries()
  .map((country) => {
    const dialCode = `+${getCountryCallingCode(country)}`;
    return {
      country,
      dialCode,
      label: `${countryNameFormatter?.of(country) ?? country} ${dialCode}`,
    };
  })
  .sort((first, second) => {
    if (first.country === "KH") return -1;
    if (second.country === "KH") return 1;
    return first.label.localeCompare(second.label);
  });

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

function RegisterLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: string;
  required?: boolean;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="block text-sm font-semibold leading-5 text-zinc-900"
    >
      {children}
      {required ? <RequiredMark /> : null}
    </Label>
  );
}

function RegisterTextField({
  id,
  name,
  label,
  value,
  placeholder,
  required,
  type = "text",
  autoComplete,
  error,
  onChange,
  ...inputProps
}: RegisterTextFieldProps) {
  return (
    <div className="space-y-2">
      <RegisterLabel htmlFor={id} required={required}>
        {label}
      </RegisterLabel>
      <Input
        id={id}
        name={name ?? id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          registerInputClasses,
          inputProps.readOnly ? "bg-[#F8FAFC] text-[#4B5563]" : "",
        )}
        {...inputProps}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export default function RegisterPage() {
  const actionData = useActionData<RegisterActionData>();
  const { waitlistContext } = useLoaderData<typeof registerLoader>();
  const [searchParams] = useSearchParams();
  const formError = actionData?.errors?.form;
  const emailError =
    actionData?.errors?.email !== formError ? actionData?.errors?.email : null;
  const waitlistPrefill = waitlistContext?.prefill;
  const appliedWaitlistId = waitlistContext?.waitlistId ?? "";
  const hasWaitlistInvite = !!(
    waitlistContext?.found &&
    waitlistPrefill &&
    appliedWaitlistId
  );

  const [participation, setParticipation] = useState<"member" | "partner">(
    "member",
  );
  const [firstName, setFirstName] = useState(waitlistPrefill?.firstName ?? "");
  const [lastName, setLastName] = useState(waitlistPrefill?.lastName ?? "");
  const [email, setEmail] = useState(waitlistPrefill?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(
    (waitlistPrefill?.phone.country as CountryCode | undefined) ?? "KH",
  );
  const [contactNumber, setContactNumber] = useState(
    sanitizePhoneNumber(waitlistPrefill?.phone.nationalNumber ?? ""),
  );
  const [gender, setGender] = useState(waitlistPrefill?.gender ?? "");
  const [occupation, setOccupation] = useState(
    waitlistPrefill?.occupation ?? "",
  );
  const [agreeToDirectory, setAgreeToDirectory] = useState(hasWaitlistInvite);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [googleError, setGoogleError] = useState("");

  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const selectedPhoneCountry =
    phoneCountryOptions.find((option) => option.country === phoneCountry) ??
    ({
      country: "KH",
      dialCode: "+855",
      label: "Cambodia +855",
    } satisfies (typeof phoneCountryOptions)[number]);
  const passwordsMatch =
    confirmPassword.trim() !== "" && password === confirmPassword;
  const clientPasswordError =
    passwordTouched || password.trim() !== ""
      ? getPasswordValidationError(password)
      : undefined;

  useEffect(() => {
    if (confirmPassword.trim() !== "" && !passwordsMatch) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setConfirmPasswordError("");
  }, [confirmPassword, passwordsMatch]);

  const isCreateEnabled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    !getPasswordValidationError(password) &&
    passwordsMatch &&
    contactNumber.trim() !== "" &&
    gender.trim() !== "" &&
    occupation.trim() !== "" &&
    agreeToDirectory;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      event.preventDefault();
      setPasswordTouched(true);
      return;
    }

    if (password !== confirmPassword) {
      event.preventDefault();
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setConfirmPasswordError("");
  }

  return (
    <AuthPageShell
      backTo="/"
      backLabel="Back to Home"
      leftSectionClassName="items-start justify-center px-6 py-10 sm:px-10 lg:px-8 lg:py-0 xl:px-12"
      contentClassName="max-w-md pb-10 pt-20 lg:pt-40"
      backLinkClassName="left-6 top-8 text-sm font-semibold normal-case tracking-normal text-[#1C5DD4] hover:text-[#164CB0] sm:left-10 lg:left-1/2 lg:top-24 lg:-translate-x-56"
      backIconClassName="h-auto w-auto rounded-none border-0"
      rightPanelContent={<RegisterBrandPanel />}
      rightPanelContentClassName="items-stretch justify-stretch text-left"
      showRightPanelOverlay={false}
    >
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold leading-9 text-[#111827]">
            Create Your Account
          </h1>
          <p className="text-base font-normal leading-6 text-[#4B5563]">
            Please choose your participation type
          </p>
        </header>

        <div className="grid rounded-2xl bg-[#ECEDF8] p-1 sm:grid-cols-2">
          <Button
            type="button"
            onClick={() => setParticipation("member")}
            variant="ghost"
            className={cn(
              "h-10 rounded-xl px-4 py-2 text-sm font-semibold leading-5 transition-colors",
              participation === "member"
                ? "bg-white text-[#0046AC] shadow-sm"
                : "text-[#434654]",
            )}
          >
            Member
          </Button>
          <Button
            type="button"
            onClick={() => setParticipation("partner")}
            variant="ghost"
            className={cn(
              "h-10 rounded-xl px-4 py-2 text-sm font-semibold leading-5 transition-colors",
              participation === "partner"
                ? "bg-white text-[#0046AC] shadow-sm"
                : "text-[#434654]",
            )}
          >
            Partner
          </Button>
        </div>

        <GoogleAuthButton
          className="h-12 rounded-lg border-[#E5E7EB] bg-white px-4 py-3 text-base font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB]"
          redirectTo={redirectTo}
          waitlistId={hasWaitlistInvite ? appliedWaitlistId : undefined}
          onError={setGoogleError}
        />

        <FormDivider
          label="or"
          className="py-4"
          lineClassName="bg-[#E5E7EB]"
          labelClassName="text-sm font-normal normal-case tracking-normal text-[#4B5563]"
        />

        <FormError message={googleError} />
        <FormError message={formError} />

        <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input
            type="hidden"
            name="agreeToDirectory"
            value={agreeToDirectory ? "1" : "0"}
          />
          <input type="hidden" name="participation" value={participation} />
          <input type="hidden" name="phone.country" value={phoneCountry} />
          <input
            type="hidden"
            name="phone.nationalNumber"
            value={contactNumber.trim()}
          />
          {hasWaitlistInvite ? (
            <input type="hidden" name="waitlistId" value={appliedWaitlistId} />
          ) : null}

          {hasWaitlistInvite ? (
            <Badge className="w-fit gap-1.5 rounded-full bg-[#ECFDF3] px-3 py-1.5 text-xs font-semibold text-[#027A48] hover:bg-[#ECFDF3]">
              <CheckCircle2 className="size-3.5" />
              Early Founder invite applied
            </Badge>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <RegisterTextField
              id="firstName"
              label="First name"
              value={firstName}
              onChange={setFirstName}
              placeholder="Socheata"
              autoComplete="given-name"
              required
              error={actionData?.errors?.firstName}
            />
            <RegisterTextField
              id="lastName"
              label="Last name"
              value={lastName}
              onChange={setLastName}
              placeholder="Mean"
              autoComplete="family-name"
              required
              error={actionData?.errors?.lastName}
            />
          </div>

          <RegisterTextField
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="name@example.com"
            autoComplete="email"
            required
            readOnly={hasWaitlistInvite}
            aria-readonly={hasWaitlistInvite}
            error={emailError}
          />

          <PasswordField
            id="password"
            name="password"
            autoComplete="new-password"
            label={
              <>
                Password
                <RequiredMark />
              </>
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setPasswordTouched(true)}
            placeholder="••••••••"
            error={clientPasswordError ?? actionData?.errors?.password}
            labelClassName="text-sm font-semibold leading-5 text-zinc-900"
            inputClassName={cn(registerInputClasses, "pr-11")}
            toggleClassName="right-2 h-8 w-8 text-[#899CC9] hover:text-[#6F86B3]"
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            label={
              <>
                Confirm password
                <RequiredMark />
              </>
            }
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            error={confirmPasswordError}
            labelClassName="text-sm font-semibold leading-5 text-zinc-900"
            inputClassName={cn(registerInputClasses, "pr-11")}
            toggleClassName="right-2 h-8 w-8 text-[#899CC9] hover:text-[#6F86B3]"
          />

          <div className="space-y-2">
            <RegisterLabel htmlFor="contactNumber" required>
              Contact number
            </RegisterLabel>
            <div className="flex h-12 overflow-hidden rounded-lg bg-white">
              <Select
                value={phoneCountry}
                onValueChange={(value) => setPhoneCountry(value as CountryCode)}
              >
                <SelectTrigger
                  aria-label="Country calling code"
                  className="h-full w-34 rounded-l-lg rounded-r-none border-[#C3C6D6] border-r-0 bg-slate-50 px-3 text-sm font-medium leading-5 text-[#434654] shadow-none focus:ring-[#2F6FE4]/20 focus:ring-offset-0"
                >
                  <span className="truncate">
                    {selectedPhoneCountry.dialCode}
                  </span>
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    {phoneCountryOptions.map((option) => (
                      <SelectItem key={option.country} value={option.country}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                id="contactNumber"
                value={contactNumber}
                onChange={(event) =>
                  setContactNumber(sanitizePhoneNumber(event.target.value))
                }
                placeholder="12 345 678"
                inputMode="numeric"
                autoComplete="tel-national"
                className="h-full rounded-l-none rounded-r-lg border-[#C3C6D6] px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-gray-500 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
              />
            </div>
            {actionData?.errors?.phone ? (
              <p className="text-xs text-red-500">{actionData.errors.phone}</p>
            ) : null}
          </div>

          <RegisterTextField
            id="occupation"
            label="Occupation"
            value={occupation}
            onChange={setOccupation}
            placeholder="Strategist"
            autoComplete="organization-title"
            error={actionData?.errors?.occupation}
            required
          />

          <div className="space-y-2 pl-1">
            <RegisterLabel required>Gender</RegisterLabel>
            <RadioGroup
              name="gender"
              value={gender}
              onValueChange={setGender}
              className="flex flex-wrap gap-6"
            >
              <Label className="flex items-center gap-2 text-sm font-normal leading-5 text-zinc-900">
                <RadioGroupItem value="male" className="border-[#C3C6D6]" />
                Male
              </Label>
              <Label className="flex items-center gap-2 text-sm font-normal leading-5 text-zinc-900">
                <RadioGroupItem value="female" className="border-[#C3C6D6]" />
                Female
              </Label>
              <Label className="flex items-center gap-2 text-sm font-normal leading-5 text-zinc-900">
                <RadioGroupItem value="other" className="border-[#C3C6D6]" />
                Other
              </Label>
            </RadioGroup>
            {actionData?.errors?.gender ? (
              <p className="text-xs text-red-500">{actionData.errors.gender}</p>
            ) : null}
          </div>

          <Label className="flex items-center gap-3 pl-1 text-sm font-semibold leading-5 text-gray-700">
            <Checkbox
              checked={agreeToDirectory}
              onCheckedChange={(checked) =>
                setAgreeToDirectory(checked === true)
              }
              className="size-4 rounded border-[#E8E8E8] bg-white data-[state=checked]:border-[#2F6FE4] data-[state=checked]:bg-[#2F6FE4]"
            />
            I agree publicly to appear on the member directory
          </Label>

          <Button
            type="submit"
            disabled={!isCreateEnabled}
            className="h-10 w-full rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
          >
            Join as {participation}
          </Button>
        </Form>

        <p className="text-center text-base font-normal leading-6 text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#1C5DD4] transition-colors hover:text-[#164CB0]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
