import { useState } from "react";
import { Form, Link, redirect, useActionData, useSearchParams } from "react-router";
import { Briefcase, Check, Lock, Mail, User, UserRound } from "lucide-react";
import type { Route } from "./+types/register";
import {
  AuthApiError,
  getAuthFieldError,
  registerUser,
} from "~/services/auth.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { FormDivider } from "~/components/auth/form-divider";
import { FormError } from "~/components/auth/form-error";
import { GoogleButton } from "~/components/auth/google-button";
import { InputField } from "~/components/auth/input-field";
import { AuthPageShell } from "~/components/auth/page-shell";
import { PasswordField } from "~/components/auth/password-field";
import { PrimaryButton } from "~/components/auth/primary-button";
import { SelectField } from "~/components/auth/select-field";

export async function loader({ request }: Route.LoaderArgs) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const firstName = String(formData.get("firstName") || "");
  const lastName = String(formData.get("lastName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const gender = String(formData.get("gender") || "");
  const occupation = String(formData.get("occupation") || "");
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  const errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: string;
    occupation?: string;
    password?: string;
    form?: string;
  } = {};

  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!email) errors.email = "Email is required";
  else if (!email.includes("@")) errors.email = "Must be a valid email";
  if (!gender) errors.gender = "Gender is required";
  if (!occupation) errors.occupation = "Occupation is required";
  if (!password) errors.password = "Password is required";
  else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) return { errors };

  try {
    const registerResponse = await registerUser(
      { email, password, firstName, lastName, gender, occupation },
      request,
    );

    return redirect(
      `/verify-otp?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}&otpSent=${registerResponse.otpSent ? "1" : "0"}&message=${encodeURIComponent(registerResponse.message || "")}`,
    );
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 400) {
        return {
          errors: {
            firstName: getAuthFieldError(error.details, "firstName"),
            lastName: getAuthFieldError(error.details, "lastName"),
            email: getAuthFieldError(error.details, "email"),
            gender: getAuthFieldError(error.details, "gender"),
            occupation: getAuthFieldError(error.details, "occupation"),
            password: getAuthFieldError(error.details, "password"),
            form: error.message,
          },
        };
      }

      if (error.status === 409) {
        return {
          errors: { email: "An account with this email already exists" },
        };
      }

      return { errors: { form: error.message } };
    }

    return {
      errors: {
        form:
          error instanceof Error
            ? `Registration failed: ${error.message}`
            : "Registration failed. Please try again.",
      },
    };
  }
}

export function meta() {
  return [{ title: "Register | True Khmer" }];
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

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

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

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
      contentClassName="w-full max-w-sm pb-2 pt-10 lg:pb-2 lg:pt-11"
      rightPanelContentClassName="text-[36px] font-medium text-[#111827]"
      showRightPanelOverlay={false}
    >
      <div className="mt-2 space-y-3 lg:mt-3 lg:space-y-4 xl:mt-6 xl:space-y-5 2xl:mt-[73px] 2xl:space-y-[30px]">
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
            <button
              type="button"
              onClick={() => setParticipation("member")}
              className={`flex-1 rounded-sm px-3 py-1.5 text-sm font-medium leading-5 transition-colors ${
                participation === "member"
                  ? "bg-[#2F6FE4] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  : "text-[#62748E]"
              }`}
            >
              Member
            </button>
            <button
              type="button"
              disabled
              className="flex-1 cursor-not-allowed rounded-sm px-3 py-1.5 text-sm font-medium leading-5 text-[#62748E] opacity-60"
            >
              Partner
            </button>
          </div>
        </div>

        <div className="space-y-2.5 lg:space-y-3 xl:space-y-4 2xl:space-y-[25px]">
          <GoogleButton />

          <FormDivider
            className="py-2"
            lineClassName="bg-[#F3F4F6]"
            labelClassName="text-[#D1D5DC]"
          />

          <FormError message={actionData?.errors?.form} />

          <Form
            method="post"
            className="space-y-2.5 lg:space-y-3 xl:space-y-3.5 2xl:space-y-[19px]"
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <InputField
                id="firstName"
                name="firstName"
                label="First name"
                icon={UserRound}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Socheata"
                error={actionData?.errors?.firstName}
              />

              <InputField
                id="lastName"
                name="lastName"
                label="Last name"
                icon={UserRound}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Mean"
                error={actionData?.errors?.lastName}
              />
            </div>

            <InputField
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email address"
              icon={Mail}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              error={actionData?.errors?.email}
            />

            <PasswordField
              id="password"
              name="password"
              autoComplete="new-password"
              label="Password"
              icon={Lock}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              error={actionData?.errors?.password}
            />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <SelectField
                id="gender"
                name="gender"
                label="Gender"
                icon={User}
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                error={actionData?.errors?.gender}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </SelectField>

              <InputField
                id="occupation"
                name="occupation"
                label="Occupation"
                icon={Briefcase}
                value={occupation}
                onChange={(event) => setOccupation(event.target.value)}
                placeholder="Strategist"
                error={actionData?.errors?.occupation}
              />
            </div>

            <label className="group flex items-center gap-2.5 text-[13px] font-medium leading-[19.5px] text-[#6A7282]">
              <span className="relative inline-flex h-[17.5px] w-[17.5px] items-center justify-center">
                <input
                  type="checkbox"
                  name="agreeToDirectory"
                  checked={agreeToDirectory}
                  onChange={(event) => setAgreeToDirectory(event.target.checked)}
                  className="peer h-[17.5px] w-[17.5px] appearance-none rounded-full border border-[#E5E7EB] bg-[#F9FAFB] checked:border-[#2F6FE4] checked:bg-[#2F6FE4]"
                />
                <Check
                  size={11}
                  strokeWidth={3}
                  className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100"
                />
              </span>
              I agree publicly to appear on the member directory
            </label>

            <PrimaryButton type="submit" disabled={!isCreateEnabled}>
              Create account
            </PrimaryButton>
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
