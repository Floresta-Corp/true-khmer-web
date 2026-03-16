import { useState } from "react";
import { Form, Link, useActionData, useSearchParams } from "react-router";
import { Briefcase, Lock, Mail, User, UserRound } from "lucide-react";
import { FormDivider } from "~/routes/auth/components/form-divider";
import { FormError } from "~/routes/auth/components/form-error";
import { GoogleButton } from "~/routes/auth/components/google-button";
import { AuthPageShell } from "~/routes/auth/components/page-shell";
import { PasswordField } from "~/routes/auth/components/password-field";
import {
  action as registerAction,
  loader as registerLoader,
} from "~/routes/auth/domain/register.server";
import type { RegisterActionData } from "~/routes/auth/domain/auth.types";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";
import { sanitizeRedirectPath } from "~/lib/redirects";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const loader = registerLoader;
export const action = registerAction;
export function meta() {
  return [{ title: "Register | True Khmer" }];
}

export default function RegisterPage() {
  const actionData = useActionData<RegisterActionData>();
  const [searchParams] = useSearchParams();
  const formError = actionData?.errors?.form;
  const emailError =
    actionData?.errors?.email !== formError ? actionData?.errors?.email : null;

  const [participation, setParticipation] = useState<"member" | "partner">(
    "member",
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [agreeToDirectory, setAgreeToDirectory] = useState(false);

  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));

  const isCreateEnabled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    gender.trim() !== "" &&
    occupation.trim() !== "" &&
    agreeToDirectory;

  return (
    <AuthPageShell
      contentClassName="w-full max-w-sm pb-2 pt-10 lg:pb-2 lg:pt-2"
      rightPanelContentClassName="text-[36px] font-medium text-[#111827]"
      showRightPanelOverlay={false}
    >
      <div className="mt-2 space-y-3 lg:mt-3 lg:space-y-4 xl:mt-6 xl:space-y-5 2xl:mt-16 2xl:space-y-6">
        <div className="space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-7">
          <img
            src="/logofullcolor.svg"
            alt="True Khmer"
            className="h-9 w-auto object-contain sm:h-10"
          />

          <header className="space-y-[7px]">
            <h1 className="text-[26.25px] font-semibold leading-[31.5px] text-[#030213]">
              Welcome to True Khmer
            </h1>
            <p className="text-sm font-medium leading-[21px] text-[#99A1AF]">
              Please choose your participation type
            </p>
          </header>

          <div className="flex h-10 items-center gap-2 overflow-hidden rounded-md border border-[#E8E8E8] bg-transparent p-1">
            <Button
              type="button"
              onClick={() => setParticipation("member")}
              variant="ghost"
              className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium leading-5 transition-colors ${
                participation === "member"
                  ? "bg-[#2F6FE4] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  : "text-[#62748E]"
              }`}
            >
              Member
            </Button>
            <Button
              type="button"
              disabled
              variant="ghost"
              className="flex-1 cursor-not-allowed rounded-sm px-3 py-1.5 text-sm font-medium leading-5 text-[#62748E] opacity-60"
            >
              Partner
            </Button>
          </div>
        </div>

        <div className="space-y-2.5 lg:space-y-3 xl:space-y-4 2xl:space-y-[25px]">
          <GoogleButton />

          <FormDivider
            className="py-2"
            lineClassName="bg-[#F3F4F6]"
            labelClassName="text-[#D1D5DC]"
          />

          <FormError message={formError} />

          <Form
            method="post"
            className="space-y-2.5 lg:space-y-3 xl:space-y-3.5 2xl:space-y-[19px]"
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="block text-[13px] font-semibold leading-[19.5px] text-[#364153]"
                >
                  First name
                </Label>
                <div className="relative">
                  <UserRound
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D1D5DC]"
                  />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Socheata"
                    className="h-11 rounded-lg border-transparent bg-[#F8FAFC] py-2 pl-9 pr-3 text-[12.25px] font-medium text-[#1E293B] placeholder:text-[#C8D6E5] focus-visible:ring-[#2F6FE4]/30"
                  />
                </div>
                {actionData?.errors?.firstName ? (
                  <p className="text-xs text-red-500">
                    {actionData.errors.firstName}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="block text-[13px] font-semibold leading-[19.5px] text-[#364153]"
                >
                  Last name
                </Label>
                <div className="relative">
                  <UserRound
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D1D5DC]"
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Mean"
                    className="h-11 rounded-lg border-transparent bg-[#F8FAFC] py-2 pl-9 pr-3 text-[12.25px] font-medium text-[#1E293B] placeholder:text-[#C8D6E5] focus-visible:ring-[#2F6FE4]/30"
                  />
                </div>
                {actionData?.errors?.lastName ? (
                  <p className="text-xs text-red-500">
                    {actionData.errors.lastName}
                  </p>
                ) : null}
              </div>
            </div>

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
              {emailError ? (
                <p className="text-xs text-red-500">{emailError}</p>
              ) : null}
            </div>

            <PasswordField
              id="password"
              name="password"
              autoComplete="new-password"
              label="Password"
              icon={Lock}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="gender-trigger"
                  className="block text-[13px] font-semibold leading-[19.5px] text-[#364153]"
                >
                  Gender
                </Label>
                <div className="relative">
                  <User
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#D1D5DC]"
                  />
                  <SingleSelectDropdown
                    id="gender"
                    name="gender"
                    value={gender}
                    onValueChange={setGender}
                    options={genderOptions}
                    placeholder="Select gender"
                    menuLabel="Gender"
                    triggerClassName="pl-9 pr-9"
                  />
                </div>
                {actionData?.errors?.gender ? (
                  <p className="text-xs text-red-500">{actionData.errors.gender}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="occupation"
                  className="block text-[13px] font-semibold leading-[19.5px] text-[#364153]"
                >
                  Occupation
                </Label>
                <div className="relative">
                  <Briefcase
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D1D5DC]"
                  />
                  <Input
                    id="occupation"
                    name="occupation"
                    value={occupation}
                    onChange={(event) => setOccupation(event.target.value)}
                    placeholder="Strategist"
                    className="h-11 rounded-lg border-transparent bg-[#F8FAFC] py-2 pl-9 pr-3 text-[12.25px] font-medium text-[#1E293B] placeholder:text-[#C8D6E5] focus-visible:ring-[#2F6FE4]/30"
                  />
                </div>
                {actionData?.errors?.occupation ? (
                  <p className="text-xs text-red-500">
                    {actionData.errors.occupation}
                  </p>
                ) : null}
              </div>
            </div>

            <input
              type="hidden"
              name="agreeToDirectory"
              value={agreeToDirectory ? "1" : "0"}
            />
            <Label className="group flex items-center gap-2.5 text-[13px] font-medium leading-[19.5px] text-[#6A7282]">
              <Checkbox
                checked={agreeToDirectory}
                onCheckedChange={(checked) => setAgreeToDirectory(checked === true)}
                className="h-[17.5px] w-[17.5px] rounded-full border-[#E5E7EB] bg-[#F9FAFB] data-[state=checked]:border-[#2F6FE4] data-[state=checked]:bg-[#2F6FE4]"
              />
              I agree publicly to appear on the member directory
            </Label>

            <Button
              type="submit"
              disabled={!isCreateEnabled}
              className={`h-10 w-full rounded-lg text-sm font-medium transition-colors ${
                isCreateEnabled
                  ? "bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                  : "cursor-not-allowed bg-[#F1F5F9] text-[#0F172B] opacity-50"
              }`}
            >
              Create account
            </Button>
          </Form>
        </div>

        <p className="pt-0 text-center text-sm font-medium leading-[21px] text-[#6A7282]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#2F6FE4]">
            Sign in
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
