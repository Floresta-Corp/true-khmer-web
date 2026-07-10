import { useEffect, useId, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LogoSvg from "../../../../public/logoSvg";

import { Button } from "~/components/ui/button";
import { partnerRegistrationAction } from "../services/partner-registration.action";
import { partnerSectorOptions } from "../data/sector-options";
import { TextField } from "../components/text-field";
import { SearchableField } from "../components/searchable-field";
import { CountryField } from "../components/country-field";
import { PhoneField } from "../components/phone-field";

export const action = partnerRegistrationAction;

export function meta() {
  return [
    { title: "Partner Registration | True Khmer" },
    { name: "description", content: "Register as a partner with us today." },
  ];
}

type ActionData = {
  ok: boolean;
  error?: string;
  validationErrors?: Record<string, string>;
};

export default function PartnerRegistration() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const sectorId = useId();
  const countryId = useId();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    companyName: "",
    registrationNumber: "",
    companyEmail: "",
    sectorOfActivity: "",
    companyAddress: "",
    city: "",
    zipCode: "",
    country: "",
    companyContactNumber: "",
    website: "",
    companyTelegram: "",
    companyFacebookUrl: "",
    companyLinkedinUrl: "",
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
      <div className="flex min-h-screen flex-col items-center overflow-hidden bg-white p-5 lg:py-10 xl:px-24 dark:bg-slate-950">
        <div className="flex w-full max-w-4xl flex-col items-center gap-4 lg:gap-10">
          <div className="mb-6 flex w-full items-center justify-center">
            <LogoSvg className="text-[#1e3a8a]" width={200} height={80} />
          </div>
          <div className="mb-5 flex flex-col items-center gap-2 md:mb-6">
            <h1 className="text-center text-3xl font-semibold text-[#1e3a8a] dark:text-white">
              Partner Registration
            </h1>
            <p className="mt-2 max-w-md text-center text-base text-slate-500 dark:text-slate-400">
              Please fill in the required information, and our team will contact
              you to proceed with your admission.
            </p>
          </div>

          <div className="flex w-full flex-col justify-center lg:flex-row">
            <Form
              method="post"
              className="w-full space-y-5 lg:w-auto lg:space-y-7"
            >
              <TextField
                id="companyName"
                name="companyName"
                label="Company Name"
                placeholder="Enter your company name"
                value={values.companyName}
                onChange={set("companyName")}
                required
                disabled={isSubmitting}
                error={formErrors.companyName}
              />

              <TextField
                id="registrationNumber"
                name="registrationNumber"
                label="Registration Number"
                placeholder="Enter your registration number"
                value={values.registrationNumber}
                onChange={set("registrationNumber")}
                disabled={isSubmitting}
                error={formErrors.registrationNumber}
              />

              <TextField
                id="companyEmail"
                name="companyEmail"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={values.companyEmail}
                onChange={set("companyEmail")}
                required
                disabled={isSubmitting}
                error={formErrors.companyEmail}
              />

              <SearchableField
                id={sectorId}
                name="sectorOfActivity"
                label="Sector of Activity"
                placeholder="Search or select your sector of activity"
                value={values.sectorOfActivity}
                onChange={set("sectorOfActivity")}
                options={partnerSectorOptions}
                required
                disabled={isSubmitting}
                error={formErrors.sectorOfActivity}
              />

              <TextField
                id="companyAddress"
                name="companyAddress"
                label="Address"
                placeholder="House number, street name, etc."
                value={values.companyAddress}
                onChange={set("companyAddress")}
                required
                disabled={isSubmitting}
                error={formErrors.companyAddress}
              />

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <TextField
                  id="city"
                  name="city"
                  label="City"
                  placeholder="Enter your city"
                  value={values.city}
                  onChange={set("city")}
                  required
                  disabled={isSubmitting}
                  error={formErrors.city}
                />
                <TextField
                  id="zipCode"
                  name="zipCode"
                  label="ZIP Code"
                  placeholder="Enter your postal code"
                  value={values.zipCode}
                  onChange={set("zipCode")}
                  disabled={isSubmitting}
                  error={formErrors.zipCode}
                />
              </div>

              <CountryField
                id={countryId}
                name="country"
                label="Country"
                required
                disabled={isSubmitting}
                onChange={set("country")}
                error={formErrors.country}
              />

              <PhoneField
                id="companyContactNumber"
                name="companyContactNumber"
                label="Contact Number"
                required
                disabled={isSubmitting}
                onChange={set("companyContactNumber")}
                error={formErrors.companyContactNumber}
              />

              <TextField
                id="website"
                name="website"
                label="Website"
                type="url"
                placeholder="Enter your website URL"
                value={values.website}
                onChange={set("website")}
                disabled={isSubmitting}
                error={formErrors.website}
              />

              <TextField
                id="companyTelegram"
                name="companyTelegram"
                label="Telegram"
                placeholder="Telegram username without @"
                value={values.companyTelegram}
                onChange={set("companyTelegram")}
                disabled={isSubmitting}
                error={formErrors.companyTelegram}
              />

              <TextField
                id="companyFacebookUrl"
                name="companyFacebookUrl"
                label="Facebook URL"
                type="url"
                placeholder="Enter your Facebook profile URL"
                value={values.companyFacebookUrl}
                onChange={set("companyFacebookUrl")}
                disabled={isSubmitting}
                error={formErrors.companyFacebookUrl}
              />

              <TextField
                id="companyLinkedinUrl"
                name="companyLinkedinUrl"
                label="LinkedIn URL"
                type="url"
                placeholder="Enter your LinkedIn profile URL"
                value={values.companyLinkedinUrl}
                onChange={set("companyLinkedinUrl")}
                disabled={isSubmitting}
                error={formErrors.companyLinkedinUrl}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full gap-2 bg-blue-600 px-6 font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Package Selection"
                )}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
