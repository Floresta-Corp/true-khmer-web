import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clock3,
  Gift,
  ImageIcon,
  Sparkle,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFetcher, useNavigate } from "react-router";
import FieldLabel from "~/components/field-label";
import IconButton from "~/components/icon-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SelectOption } from "~/components/ui/select-option";
import VolunteerDatePickerField from "~/features/volunteer/components/volunteer-date-picker-field";
import { resolveImageURL } from "~/lib/utils";
import type { VolunteerOpportunityInput } from "~/services/volunteer/volunteer-types";

export type VolunteerPostPage1Errors = {
  title?: string;
  categoryId?: string;
  locationId?: string;
  durationLabel?: string;
  commitmentLabel?: string;
  applicationDeadline?: string;
  coverImageKey?: string;
  overview?: string;
  benefitErrors?: string[];
};

function TextArea({
  placeholder,
  rows = 4,
  value,
  onChange,
}: {
  placeholder: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className="w-full min-h-15 resize-none rounded-lg border border-transparent bg-[#F8FAFC] px-4 py-3 text-sm font-medium leading-5 text-[#364153] placeholder:text-[#C8D6E5] focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

interface VolunteerPostPage1Props {
  formData: VolunteerOpportunityInput;
  errors?: VolunteerPostPage1Errors;
  setDetailErrors: Dispatch<SetStateAction<VolunteerPostPage1Errors>>;
  onUpdateField: <K extends keyof VolunteerOpportunityInput>(
    field: K,
    value: VolunteerOpportunityInput[K],
  ) => void;
  onContinueToRole: () => void;
  locations: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export default function VolunteerPostPage1({
  formData,
  errors,
  setDetailErrors,
  onUpdateField,
  onContinueToRole,
  locations,
  categories,
}: VolunteerPostPage1Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const fetcher = useFetcher();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  const [benefits, setBenefits] = useState(
    formData.benefits.map((benefit, index) => ({ id: index, value: benefit })),
  );

  const handleAddBenefit = () => {
    const newBenefit = { id: Date.now(), value: "" };
    setBenefits((prev) => [...prev, newBenefit]);
    onUpdateField("benefits", [...formData.benefits, ""]);
  };

  const handleBenefitChange = (id: number, value: string) => {
    setBenefits((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)));
    const newBenefits = benefits.map((b) => (b.id === id ? value : b.value));
    onUpdateField("benefits", newBenefits);
    setDetailErrors((prev) => ({ ...prev, benefitErrors: undefined }));
  };

  const handleRemoveBenefit = (id: number) => {
    setBenefits((prev) => prev.filter((b) => b.id !== id));
    const newBenefits = benefits.filter((b) => b.id !== id).map((b) => b.value);
    onUpdateField("benefits", newBenefits);
  };

  const handleCommunityImpactChange = (value: string) => {
    onUpdateField("communityImpact", value || (null as any));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validations
    const isImage = file.type.startsWith("image/");
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
    if (!isImage) {
      // TODO: surface error to UI
      setDetailErrors((prev) => ({
        ...prev,
        coverImageKey: "Selected file is not an image",
      }));
      return;
    }
    if (file.size > maxSizeInBytes) {
      // TODO: surface error to UI
      setDetailErrors((prev) => ({
        ...prev,
        coverImageKey: "Selected file is larger than 3MB",
      }));
      return;
    }

    // Use the uploaded file as the current image value for now.
    const url = URL.createObjectURL(file);

    console.log(file, url);

    // Template: update parent form with the selected file (or upload and set a key)
    // If your `onUpdateField` expects a storage key, replace this with an upload
    // routine that returns the key, then call onUpdateField('coverImageKey', uploadedKey)
    onUpdateField("coverImageKey", url as string);
  };

  // Sync successful upload with your main form state
  useEffect(() => {
    if (fetcher.data?.coverImageKey) {
      onUpdateField("coverImageKey", fetcher.data.coverImageKey);
      // Reset file input so re-selecting the same file triggers onChange again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [fetcher.data]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
        <h2 className="text-[22px] font-bold leading-8.25 text-[#344256]">
          Opportunity Details
          <span className="inline-block text-red-600">*</span>
        </h2>

        <div className="mt-6 border-t border-[#F3F4F6]" />

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <FieldLabel className="text-[13px] font-semibold leading-[19.5px] text-[#344256]">
              Opportunity name
            </FieldLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={(e) => onUpdateField("title", e.target.value)}
              placeholder="e.g., Digital Literacy for Artisans"
              aria-invalid={Boolean(errors?.title)}
              className={`h-12.5 rounded-[14px] bg-[#F8FAFC] px-4.5 text-sm font-medium text-[#364153] placeholder:text-[#C8D6E5] ${errors?.title ? "border-red-500" : "border-transparent"}`}
            />
            {errors?.title ? (
              <p className="text-xs text-red-500">{errors.title}</p>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Category</FieldLabel>
              <SelectOption
                triggerClassName={`h-11 w-full rounded-lg border bg-[#F8FAFC] px-3 text-sm font-medium text-[#6A7282] shadow-none hover:bg-[#F8FAFC] ${errors?.categoryId ? "border-red-500 ring-2 ring-red-500" : "border-transparent"}`}
                data={categories}
                defaultValue={formData.categoryId}
                onChange={(id) => onUpdateField("categoryId", id)}
                placeholder="e.g., Education"
              />
              {errors?.categoryId ? (
                <p className="text-xs text-red-500">{errors.categoryId}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <FieldLabel>Location</FieldLabel>
              <SelectOption
                triggerClassName={`h-11 w-full rounded-lg border bg-[#F8FAFC] px-3 text-sm font-medium text-[#6A7282] shadow-none hover:bg-[#F8FAFC] ${errors?.locationId ? "border-red-500 ring-2 ring-red-500" : "border-transparent"}`}
                data={locations}
                defaultValue={formData.locationId}
                onChange={(id) => onUpdateField("locationId", id)}
                placeholder="e.g., Phnom Penh"
              />
              {errors?.locationId ? (
                <p className="text-xs text-red-500">{errors.locationId}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Duration</FieldLabel>
              <div className="relative">
                <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                <Input
                  name="durationLabel"
                  value={formData.durationLabel}
                  onChange={(e) =>
                    onUpdateField("durationLabel", e.target.value)
                  }
                  placeholder="e.g., 3 months"
                  aria-invalid={Boolean(errors?.durationLabel)}
                  className={`h-11 rounded-lg bg-[#F8FAFC] pl-9 text-sm font-medium text-[#364153] placeholder:text-[#C8D6E5] ${errors?.durationLabel ? "border-red-500" : "border-transparent"}`}
                />
              </div>
              {errors?.durationLabel ? (
                <p className="text-xs text-red-500">{errors.durationLabel}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <FieldLabel>Commitment</FieldLabel>
              <div className="relative">
                <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
                <Input
                  name="commitmentLabel"
                  value={formData.commitmentLabel}
                  onChange={(e) =>
                    onUpdateField("commitmentLabel", e.target.value)
                  }
                  placeholder="e.g., 5 hours/week"
                  aria-invalid={Boolean(errors?.commitmentLabel)}
                  className={`h-11 rounded-lg bg-[#F8FAFC] pl-9 pr-9 text-sm font-medium text-[#364153] placeholder:text-[#C8D6E5] ${errors?.commitmentLabel ? "border-red-500" : "border-transparent"}`}
                />
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#99a1af]" />
              </div>
              {errors?.commitmentLabel ? (
                <p className="text-xs text-red-500">{errors.commitmentLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Application deadline</FieldLabel>
            <VolunteerDatePickerField
              value={formData.applicationDeadline}
              onChange={(value) => onUpdateField("applicationDeadline", value)}
              error={errors?.applicationDeadline}
            />
          </div>

          <div className="space-y-2">
            <FieldLabel className="mb-3 text-[13px] font-semibold leading-[19.5px] text-[#344256]">
              Cover Image
            </FieldLabel>
            <label className="flex h-37 w-fit cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-[#fafafa] px-4 py-3 text-center">
              {formData.coverImageKey ? (
                <img
                  // src={resolveImageURL(formData.coverImageKey)}
                  src={formData.coverImageKey}
                  alt="Selected cover"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="size-8 text-[#a3a3a3]" />

                  <p className="mt-3 text-xs font-semibold leading-4.5">
                    <span className="text-[#0ea5e9]">Click to upload</span>{" "}
                    <span className="text-[#525252]">or drag and drop</span>
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-[#a3a3a3]">
                    JPG or PNG • 3MB max
                    <br />
                    Recommended size: 1280 × 720 px (16:9)
                  </p>
                </>
              )}

              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            {errors?.coverImageKey ? (
              <p className="text-xs text-red-500">{errors.coverImageKey}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
        <h3 className="text-[22px] font-bold leading-8.25 text-[#1D283A]">
          Project Overview
          <span className="text-red-600">*</span>
        </h3>
        <div className="mt-3">
          <TextArea
            placeholder="What is this opportunity about and who is it for?"
            rows={3}
            value={formData.overview}
            onChange={(value) => onUpdateField("overview", value)}
          />
          {errors?.overview ? (
            <p className="mt-2 text-xs text-red-500">{errors.overview}</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="flex items-center gap-3 text-[22px] font-bold leading-8.25 text-[#344256]">
            <Gift className="size-6 text-blue-600" />
            Benefits
          </h3>
          <Button
            type="button"
            variant="ghost"
            className="h-auto px-0 py-0 text-xs font-semibold leading-4.5 text-[#2F6FE4] hover:text-[#245fca]"
            onClick={handleAddBenefit}
          >
            + Add point
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextArea
                      placeholder="e.g., Certificate of completion, networking, skill development"
                      rows={2}
                      value={benefit.value}
                      onChange={(value) =>
                        handleBenefitChange(benefit.id, value)
                      }
                    />
                  </div>
                  {benefits.length > 1 && (
                    <IconButton
                      ariaLabel={`Remove benefit row ${benefit.id}`}
                      icon={<Trash2 className="size-4 text-red-500" />}
                      onClick={() => handleRemoveBenefit(benefit.id)}
                      className="border"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
        <h3 className="flex items-center gap-3 text-[22px] font-bold leading-8.25 text-[#344256]">
          <Sparkle className="size-6 text-blue-600" />
          Community Impact
        </h3>
        <div className="mt-3">
          <TextArea
            placeholder="What change will volunteers help create?"
            rows={3}
            value={formData.communityImpact ?? ""}
            onChange={handleCommunityImpactChange}
          />
        </div>
      </section>

      <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-5 pb-5">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-lg border-[#E1E7EF] px-6 text-sm font-medium text-[#1D283A]"
          onClick={() => navigate("/volunteer")}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="cursor-pointer h-10 rounded-lg bg-[#2f6fe4] px-6 text-sm font-medium text-white hover:bg-[#245fca]"
          onClick={onContinueToRole}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
