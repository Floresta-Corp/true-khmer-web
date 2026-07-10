import { useEffect, useId, useState } from "react";
import { Form, useActionData, useNavigate, useNavigation } from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LogoSvg from "../../../../public/logoSvg";

import { Button } from "~/components/ui/button";
import { contactPersonLoader } from "../services/contact-person.loader";
import { contactPersonAction } from "../services/contact-person.action";
import {
  genderoptions,
  partnerEmployeePositionOptions,
  titleOptions,
} from "../data/sector-options";
import { TextField } from "../components/text-field";
import { SearchableField } from "../components/searchable-field";
import { PhoneField } from "../components/phone-field";

export const loader = contactPersonLoader;
export const action = contactPersonAction;

export function meta() {
  return [
    { title: "Contact Person Information | True Khmer" },
    {
      name: "description",
      content: "Provide contact person information for partner registration.",
    },
  ];
}

type ActionData = {
  ok: boolean;
  error?: string;
  validationErrors?: Record<string, string>;
};

export default function ContactPerson() {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const titleId = useId();
  const genderId = useId();
  const positionId = useId();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    title: "",
    gender: "",
    userEmail: "",
    userIdentity: "",
    position: "",
    userContactNumber: "",
    userTelegram: "",
    userFacebookUrl: "",
    userLinkedinUrl: "",
  });

  useEffect(() => {
    if (actionData?.validationErrors) setFormErrors(actionData.validationErrors);
    else if (actionData?.error) {
      setFormErrors({});
      toast.error(actionData.error);
    }
  }, [actionData]);

  const set = (name: keyof typeof values) => (value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/images/registerBG2.webp')] bg-cover bg-no-repeat">
      <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white p-5 lg:py-10 xl:px-24 dark:bg-slate-950">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 h-auto gap-2 px-0 py-0 text-slate-700 hover:bg-transparent hover:text-blue-600 lg:left-6 lg:top-6 dark:text-slate-300"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Go back</span>
        </Button>

        <div className="flex w-full max-w-4xl flex-col items-center gap-4 lg:gap-10">
          <div className="mb-6 flex w-full items-center justify-center">
            <LogoSvg className="text-[#1e3a8a]" width={200} height={80} />
          </div>
          <div className="mb-5 flex flex-col items-center gap-2 md:mb-6">
            <h1 className="text-center text-3xl font-semibold text-[#1e3a8a] dark:text-white">
              Last Step of Registration
            </h1>
            <p className="mt-2 max-w-md text-center text-base text-slate-500 dark:text-slate-400">
              Please fill in the contact person information, and our team will
              contact you to proceed with your admission.
            </p>
          </div>

          <div className="flex w-full flex-col justify-center lg:flex-row">
            <Form
              method="post"
              className="w-full space-y-5 lg:w-auto lg:space-y-7"
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="Given Name"
                  value={values.firstName}
                  onChange={set("firstName")}
                  required
                  disabled={isSubmitting}
                  error={formErrors.firstName}
                />
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Family Name"
                  value={values.lastName}
                  onChange={set("lastName")}
                  required
                  disabled={isSubmitting}
                  error={formErrors.lastName}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <SearchableField
                  id={titleId}
                  name="title"
                  label="Title"
                  placeholder="Select your title"
                  value={values.title}
                  onChange={set("title")}
                  options={titleOptions}
                  required
                  disabled={isSubmitting}
                  error={formErrors.title}
                />
                <SearchableField
                  id={genderId}
                  name="gender"
                  label="Gender"
                  placeholder="Select your gender"
                  value={values.gender}
                  onChange={set("gender")}
                  options={genderoptions}
                  required
                  disabled={isSubmitting}
                  error={formErrors.gender}
                />
              </div>

              <TextField
                id="userEmail"
                name="userEmail"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={values.userEmail}
                onChange={set("userEmail")}
                required
                disabled={isSubmitting}
                error={formErrors.userEmail}
              />

              <TextField
                id="userIdentity"
                name="userIdentity"
                label="ID / Passport Number"
                placeholder="Enter your ID or Passport Number"
                value={values.userIdentity}
                onChange={set("userIdentity")}
                disabled={isSubmitting}
                error={formErrors.userIdentity}
              />

              <SearchableField
                id={positionId}
                name="position"
                label="Position"
                placeholder="Search or select your position"
                value={values.position}
                onChange={set("position")}
                options={partnerEmployeePositionOptions}
                required
                disabled={isSubmitting}
                error={formErrors.position}
              />

              <PhoneField
                id="userContactNumber"
                name="userContactNumber"
                label="Contact Number"
                required
                disabled={isSubmitting}
                onChange={set("userContactNumber")}
                error={formErrors.userContactNumber}
              />

              <TextField
                id="userTelegram"
                name="userTelegram"
                label="Telegram"
                placeholder="Telegram username without @"
                value={values.userTelegram}
                onChange={set("userTelegram")}
                disabled={isSubmitting}
                error={formErrors.userTelegram}
              />

              <TextField
                id="userFacebookUrl"
                name="userFacebookUrl"
                label="Facebook"
                type="url"
                placeholder="Enter your Facebook profile URL"
                value={values.userFacebookUrl}
                onChange={set("userFacebookUrl")}
                disabled={isSubmitting}
                error={formErrors.userFacebookUrl}
              />

              <TextField
                id="userLinkedinUrl"
                name="userLinkedinUrl"
                label="LinkedIn"
                type="url"
                placeholder="Enter your LinkedIn profile URL"
                value={values.userLinkedinUrl}
                onChange={set("userLinkedinUrl")}
                disabled={isSubmitting}
                error={formErrors.userLinkedinUrl}
              />

              <Button
                type="submit"
                title="Double-check your information before submitting."
                disabled={isSubmitting}
                className="h-12 w-full gap-2 bg-blue-600 px-6 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Join as a Partner"
                )}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
