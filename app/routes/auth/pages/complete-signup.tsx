import { useMemo, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { Check, Info } from "lucide-react";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
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
import { FormError } from "~/routes/auth/components/form-error";
import { resolveImageURL } from "~/lib/utils";
import {
  action as completeSignUpAction,
  loader as completeSignUpLoader,
} from "~/routes/auth/domain/complete-signup.server";
import type { CompleteSignUpActionData } from "~/routes/auth/domain/auth.types";

export const loader = completeSignUpLoader;
export const action = completeSignUpAction;

export function meta() {
  return [{ title: "Complete Profile | True Khmer" }];
}

const inputClasses =
  "h-12 rounded-lg border-[#C3C6D6] bg-white px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-[#434654]/50 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20";

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
  return <span className="text-[#EF4444]">*</span>;
}

function FieldLabel({
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
      className="text-xs font-bold uppercase tracking-[0.08em] text-[#334155]"
    >
      {children} {required ? <RequiredMark /> : null}
    </Label>
  );
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export default function CompleteSignUpPage() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<CompleteSignUpActionData>();
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(
    (user.phone?.country as CountryCode | undefined) ?? "KH",
  );
  const [contactNumber, setContactNumber] = useState(
    user.phone?.nationalNumber ?? "",
  );
  const [occupation, setOccupation] = useState(user.occupation ?? "");
  const [gender, setGender] = useState("");
  const [memberAgreementAccepted, setMemberAgreementAccepted] = useState(false);

  const selectedPhoneCountry =
    phoneCountryOptions.find((option) => option.country === phoneCountry) ??
    ({
      country: "KH",
      dialCode: "+855",
      label: "Cambodia +855",
    } satisfies (typeof phoneCountryOptions)[number]);
  const isSubmitting = navigation.state === "submitting";
  const isCompleteEnabled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    contactNumber.trim() !== "" &&
    occupation.trim() !== "" &&
    gender.trim() !== "" &&
    memberAgreementAccepted;
  const displayName = useMemo(() => {
    const name =
      readString(user.name) ||
      [firstName, lastName].filter(Boolean).join(" ") ||
      user.email.split("@")[0];
    return name.trim();
  }, [firstName, lastName, user.email, user.name]);
  const userProfile = readRecord(user.profile);
  const avatarImage = resolveImageURL(
    readString(userProfile.avatarKey) || readString(user.image),
  );
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="flex min-h-screen items-center bg-white px-6 py-5 text-[#0F172A] sm:px-8">
      <div className="mx-auto w-full max-w-md">
        <header className="space-y-2">
          <h1 className="text-[32px] font-extrabold leading-10 tracking-[-0.02em] text-[#0F172A]">
            Complete Your Registration
          </h1>
          <p className="text-[15px] leading-6 text-[#64748B]">
            Finish your required details to activate your verified account.
          </p>
        </header>

        <section className="mt-7 overflow-hidden rounded-2xl border border-[#CFE0F7] bg-[#EFF6FF] shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="relative">
              <Avatar className="size-13 border-2 border-white shadow-sm">
                <AvatarImage src={avatarImage || undefined} alt="" />
                <AvatarFallback className="bg-[#2F6FE4] text-sm font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                <img
                  src="/logos/google_logo.svg"
                  width={14}
                  height={14}
                  alt=""
                />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-bold leading-5 text-[#111827]">
                  {displayName}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D6F5E1] px-2 py-0.5 text-[11px] font-bold text-[#008A3D]">
                  <Check className="size-3" strokeWidth={3} />
                  Google Verified
                </span>
              </div>
              <p className="truncate text-sm leading-5 text-[#64748B]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D7E7FA] px-5 py-3 text-xs font-bold">
            <p className="inline-flex items-center gap-1.5 text-[#1D4ED8]">
              <Info className="size-4" />
              Email & account verified automatically
            </p>
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="cursor-pointer text-[#1D4ED8] hover:text-[#164CB0]"
              >
                Not you? Switch
              </button>
            </Form>
          </div>
        </section>

        <Form method="post" className="mt-6 space-y-5">
          <input type="hidden" name="phone.country" value={phoneCountry} />
          <input
            type="hidden"
            name="phone.nationalNumber"
            value={contactNumber.trim()}
          />
          <input
            type="hidden"
            name="memberAgreementAccepted"
            value={memberAgreementAccepted ? "true" : "false"}
          />

          <FormError message={actionData?.errors?.form} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="firstName" required>
                First name
              </FieldLabel>
              <Input
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                className={inputClasses}
              />
              {actionData?.errors?.firstName ? (
                <p className="text-xs text-red-500">
                  {actionData.errors.firstName}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="lastName" required>
                Last name
              </FieldLabel>
              <Input
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                className={inputClasses}
              />
              {actionData?.errors?.lastName ? (
                <p className="text-xs text-red-500">
                  {actionData.errors.lastName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="contactNumber" required>
              Contact number
            </FieldLabel>
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
                onChange={(event) => setContactNumber(event.target.value)}
                placeholder="12 345 678"
                inputMode="tel"
                autoComplete="tel-national"
                className="h-full rounded-l-none rounded-r-lg border-[#C3C6D6] px-4 py-3.5 text-base font-normal text-[#111827] placeholder:text-gray-500 focus-visible:border-[#2F6FE4] focus-visible:ring-[#2F6FE4]/20"
              />
            </div>
            {actionData?.errors?.phone ? (
              <p className="text-xs text-red-500">{actionData.errors.phone}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="occupation" required>
              Occupation
            </FieldLabel>
            <Input
              id="occupation"
              name="occupation"
              value={occupation}
              onChange={(event) => setOccupation(event.target.value)}
              placeholder="Strategist"
              autoComplete="organization-title"
              className={inputClasses}
            />
            {actionData?.errors?.occupation ? (
              <p className="text-xs text-red-500">
                {actionData.errors.occupation}
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            <FieldLabel required>Gender</FieldLabel>
            <RadioGroup
              name="gender"
              value={gender}
              onValueChange={setGender}
              className="flex flex-wrap gap-6"
            >
              {["male", "female"].map((value) => (
                <Label
                  key={value}
                  className="flex items-center gap-2 text-sm font-bold capitalize leading-5 text-[#334155]"
                >
                  <RadioGroupItem value={value} className="border-[#94A3B8]" />
                  {value}
                </Label>
              ))}
            </RadioGroup>
            {actionData?.errors?.gender ? (
              <p className="text-xs text-red-500">{actionData.errors.gender}</p>
            ) : null}
          </div>

          <Label className="flex items-center gap-3 text-sm leading-5 text-[#334155]">
            <Checkbox
              checked={memberAgreementAccepted}
              onCheckedChange={(checked) =>
                setMemberAgreementAccepted(checked === true)
              }
              className="size-4 rounded border-[#94A3B8] bg-white data-[state=checked]:border-[#2F6FE4] data-[state=checked]:bg-[#2F6FE4]"
            />
            I agree publicly to appear on the member directory
          </Label>
          {actionData?.errors?.memberAgreementAccepted ? (
            <p className="text-xs text-red-500">
              {actionData.errors.memberAgreementAccepted}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={!isCompleteEnabled || isSubmitting}
            className="h-13 w-full rounded-[14px] bg-[#2F6FE4] text-sm font-bold text-white shadow-[0_8px_18px_rgba(47,111,228,0.24)] transition-colors hover:bg-[#1F62DF] disabled:bg-[#2F6FE4] disabled:opacity-50"
          >
            {isSubmitting
              ? "Completing Registration..."
              : "Complete Verified Registration"}
          </Button>
        </Form>

        <footer className="mt-8 border-t border-[#EEF2F7] pt-5 text-center text-sm text-[#64748B]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#1D4ED8] hover:text-[#164CB0]"
          >
            Sign In
          </Link>
        </footer>
      </div>
    </main>
  );
}
