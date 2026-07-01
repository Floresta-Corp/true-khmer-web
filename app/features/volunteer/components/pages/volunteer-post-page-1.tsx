import { ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import FieldLabel from "~/components/field-label";
import IconButton from "~/components/icon-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SelectOption } from "~/components/ui/select-option";
import { Textarea } from "~/components/ui/textarea";
import VolunteerDatePickerField from "~/features/volunteer/components/volunteer-date-picker-field";
import VolunteerDateRangeField from "../volunteer-date-range-field";
import BenefitsSection from "../benefits-section";
import CommitmentSection from "../commitment-section";
import ImpactSection from "../impact-section";
import type { FormDataVolunteerInput } from "~/features/volunteer/types";
import { cn } from "~/lib/utils";

export type VolunteerPostPage1Errors = {
  title?: string;
  categoryId?: string;
  locationId?: string;
  dateRange?: string;
  commitmentLabel?: string;
  applicationDeadline?: string;
  coverImageKey?: string;
  overview?: string;
  benefitErrors?: string[];
};

function CustomTextarea({
  placeholder,
  rows = 4,
  value,
  onChange,
  id,
  hasError,
}: {
  placeholder: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  hasError?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <textarea
      ref={textareaRef}
      id={id}
      className={cn(
        "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-sm font-medium leading-5 text-[#364153] placeholder:text-[#C8D6E5] focus:outline-none",
        "border",
        hasError
          ? "border-red-500 ring-2 ring-red-200 focus:ring-red-500"
          : "border-transparent focus:ring-2 focus:ring-blue-500/45",
      )}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      rows={rows}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${id}-error` : undefined}
    />
  );
}

interface VolunteerPostPage1Props {
  formData: FormDataVolunteerInput;
  errors?: VolunteerPostPage1Errors;
  setDetailErrors: Dispatch<SetStateAction<VolunteerPostPage1Errors>>;
  onUpdateField: <K extends keyof FormDataVolunteerInput>(
    field: K,
    value: FormDataVolunteerInput[K],
  ) => void;
  onCoverImageSelect: (file: File) => void;
  onCoverImageClear: () => void;
  onContinueToRole: () => void;
  locations: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export default function VolunteerPostPage1({
  formData,
  errors,
  setDetailErrors,
  onUpdateField,
  onCoverImageSelect,
  onCoverImageClear,
  onContinueToRole,
  locations,
  categories,
}: VolunteerPostPage1Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

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

  const [benefits, setBenefits] = useState(() =>
    formData.benefits && formData.benefits.length > 0
      ? formData.benefits.map((benefit, index) => ({
          id: index,
          value: benefit,
        }))
      : [{ id: Date.now(), value: "" }],
  );

  const handleAddBenefit = () => {
    const newBenefit = { id: Date.now(), value: "" };
    setBenefits((prev) => {
      const next = [...prev, newBenefit];
      onUpdateField(
        "benefits",
        next.map((b) => b.value),
      );
      return next;
    });
  };

  const handleBenefitChange = (id: number, value: string) => {
    setBenefits((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, value } : b));
      onUpdateField(
        "benefits",
        next.map((b) => b.value),
      );
      return next;
    });
    setDetailErrors((prev) => ({ ...prev, benefitErrors: undefined }));
  };

  const handleRemoveBenefit = (id: number) => {
    setBenefits((prev) => {
      const next = prev.filter((b) => b.id !== id);
      onUpdateField(
        "benefits",
        next.map((b) => b.value),
      );
      return next;
    });
  };

  const handleCommunityImpactChange = (value: string) => {
    onUpdateField("communityImpact", value || (null as any));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validations
    const isImage = file.type.startsWith("image/");
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (!isImage) {
      toast.error("Selected file is not an image");
      setDetailErrors((prev) => ({
        ...prev,
        coverImageKey: "Selected file is not an image",
      }));
      return;
    }
    if (file.size > maxSizeInBytes) {
      toast.error("Selected file is larger than 5MB");
      setDetailErrors((prev) => ({
        ...prev,
        coverImageKey: "Selected file is larger than 5MB",
      }));
      return;
    }

    onUpdateField("coverImageKey", {
      file,
      value: URL.createObjectURL(file),
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [previewHovered, setPreviewHovered] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
        <h2 className="text-[22px] font-bold leading-8.25 text-[#344256]">
          Opportunity Details
          <span className="inline-block text-red-600">*</span>
        </h2>

        <div className="mt-6 border-t border-[#F3F4F6]" />

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <FieldLabel className="text-[13px] font-semibold leading-[19.5px] text-[#344256]">
              Opportunity name
            </FieldLabel>
            <Input
              ref={titleInputRef}
              name="title"
              value={formData.title}
              onChange={(e) => onUpdateField("title", e.target.value)}
              placeholder="e.g., Digital Literacy for Artisans"
              aria-invalid={Boolean(errors?.title)}
              className={`h-12.5 rounded-[14px] bg-[#F8FAFC] px-4.5 text-sm text-[#364153] placeholder:text-[#C8D6E5] focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:border-transparent ${errors?.title ? "border-red-500" : "border-transparent"}`}
            />
            {errors?.title ? (
              <p className="text-xs text-red-500">{errors.title}</p>
            ) : null}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <FieldLabel>Category</FieldLabel>
              <SelectOption
                id="categoryId"
                triggerClassName="h-11 w-full rounded-[14px] border border-[#E1E7EF] bg-[#F8FAFC] px-3 text-sm font-medium text-black shadow-none hover:bg-[#F8FAFC] focus:ring-blue-500/45 data-[state=open]:ring-blue-500/45"
                ariaInvalid={Boolean(errors?.categoryId)}
                data={categories}
                defaultValue={formData.categoryId}
                onChange={(id) => onUpdateField("categoryId", id)}
                placeholder="e.g., Education"
              />
              {errors?.categoryId ? (
                <p className="text-xs text-red-500">{errors.categoryId}</p>
              ) : null}
            </div>

            <div className="space-y-4">
              <FieldLabel>Location</FieldLabel>
              <SelectOption
                id="locationId"
                triggerClassName="h-11 w-full rounded-[14px] border border-[#E1E7EF] bg-[#F8FAFC] px-3 text-sm font-medium text-black shadow-none hover:bg-[#F8FAFC] focus:ring-blue-500/45 data-[state=open]:ring-blue-500/45"
                ariaInvalid={Boolean(errors?.locationId)}
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
            <div className="space-y-4">
              <FieldLabel>Start from - End at</FieldLabel>
              <VolunteerDateRangeField
                startDate={formData.startDate}
                endDate={formData.endDate}
                onChange={({ startDate, endDate }) => {
                  onUpdateField("startDate", startDate);
                  onUpdateField("endDate", endDate);
                }}
                error={errors?.dateRange}
              />
            </div>

            <div className="space-y-4">
              <FieldLabel>Application deadline</FieldLabel>
              <VolunteerDatePickerField
                value={formData.applicationDeadline}
                onChange={(value) =>
                  onUpdateField("applicationDeadline", value)
                }
                error={errors?.applicationDeadline}
              />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel className="mb-3.5 text-[13px] font-semibold leading-[19.5px] text-[#344256]">
              Cover Image
            </FieldLabel>
            <label
              id="coverImageKey"
              tabIndex={0}
              role="button"
              htmlFor="coverImageKey-input"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" ||
                  e.key === " " ||
                  e.key === "Spacebar"
                ) {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={cn(
                "relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl bg-[#fafafa] px-4 py-3 text-center",
                errors?.coverImageKey
                  ? "border border-red-500 ring-4 ring-red-200"
                  : "border border-dashed border-[#e5e5e5]",
              )}
              aria-invalid={Boolean(errors?.coverImageKey)}
              aria-describedby={
                errors?.coverImageKey ? "coverImageKey-error" : undefined
              }
            >
              {formData.coverImageKey?.value ? (
                <motion.div
                  onHoverStart={() => setPreviewHovered(true)}
                  onHoverEnd={() => setPreviewHovered(false)}
                >
                  <img
                    src={formData.coverImageKey.value}
                    alt="Selected cover"
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <motion.span
                    className="absolute top-3 right-3 z-10"
                    initial={{ y: -8, opacity: 0 }}
                    animate={
                      previewHovered
                        ? { y: 0, opacity: 1 }
                        : { y: -8, opacity: 0 }
                    }
                    transition={{ duration: 0.18 }}
                    style={{ pointerEvents: previewHovered ? "auto" : "none" }}
                  >
                    <IconButton
                      icon={<Trash2 className="h-4 w-4" />}
                      ariaLabel="Clear cover image"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onUpdateField("coverImageKey", {
                          file: null,
                          value: "",
                        });
                        setDetailErrors((prev) => ({
                          ...prev,
                          coverImageKey: undefined,
                        }));
                        onCoverImageClear();
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                    />
                  </motion.span>
                </motion.div>
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
                id="coverImageKey-input"
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                aria-required={true}
              />
            </label>
            {errors?.coverImageKey ? (
              <p id="coverImageKey-error" className="mt-2 text-xs text-red-500">
                {errors.coverImageKey}
              </p>
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
          <CustomTextarea
            id="overview"
            placeholder="What is this opportunity about and who is it for?"
            rows={3}
            value={formData.overview}
            onChange={(value) => onUpdateField("overview", value)}
            hasError={Boolean(errors?.overview)}
          />
          {errors?.overview ? (
            <p id="overview-error" className="mt-2 text-xs text-red-500">
              {errors.overview}
            </p>
          ) : null}
        </div>
      </section>

      <CommitmentSection
        commitmentLabel={formData.commitmentLabel ?? ""}
        commitmentDescription={formData.commitmentDescription ?? ""}
        onChangeLabel={(value) => onUpdateField("commitmentLabel", value)}
        onChangeDescription={(value) =>
          onUpdateField("commitmentDescription", value)
        }
        commitmentLabelError={errors?.commitmentLabel}
        CustomTextarea={CustomTextarea}
      />

      <BenefitsSection
        benefits={benefits}
        benefitErrors={errors?.benefitErrors}
        onAdd={handleAddBenefit}
        onChange={handleBenefitChange}
        onRemove={handleRemoveBenefit}
        CustomTextarea={CustomTextarea}
      />

      <ImpactSection
        value={formData.communityImpact ?? ""}
        onChange={handleCommunityImpactChange}
        CustomTextarea={CustomTextarea}
      />

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
