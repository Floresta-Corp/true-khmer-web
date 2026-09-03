import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
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
import {
  registerSchema,
  type RegisterFormValues,
} from "~/routes/auth/domain/register-schema";
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
import { useOffscreenErrorToast } from "~/hooks/use-offscreen-error-toast";
import { useRegisterDraftStore } from "~/stores/register-draft-store";
import { cn } from "~/lib/utils";
import { sanitizePhoneNumber } from "~/lib/phone";
import {
  getBackDestination,
  sanitizeRedirectPath,
  withRedirectTo,
} from "~/lib/redirects";

export const loader = registerLoader;
export const action = registerAction;

export function meta() {
  return [{ title: "Register | True Khmer" }];
}

type RegisterTextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "className"
> & {
  id: string;
  label: string;
  error?: string | null;
};

const registerInputClasses =
  "h-12 short:h-11 rounded-xl border-[#C3C6D6] bg-white px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-[#434654]/50 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20";

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
      className="block text-sm leading-5 font-semibold text-zinc-900"
    >
      {children}
      {required ? <RequiredMark /> : null}
    </Label>
  );
}

function RegisterTextField({
  id,
  label,
  error,
  required,
  readOnly,
  ...inputProps
}: RegisterTextFieldProps) {
  return (
    <div className="space-y-2">
      <RegisterLabel htmlFor={id} required={required}>
        {label}
      </RegisterLabel>
      <Input
        id={id}
        required={required}
        readOnly={readOnly}
        className={cn(
          registerInputClasses,
          readOnly ? "bg-[#F8FAFC] text-[#4B5563]" : "",
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
  const navigation = useNavigation();
  const location = useLocation();
  const submit = useSubmit();

  const saveDraft = useRegisterDraftStore((state) => state.saveDraft);
  const clearDraft = useRegisterDraftStore((state) => state.clearDraft);

  const formError = actionData?.errors?.form;
  const serverEmailError =
    actionData?.errors?.email !== formError ? actionData?.errors?.email : null;
  const waitlistPrefill = waitlistContext?.prefill;
  const appliedWaitlistId = waitlistContext?.waitlistId ?? "";
  const hasWaitlistInvite = !!(
    waitlistContext?.found &&
    waitlistPrefill &&
    appliedWaitlistId
  );

  const [googleError, setGoogleError] = useState("");
  const errorAnchorRef = useOffscreenErrorToast(
    formError || googleError,
    actionData,
  );

  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const back = getBackDestination(searchParams.get("redirectTo"));

  const defaultValues = useMemo<RegisterFormValues>(
    () => ({
      participation: "member",
      firstName: waitlistPrefill?.firstName ?? "",
      lastName: waitlistPrefill?.lastName ?? "",
      email: waitlistPrefill?.email ?? "",
      password: "",
      confirmPassword: "",
      phoneCountry: waitlistPrefill?.phone.country ?? "KH",
      contactNumber: sanitizePhoneNumber(
        waitlistPrefill?.phone.nationalNumber ?? "",
      ),
      gender: waitlistPrefill?.gender ?? "",
      occupation: waitlistPrefill?.occupation ?? "",
      agreeToDirectory: hasWaitlistInvite,
    }),
    [waitlistPrefill, hasWaitlistInvite],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues,
  });

  const participation = watch("participation");
  const phoneCountry = watch("phoneCountry");
  const gender = watch("gender");
  const agreeToDirectory = watch("agreeToDirectory");

  // Restore the persisted draft after mount rather than during render: the
  // server renders the empty form, so reading sessionStorage any earlier would
  // mismatch on hydration.
  const hasRestoredDraft = useRef(false);
  useEffect(() => {
    if (hasRestoredDraft.current) return;
    hasRestoredDraft.current = true;

    const { draft } = useRegisterDraftStore.getState();
    if (!draft) return;

    reset({
      ...defaultValues,
      ...draft,
      // An invite owns the email and the directory consent, so a stale draft
      // must not talk either of them out of the invited values.
      ...(hasWaitlistInvite
        ? { email: defaultValues.email, agreeToDirectory: true }
        : {}),
      password: "",
      confirmPassword: "",
    });
  }, [defaultValues, hasWaitlistInvite, reset]);

  // Mirror every edit into the store, minus the passwords.
  useEffect(() => {
    const subscription = watch((values) => {
      saveDraft({
        participation: values.participation ?? "member",
        firstName: values.firstName ?? "",
        lastName: values.lastName ?? "",
        email: values.email ?? "",
        phoneCountry: values.phoneCountry ?? "KH",
        contactNumber: values.contactNumber ?? "",
        gender: values.gender ?? "",
        occupation: values.occupation ?? "",
        agreeToDirectory: values.agreeToDirectory ?? false,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, saveDraft]);

  // A successful register action redirects to OTP verification; that navigation
  // away from this route is the only signal the page gets that the draft has
  // served its purpose.
  const isLeavingAfterSubmit =
    navigation.state === "loading" &&
    navigation.formMethod === "POST" &&
    navigation.location.pathname !== location.pathname;

  useEffect(() => {
    if (isLeavingAfterSubmit) clearDraft();
  }, [isLeavingAfterSubmit, clearDraft]);

  // A successful register does not end with the action: React Router stays in
  // "loading" while it fetches the destination route, so the button keeps its
  // busy state past the POST rather than flicking back to idle mid-redirect.
  const isSubmitting =
    navigation.state === "submitting" ||
    (navigation.state === "loading" && navigation.formMethod === "POST");
  const selectedPhoneCountry =
    phoneCountryOptions.find((option) => option.country === phoneCountry) ??
    ({
      country: "KH",
      dialCode: "+855",
      label: "Cambodia +855",
    } satisfies (typeof phoneCountryOptions)[number]);

  const contactNumberField = register("contactNumber");

  const onValid = (values: RegisterFormValues) => {
    const formData = new FormData();
    formData.set("redirectTo", redirectTo);
    formData.set("participation", values.participation);
    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("phone.country", values.phoneCountry);
    formData.set("phone.nationalNumber", values.contactNumber);
    formData.set("gender", values.gender);
    formData.set("occupation", values.occupation);
    formData.set("agreeToDirectory", values.agreeToDirectory ? "1" : "0");
    if (hasWaitlistInvite) formData.set("waitlistId", appliedWaitlistId);

    submit(formData, { method: "post" });
  };

  return (
    <AuthPageShell
      backTo={back.to}
      backLabel={back.label}
      leftSectionClassName="items-start justify-center px-6 py-10 short:py-6 sm:px-10 lg:px-8 lg:py-0 xl:px-12"
      contentClassName="max-w-md pb-10 pt-20 short:pt-14 short:pb-6 lg:pt-40"
      backLinkClassName="left-6 top-8 text-sm font-semibold normal-case tracking-normal text-[#1C5DD4] hover:text-[#164CB0] short:top-6 sm:left-10 lg:left-1/2 lg:top-24 lg:-translate-x-56"
      backIconClassName="h-auto w-auto rounded-none border-0"
      rightPanelContent={<RegisterBrandPanel />}
      rightPanelContentClassName="items-stretch justify-stretch text-left"
      showRightPanelOverlay={false}
    >
      <div className="space-y-8 short:space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl leading-9 font-bold text-[#111827] short:text-2xl">
            Create Your Account
          </h1>
          <p className="text-base leading-6 font-normal text-[#4B5563]">
            Please choose your participation type
          </p>
        </header>

        <div className="grid grid-cols-2 rounded-2xl bg-[#ECEDF8] p-1">
          <Button
            type="button"
            onClick={() =>
              setValue("participation", "member", { shouldDirty: true })
            }
            variant="ghost"
            className={cn(
              "h-10 rounded-xl px-4 py-2 text-sm leading-5 font-semibold transition-colors",
              participation === "member"
                ? "bg-white text-[#0046AC] shadow-sm"
                : "text-[#434654]",
            )}
          >
            Member
          </Button>
          <Button
            type="button"
            onClick={() =>
              setValue("participation", "partner", { shouldDirty: true })
            }
            variant="ghost"
            className={cn(
              "h-10 rounded-xl px-4 py-2 text-sm leading-5 font-semibold transition-colors",
              participation === "partner"
                ? "bg-white text-[#0046AC] shadow-sm"
                : "text-[#434654]",
            )}
          >
            Partner
          </Button>
        </div>

        <GoogleAuthButton
          className="h-12 rounded-lg border-[#E5E7EB] bg-white px-4 py-3 text-base font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB] short:h-11"
          redirectTo={redirectTo}
          waitlistId={hasWaitlistInvite ? appliedWaitlistId : undefined}
          onError={setGoogleError}
        />

        <FormDivider
          label="or"
          className="py-4 short:py-1"
          lineClassName="bg-[#E5E7EB]"
          labelClassName="text-sm font-normal normal-case tracking-normal text-[#4B5563]"
        />

        <div ref={errorAnchorRef} className="space-y-4 empty:hidden">
          <FormError message={googleError} />
          <FormError message={formError} />
        </div>

        <Form
          method="post"
          className="space-y-6 short:space-y-5"
          noValidate
          onSubmit={handleSubmit(onValid)}
        >
          {hasWaitlistInvite ? (
            <Badge className="w-fit gap-1.5 rounded-full bg-[#ECFDF3] px-3 py-1.5 text-xs font-semibold text-[#027A48] hover:bg-[#ECFDF3]">
              <CheckCircle2 className="size-3.5" />
              Early Founder invite applied
            </Badge>
          ) : null}

          <div className="grid gap-4 xs:grid-cols-2">
            <RegisterTextField
              id="firstName"
              label="First name"
              placeholder="Socheata"
              autoComplete="given-name"
              required
              error={errors.firstName?.message ?? actionData?.errors?.firstName}
              {...register("firstName")}
            />
            <RegisterTextField
              id="lastName"
              label="Last name"
              placeholder="Mean"
              autoComplete="family-name"
              required
              error={errors.lastName?.message ?? actionData?.errors?.lastName}
              {...register("lastName")}
            />
          </div>

          <RegisterTextField
            id="email"
            label="Email address"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
            readOnly={hasWaitlistInvite}
            aria-readonly={hasWaitlistInvite}
            error={errors.email?.message ?? serverEmailError}
            {...register("email")}
          />

          <PasswordField
            id="password"
            autoComplete="new-password"
            label={
              <>
                Password
                <RequiredMark />
              </>
            }
            placeholder="••••••••"
            error={errors.password?.message ?? actionData?.errors?.password}
            labelClassName="text-sm font-semibold leading-5 text-zinc-900"
            inputClassName={cn(registerInputClasses, "pr-11")}
            toggleClassName="right-2 h-8 w-8 text-[#899CC9] hover:text-[#6F86B3]"
            {...register("password")}
          />

          <PasswordField
            id="confirmPassword"
            autoComplete="new-password"
            label={
              <>
                Confirm password
                <RequiredMark />
              </>
            }
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            labelClassName="text-sm font-semibold leading-5 text-zinc-900"
            inputClassName={cn(registerInputClasses, "pr-11")}
            toggleClassName="right-2 h-8 w-8 text-[#899CC9] hover:text-[#6F86B3]"
            {...register("confirmPassword")}
          />

          <div className="space-y-2">
            <RegisterLabel htmlFor="contactNumber" required>
              Contact number
            </RegisterLabel>
            <div className="flex h-12 overflow-hidden rounded-lg bg-white short:h-11">
              <Select
                value={phoneCountry}
                onValueChange={(value) =>
                  setValue("phoneCountry", value as CountryCode, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  aria-label="Country calling code"
                  className="h-full w-28 rounded-l-lg rounded-r-none border-r-0 border-[#C3C6D6] bg-slate-50 px-3 text-sm leading-5 font-medium text-[#434654] shadow-none focus:ring-[#2F6FE4]/20 focus:ring-offset-0 xs:w-34"
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
                placeholder="12 345 678"
                inputMode="numeric"
                autoComplete="tel-national"
                className="h-full rounded-l-none rounded-r-lg border-[#C3C6D6] px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-gray-500 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
                {...contactNumberField}
                onChange={(event) => {
                  event.target.value = sanitizePhoneNumber(event.target.value);
                  return contactNumberField.onChange(event);
                }}
              />
            </div>
            {(errors.contactNumber?.message ?? actionData?.errors?.phone) ? (
              <p className="text-xs text-red-500">
                {errors.contactNumber?.message ?? actionData?.errors?.phone}
              </p>
            ) : null}
          </div>

          <RegisterTextField
            id="occupation"
            label="Occupation"
            placeholder="Strategist"
            autoComplete="organization-title"
            required
            error={errors.occupation?.message ?? actionData?.errors?.occupation}
            {...register("occupation")}
          />

          <div className="space-y-2 pl-1">
            <RegisterLabel required>Gender</RegisterLabel>
            <RadioGroup
              value={gender}
              onValueChange={(value) =>
                setValue("gender", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              <Label className="flex items-center gap-2 text-sm leading-5 font-normal text-zinc-900">
                <RadioGroupItem value="male" className="border-[#C3C6D6]" />
                Male
              </Label>
              <Label className="flex items-center gap-2 text-sm leading-5 font-normal text-zinc-900">
                <RadioGroupItem value="female" className="border-[#C3C6D6]" />
                Female
              </Label>
              <Label className="flex items-center gap-2 text-sm leading-5 font-normal text-zinc-900">
                <RadioGroupItem value="other" className="border-[#C3C6D6]" />
                Other
              </Label>
            </RadioGroup>
            {(errors.gender?.message ?? actionData?.errors?.gender) ? (
              <p className="text-xs text-red-500">
                {errors.gender?.message ?? actionData?.errors?.gender}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-3 pl-1 text-sm leading-5 font-semibold text-gray-700">
              <Checkbox
                checked={agreeToDirectory}
                onCheckedChange={(checked) =>
                  setValue("agreeToDirectory", checked === true, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className="size-4 rounded border-[#E8E8E8] bg-white data-[state=checked]:border-[#2F6FE4] data-[state=checked]:bg-[#2F6FE4]"
              />
              I agree publicly to appear on the member directory
            </Label>
            {errors.agreeToDirectory?.message ? (
              <p className="pl-1 text-xs text-red-500">
                {errors.agreeToDirectory.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="h-10 w-full gap-2 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Joining as {participation}...
              </>
            ) : (
              `Join as ${participation}`
            )}
          </Button>
        </Form>

        <p className="text-center text-base leading-6 font-normal text-gray-700 short:text-sm">
          Already have an account?{" "}
          <Link
            to={withRedirectTo("/login", searchParams.get("redirectTo"))}
            className="font-bold text-[#1C5DD4] transition-colors hover:text-[#164CB0]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
