import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Input } from "~/components/ui/input";
import { Calendar, Trash2 } from "lucide-react";
import FieldLabel from "~/components/field-label";
import IconButton from "~/components/icon-button";
import SectionInputCard from "~/components/section-input-card";
import { SelectOption } from "~/components/ui/select-option";
import VolunteerDatePickerField from "~/features/volunteer/components/volunteer-date-picker-field";
import {
  COVER_MAX_FILE_SIZE,
  getImageFileError,
} from "~/features/launchpad/lib/launchpad-image-validation";

const PROJECT_IMAGE_PLACEHOLDER = "/placeholder/images.svg";

interface LaunchpadProjectDetailInputCardProps {
  name: string;
  categoryId: string;
  cityId: string;
  deadline: string;
  coverFile: File | null;
  categories: { id: string; name: string }[];
  cities: { id: string; name: string }[];
  existingCoverUrl?: string;
  errors?: {
    name?: string;
    categoryId?: string;
    cityId?: string;
    deadline?: string;
    coverFile?: string;
  };
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
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
  coverFile,
  categories,
  cities,
  existingCoverUrl,
  errors,
  onNameChange,
  onCategoryChange,
  onCityChange,
  onDeadlineChange,
  onCoverChange,
}: LaunchpadProjectDetailInputCardProps) {
  const projectNameErrorId = useId();
  const categoryErrorId = useId();
  const cityErrorId = useId();
  const deadlineErrorId = useId();
  const projectCoverInputId = useId();
  const coverErrorId = useId();
  const [projectCoverPreview, setProjectCoverPreview] = useState<
    string | undefined
  >(undefined);
  const [isCoverRemoved, setIsCoverRemoved] = useState(false);
  const [previewHovered, setPreviewHovered] = useState(false);

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setProjectCoverPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (existingCoverUrl && !isCoverRemoved) {
      setProjectCoverPreview(existingCoverUrl);
      return;
    }

    setProjectCoverPreview(undefined);
  }, [coverFile, existingCoverUrl, isCoverRemoved]);

  const selectCoverFile = (file: File | null) => {
    const error = getImageFileError(
      file,
      COVER_MAX_FILE_SIZE,
      "Project cover",
      {
        required: true,
      },
    );
    if (error) {
      toast.error(error);
      onCoverChange(null);
    } else {
      setIsCoverRemoved(false);
      onCoverChange(file);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectCoverFile(event.currentTarget.files?.[0] ?? null);
    event.currentTarget.value = "";
  };

  const handleCoverRemove: React.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewHovered(false);
    setIsCoverRemoved(true);
    onCoverChange(null);
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
          className="mt-1.5 h-12.5 rounded-xl border-none bg-[#F8FAFC] px-4 focus-visible:border-transparent focus-visible:ring-1 focus-visible:ring-blue-500/45 aria-invalid:ring-1 aria-invalid:ring-red-400/60"
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
            triggerClassName="mt-1.5 h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC] focus:ring-blue-500/45 data-[state=open]:ring-blue-500/45 aria-invalid:ring-1 aria-invalid:ring-red-400/60"
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
            triggerClassName="mt-1.5 h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC] focus:ring-blue-500/45 data-[state=open]:ring-blue-500/45 aria-invalid:ring-1 aria-invalid:ring-red-400/60"
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
        <FieldLabel>Project cover image</FieldLabel>
        <div className="mt-2">
          <label htmlFor={projectCoverInputId}>
            <div
              className={`relative h-37 w-74.25 cursor-pointer rounded-2xl border border-dashed bg-gray-50 text-center hover:bg-gray-100 ${errors?.coverFile ? "border-red-400 ring-1 ring-red-400/60" : "border-gray-200"}`}
            >
              {projectCoverPreview ? (
                <motion.div
                  className="h-full w-full"
                  onHoverStart={() => setPreviewHovered(true)}
                  onHoverEnd={() => setPreviewHovered(false)}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={projectCoverPreview}
                    alt="Project cover preview"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                  <motion.span
                    className="absolute top-2 right-2 z-10"
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
                      icon={<Trash2 className="size-4" />}
                      ariaLabel="Remove cover image"
                      onClick={handleCoverRemove}
                    />
                  </motion.span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6.5">
                  <img
                    className="mb-3.5 size-8"
                    src={PROJECT_IMAGE_PLACEHOLDER}
                  />
                  <div className="text-xs font-semibold text-blue-500">
                    Click to upload
                  </div>
                  <div className="mt-1.5 w-53.75 text-[11px] text-gray-400">
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
        {/* <div className="space-y-0.5 text-[12px] text-gray-400">
          <p>JPG, JPEG, PNG, or WebP • 10MB max</p>
          <p>Recommended size: 1280 × 720 px (16:9)</p>
        </div> */}
        {errors?.coverFile ? (
          <p id={coverErrorId} className="text-xs text-red-500">
            {errors.coverFile}
          </p>
        ) : null}
      </div>
    </SectionInputCard>
  );
}
