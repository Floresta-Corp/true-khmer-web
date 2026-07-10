import { useEffect, useId, useState } from "react";
import {
  Link,
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { CountryField } from "~/components/form/country-field";
import { PhoneField } from "~/components/form/phone-field";
import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import {
  FormField,
  FormSectionHeading,
  PartnerSelectField,
  PartnerTextField,
} from "../partner-form-field";
import {
  packageOptions,
  partnerEmployeePositionOptions,
  partnerSectorOptions,
} from "../partner-options";
import type { partnerNewAction } from "../../services/partner-new.action";

const INITIAL_VALUES = {
  companyName: "",
  registrationNumber: "",
  companyEmail: "",
  companyContactNumber: "",
  sectorOfActivity: "",
  companyAddress: "",
  city: "",
  zipCode: "",
  country: "",
  website: "",
  companyFacebookUrl: "",
  companyLinkedinUrl: "",
  companyTelegram: "",
  package: "",
  bio: "",
  description: "",

  firstName: "",
  lastName: "",
  userEmail: "",
  userIdentity: "",
  position: "",
  userContactNumber: "",
  userFacebookUrl: "",
  userLinkedinUrl: "",
  userTelegram: "",
};

type FormValues = typeof INITIAL_VALUES;

export default function PartnerNewPage() {
  const actionData = useActionData<typeof partnerNewAction>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (
      actionData &&
      "validationErrors" in actionData &&
      actionData.validationErrors
    ) {
      setErrors(actionData.validationErrors);
    }
    if (actionData && "error" in actionData && actionData.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  function handleChange(name: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleSaveConfirm() {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value),
    );
    submit(formData, { method: "post" });
    setShowSaveModal(false);
  }

  const companyNameId = useId();
  const registrationNumberId = useId();
  const companyEmailId = useId();
  const companyContactNumberId = useId();
  const sectorOfActivityId = useId();
  const companyAddressId = useId();
  const cityId = useId();
  const zipCodeId = useId();
  const countryId = useId();
  const websiteId = useId();
  const companyFacebookUrlId = useId();
  const companyLinkedinUrlId = useId();
  const companyTelegramId = useId();
  const packageId = useId();
  const bioId = useId();
  const descriptionId = useId();

  const firstNameId = useId();
  const lastNameId = useId();
  const userEmailId = useId();
  const userIdentityId = useId();
  const positionId = useId();
  const userContactNumberId = useId();
  const userFacebookUrlId = useId();
  const userLinkedinUrlId = useId();
  const userTelegramId = useId();

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/tk-admin/partners"
            className="hover:text-slate-900 dark:hover:text-white"
          >
            Partners
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">
            Create New Partner
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Create New Partner
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Add a new partner to the system
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setShowCancelModal(true)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowSaveModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Partner"
              )}
            </Button>
          </div>
        </div>

        {/* Company information */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FormSectionHeading title="Company Information" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PartnerTextField
              id={companyNameId}
              label="Company Name"
              required
              error={errors.companyName}
              value={values.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Enter company name"
              disabled={isSubmitting}
            />

            <PartnerTextField
              id={registrationNumberId}
              label="Registration Number"
              error={errors.registrationNumber}
              value={values.registrationNumber}
              onChange={(e) =>
                handleChange("registrationNumber", e.target.value)
              }
              placeholder="Enter company registration number"
              disabled={isSubmitting}
            />

            <PartnerTextField
              id={companyEmailId}
              label="Company Email"
              type="email"
              required
              error={errors.companyEmail}
              value={values.companyEmail}
              onChange={(e) => handleChange("companyEmail", e.target.value)}
              placeholder="Enter company email"
              disabled={isSubmitting}
            />

            <PartnerSelectField
              id={packageId}
              label="Package"
              required
              error={errors.package}
              value={values.package}
              onValueChange={(value) => handleChange("package", value)}
              placeholder="Select package"
              disabled={isSubmitting}
              options={packageOptions}
            />

            <PhoneField
              id={companyContactNumberId}
              name="companyContactNumber"
              label="Company Phone Number"
              required
              error={errors.companyContactNumber}
              value={values.companyContactNumber}
              onChange={(value) => handleChange("companyContactNumber", value)}
              disabled={isSubmitting}
            />

            <PartnerTextField
              id={companyAddressId}
              label="Company Address"
              required
              error={errors.companyAddress}
              value={values.companyAddress}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              placeholder="Enter company address"
              disabled={isSubmitting}
            />

            <CountryField
              id={countryId}
              name="country"
              label="Country"
              required
              error={errors.country}
              value={values.country}
              onChange={(value) => handleChange("country", value)}
              disabled={isSubmitting}
            />

            <PartnerTextField
              id={cityId}
              label="City"
              required
              error={errors.city}
              value={values.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter city"
              disabled={isSubmitting}
            />

            <PartnerTextField
              id={zipCodeId}
              label="ZIP Code"
              error={errors.zipCode}
              value={values.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              placeholder="Enter ZIP code"
              disabled={isSubmitting}
            />

            <PartnerSelectField
              id={sectorOfActivityId}
              label="Sector of Activity"
              required
              error={errors.sectorOfActivity}
              value={values.sectorOfActivity}
              onValueChange={(value) => handleChange("sectorOfActivity", value)}
              placeholder="Select business sector"
              disabled={isSubmitting}
              options={partnerSectorOptions}
            />

            <PartnerTextField
              id={websiteId}
              label="Company Website"
              type="url"
              fieldClassName="lg:col-span-2"
              error={errors.website}
              value={values.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://www.company.com"
              disabled={isSubmitting}
            />

            <FormField
              id={bioId}
              label="Company Bio"
              className="lg:col-span-2"
              error={errors.bio}
            >
              <Textarea
                id={bioId}
                value={values.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Enter a brief company bio (max 300 characters)"
                rows={3}
                maxLength={300}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.bio)}
              />
            </FormField>

            <FormField
              id={descriptionId}
              label="Company Description"
              className="lg:col-span-2"
              error={errors.description}
            >
              <Textarea
                id={descriptionId}
                value={values.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter detailed company description"
                rows={5}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.description)}
              />
            </FormField>
          </div>

          <div className="my-6 border-t border-slate-100 dark:border-slate-800" />

          <FormSectionHeading
            title="Company Social Media (Optional)"
            accent="slate"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <PartnerTextField
              id={companyFacebookUrlId}
              label="Facebook URL"
              type="url"
              error={errors.companyFacebookUrl}
              value={values.companyFacebookUrl}
              onChange={(e) =>
                handleChange("companyFacebookUrl", e.target.value)
              }
              placeholder="https://facebook.com/company"
              disabled={isSubmitting}
            />
            <PartnerTextField
              id={companyLinkedinUrlId}
              label="LinkedIn URL"
              type="url"
              error={errors.companyLinkedinUrl}
              value={values.companyLinkedinUrl}
              onChange={(e) =>
                handleChange("companyLinkedinUrl", e.target.value)
              }
              placeholder="https://linkedin.com/company/company"
              disabled={isSubmitting}
            />
            <PartnerTextField
              id={companyTelegramId}
              label="Telegram"
              error={errors.companyTelegram}
              value={values.companyTelegram}
              onChange={(e) => handleChange("companyTelegram", e.target.value)}
              placeholder="without @ just username"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Contact person information */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FormSectionHeading title="Contact Person Information" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PartnerTextField
              id={firstNameId}
              label="First Name"
              required
              error={errors.firstName}
              value={values.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Enter first name"
              disabled={isSubmitting}
            />
            <PartnerTextField
              id={lastNameId}
              label="Last Name"
              required
              error={errors.lastName}
              value={values.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Enter last name"
              disabled={isSubmitting}
            />
            <PartnerTextField
              id={userEmailId}
              label="Contact Person Email"
              type="email"
              required
              error={errors.userEmail}
              value={values.userEmail}
              onChange={(e) => handleChange("userEmail", e.target.value)}
              placeholder="Enter contact person email"
              disabled={isSubmitting}
            />
            <PartnerTextField
              id={userIdentityId}
              label="ID / Passport Number"
              error={errors.userIdentity}
              value={values.userIdentity}
              onChange={(e) => handleChange("userIdentity", e.target.value)}
              placeholder="Enter ID or passport number"
              disabled={isSubmitting}
            />
            <PartnerSelectField
              id={positionId}
              label="Position"
              required
              error={errors.position}
              value={values.position}
              onValueChange={(value) => handleChange("position", value)}
              placeholder="Select position"
              disabled={isSubmitting}
              options={partnerEmployeePositionOptions}
            />
            <PhoneField
              id={userContactNumberId}
              name="userContactNumber"
              label="Contact Person Phone"
              required
              error={errors.userContactNumber}
              value={values.userContactNumber}
              onChange={(value) => handleChange("userContactNumber", value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="my-6 border-t border-slate-100 dark:border-slate-800" />

          <FormSectionHeading title="Social Media (Optional)" accent="slate" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <PartnerTextField
              id={userFacebookUrlId}
              label="Facebook URL"
              type="url"
              error={errors.userFacebookUrl}
              value={values.userFacebookUrl}
              onChange={(e) => handleChange("userFacebookUrl", e.target.value)}
              placeholder="https://facebook.com/username"
              disabled={isSubmitting}
            />
            <PartnerTextField
              id={userLinkedinUrlId}
              label="LinkedIn URL"
              type="url"
              error={errors.userLinkedinUrl}
              value={values.userLinkedinUrl}
              onChange={(e) => handleChange("userLinkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              disabled={isSubmitting}
            />
            <PartnerTextField
              id={userTelegramId}
              label="Telegram"
              error={errors.userTelegram}
              value={values.userTelegram}
              onChange={(e) => handleChange("userTelegram", e.target.value)}
              placeholder="@username or link"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSaveConfirm}
        title="Create Partner"
        message="Are you sure you want to create this partner? The partner will be immediately active in the system."
        confirmText="Create"
        cancelText="Cancel"
        variant="info"
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => navigate("/tk-admin/partners")}
        title="Discard Changes"
        message="Are you sure you want to cancel? Any unsaved changes will be lost."
        confirmText="Discard"
        cancelText="Continue Editing"
        variant="warning"
      />
    </main>
  );
}
