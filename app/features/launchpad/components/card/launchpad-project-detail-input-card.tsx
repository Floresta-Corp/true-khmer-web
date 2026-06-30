import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import FieldLabel from "~/components/field-label";
import SectionInputCard from "~/components/section-input-card";
import { SelectOption } from "~/components/ui/select-option";
import VolunteerDatePickerField from "~/features/volunteer/components/volunteer-date-picker-field";

const PROJECT_LOGO_PLACEHOLDER = "/placeholder/images.svg";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const LOGO_MAX_FILE_SIZE = 5 * 1024 * 1024;
const COVER_MAX_FILE_SIZE = 10 * 1024 * 1024;

function isSupportedImageFile(file: File | null) {
  if (!file) return false;
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return !!extension && ALLOWED_IMAGE_EXTENSIONS.has(extension);
}

function getImageFileError(
  file: File | null,
  maxFileSize: number,
  label: string,
) {
  if (!file) return `${label} is required.`;
  if (!isSupportedImageFile(file))
    return "Invalid file type. Use JPG, JPEG, PNG, or WebP.";
  if (file.size > maxFileSize)
    return `${label} must be ${maxFileSize / (1024 * 1024)}MB or smaller.`;
  return null;
}

interface LaunchpadProjectDetailInputCardProps {
  name: string;
  categoryId: string;
  cityId: string;
  deadline: string;
  logoFile: File | null;
  coverFile: File | null;
  categories: { id: string; name: string }[];
  cities: { id: string; name: string }[];
  existingLogoUrl?: string;
  existingCoverUrl?: string;
  errors?: {
    name?: string;
    categoryId?: string;
    cityId?: string;
    deadline?: string;
    logoFile?: string;
    coverFile?: string;
  };
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
  onLogoChange: (file: File | null) => void;
  onCoverChange: (file: File | null) => void;
}

function toDateTimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  const local = new Date(date.getTime() - timezoneOffsetMs);
  return local.toISOString().slice(0, 16);
}

export default function LaunchpadProjectDetailInputCard({
  name,
  categoryId,
  cityId,
  deadline,
  logoFile,
  coverFile,
  categories,
  cities,
  existingLogoUrl,
  existingCoverUrl,
  errors,
  onNameChange,
  onCategoryChange,
  onCityChange,
  onDeadlineChange,
  onLogoChange,
  onCoverChange,
}: LaunchpadProjectDetailInputCardProps) {
  const projectNameErrorId = useId();
  const categoryErrorId = useId();
  const cityErrorId = useId();
  const deadlineErrorId = useId();
  const projectLogoInputId = useId();
  const projectCoverInputId = useId();
  const logoErrorId = useId();
  const coverErrorId = useId();
  const [projectLogoPreview, setProjectLogoPreview] = useState(
    PROJECT_LOGO_PLACEHOLDER,
  );
  const [projectCoverPreview, setProjectCoverPreview] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (logoFile) {
      const objectUrl = URL.createObjectURL(logoFile);
      setProjectLogoPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (existingLogoUrl) {
      setProjectLogoPreview(existingLogoUrl);
      return;
    }

    setProjectLogoPreview(PROJECT_LOGO_PLACEHOLDER);
  }, [logoFile, existingLogoUrl]);

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setProjectCoverPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (existingCoverUrl) {
      setProjectCoverPreview(existingCoverUrl);
      return;
    }

    setProjectCoverPreview(undefined);
  }, [coverFile, existingCoverUrl]);

  const handleProjectLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0] ?? null;
    const error = getImageFileError(file, LOGO_MAX_FILE_SIZE, "Project logo");
    if (error) {
      toast.error(error);
      onLogoChange(null);
    } else {
      onLogoChange(file);
    }
    event.currentTarget.value = "";
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;
    const error = getImageFileError(file, COVER_MAX_FILE_SIZE, "Project cover");
    if (error) {
      toast.error(error);
      onCoverChange(null);
    } else {
      onCoverChange(file);
    }
    event.currentTarget.value = "";
  };

  return (
    <SectionInputCard
      header={{
        title: "Project Details",
        required: true,
        icon: <Calendar size={17.5} className="text-blue-500" />,
      }}
    >
      <div className="space-y-3">
        <FieldLabel>Project name</FieldLabel>
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          aria-invalid={Boolean(errors?.name)}
          aria-describedby={errors?.name ? projectNameErrorId : undefined}
          placeholder="e.g., Digital Literacy for Artisans"
          className="h-12.5 rounded-xl px-4 border-none bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-blue-500/45 focus-visible:border-transparent aria-invalid:ring-1 aria-invalid:ring-red-400/60"
        />
        {errors?.name ? (
          <p id={projectNameErrorId} className="text-xs text-red-500">
            {errors.name}
          </p>
        ) : null}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel>Industry</FieldLabel>
          <SelectOption
            id="launchpad-categoryId"
            data={categories}
            defaultValue={categoryId}
            onChange={onCategoryChange}
            ariaInvalid={Boolean(errors?.categoryId)}
            ariaDescribedBy={errors?.categoryId ? categoryErrorId : undefined}
            placeholder="e.g., Education"
            triggerClassName="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC] focus:ring-blue-500/45 data-[state=open]:ring-blue-500/45 aria-invalid:ring-1 aria-invalid:ring-red-400/60"
          />
          {errors?.categoryId ? (
            <p id={categoryErrorId} className="text-xs text-red-500">
              {errors.categoryId}
            </p>
          ) : null}
        </div>
        <div className="space-y-3">
          <FieldLabel>Location</FieldLabel>
          <SelectOption
            id="launchpad-cityId"
            data={cities}
            defaultValue={cityId}
            onChange={onCityChange}
            ariaInvalid={Boolean(errors?.cityId)}
            ariaDescribedBy={errors?.cityId ? cityErrorId : undefined}
            placeholder="e.g., Phnom Penh"
            triggerClassName="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC] focus:ring-blue-500/45 data-[state=open]:ring-blue-500/45 aria-invalid:ring-1 aria-invalid:ring-red-400/60"
          />
          {errors?.cityId ? (
            <p id={cityErrorId} className="text-xs text-red-500">
              {errors.cityId}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <FieldLabel>Application deadline</FieldLabel>
        <VolunteerDatePickerField
          value={deadline}
          onChange={(value) => onDeadlineChange(value)}
          error={errors?.deadline}
          placeholder="Select application deadline"
        />
      </div>
      <div className="space-y-3">
        <FieldLabel>Project Logo</FieldLabel>
        <div className="h-25 w-25 mt-2">
          <label
            htmlFor={projectLogoInputId}
            className={`flex h-full w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed bg-[#f8fafc] p-4 transition-colors hover:bg-[#f1f5f9] ${errors?.logoFile ? "border-red-400 ring-1 ring-red-400/60" : "border-[#e1e7ef]"}`}
          >
            <img
              src={projectLogoPreview}
              alt="Project logo placeholder"
              className={cn(
                "h-8 w-8",
                projectLogoPreview !== PROJECT_LOGO_PLACEHOLDER &&
                  "h-full w-full rounded-xl object-cover",
              )}
            />
          </label>
          <input
            id={projectLogoInputId}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-invalid={Boolean(errors?.logoFile)}
            aria-describedby={errors?.logoFile ? logoErrorId : undefined}
            onChange={handleProjectLogoChange}
          />
        </div>
        <p className="text-[11px] text-gray-400">
          JPG, JPEG, PNG, or WebP • 5MB max
        </p>
        {errors?.logoFile ? (
          <p id={logoErrorId} className="text-xs text-red-500">
            {errors.logoFile}
          </p>
        ) : null}
      </div>
      <div className="space-y-3">
        <FieldLabel>Project Cover Image</FieldLabel>
        <div className="mt-2">
          <label htmlFor={projectCoverInputId}>
            <div className={`h-37 w-74.25 border border-dashed bg-gray-50 rounded-2xl text-center cursor-pointer hover:bg-gray-100 ${errors?.coverFile ? "border-red-400 ring-1 ring-red-400/60" : "border-gray-200"}`}>
              {projectCoverPreview ? (
                <img
                  src={projectCoverPreview}
                  alt="Project cover preview"
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <div className="p-6.5 flex flex-col items-center justify-center">
                  <img
                    className="size-8 mb-3.5"
                    src={PROJECT_LOGO_PLACEHOLDER}
                  />
                  <div className="text-blue-500 text-xs font-semibold">
                    Click to upload
                  </div>
                  <div className="text-[11px] text-gray-400 w-53.75">
                    JPG, JPEG, PNG, or WebP • 10MB max Recommended size: 1280 ×
                    720 px (16:9)
                  </div>
                </div>
              )}
            </div>
          </label>
          <input
            id={projectCoverInputId}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-invalid={Boolean(errors?.coverFile)}
            aria-describedby={errors?.coverFile ? coverErrorId : undefined}
            onChange={handleCoverChange}
          />
        </div>
        <p className="text-[11px] text-gray-400">
          JPG, JPEG, PNG, or WebP • 10MB max
        </p>
        {errors?.coverFile ? (
          <p id={coverErrorId} className="text-xs text-red-500">
            {errors.coverFile}
          </p>
        ) : null}

        {/* <Input
          id={projectCoverPreview}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleProjectCoverChange}
        /> */}
      </div>
    </SectionInputCard>
  );
}
