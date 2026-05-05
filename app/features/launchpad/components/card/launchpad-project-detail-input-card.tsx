import { useId, useMemo } from "react";
import { Input } from "~/components/ui/input";
import { Calendar } from "lucide-react";

import { cn } from "~/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import FieldLabel from "~/components/field-label";
import SectionInputCard from "~/components/section-input-card";
import { SelectOption } from "~/components/ui/select-option";

const PROJECT_LOGO_PLACEHOLDER = "/placeholder/images.svg";

interface LaunchpadProjectDetailInputCardProps {
  name: string;
  categoryId: string;
  cityId: string;
  deadline: string;
  logoFile: File | null;
  coverFile: File | null;
  categories: { id: string; name: string }[];
  cities: { id: string; name: string }[];
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
  errors,
  onNameChange,
  onCategoryChange,
  onCityChange,
  onDeadlineChange,
  onLogoChange,
  onCoverChange,
}: LaunchpadProjectDetailInputCardProps) {
  const projectLogoInputId = useId();
  const projectCoverInputId = useId();
  const projectLogoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : PROJECT_LOGO_PLACEHOLDER),
    [logoFile],
  );
  const projectCoverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : undefined),
    [coverFile],
  );

  const handleProjectLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0];
    onLogoChange(file ?? null);
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    onCoverChange(file ?? null);
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
          placeholder="e.g., Digital Literacy for Artisans"
          className="h-12.5 rounded-xl px-4 border-none bg-[#F8FAFC]"
        />
        {errors?.name ? (
          <p className="text-xs text-red-500">{errors.name}</p>
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
            placeholder="e.g., Education"
            triggerClassName="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
          {errors?.categoryId ? (
            <p className="text-xs text-red-500">{errors.categoryId}</p>
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
            placeholder="e.g., Phnom Penh"
            triggerClassName="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
          {errors?.cityId ? (
            <p className="text-xs text-red-500">{errors.cityId}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <FieldLabel>Application deadline</FieldLabel>
        <InputGroup className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]">
          <InputGroupInput
            type="datetime-local"
            value={toDateTimeLocal(deadline)}
            aria-invalid={Boolean(errors?.deadline)}
            onChange={(event) => {
              const value = event.target.value;
              onDeadlineChange(value ? new Date(value).toISOString() : "");
            }}
          />
          <InputGroupAddon>
            <Calendar />
          </InputGroupAddon>
        </InputGroup>
        {errors?.deadline ? (
          <p className="text-xs text-red-500">{errors.deadline}</p>
        ) : null}
      </div>
      <div className="space-y-3">
        <FieldLabel>Project Logo</FieldLabel>
        <div className="h-25 w-25 mt-2">
          <label
            htmlFor={projectLogoInputId}
            className="flex h-full w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#e1e7ef] bg-[#f8fafc] p-4 transition-colors hover:bg-[#f1f5f9]"
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
            accept="image/*"
            className="sr-only"
            onChange={handleProjectLogoChange}
          />
        </div>
        {errors?.logoFile ? (
          <p className="text-xs text-red-500">{errors.logoFile}</p>
        ) : null}
      </div>
      <div className="space-y-3">
        <FieldLabel>Project Cover Image</FieldLabel>
        <div className="mt-2">
          <label htmlFor={projectCoverInputId}>
            <div className="h-37 w-74.25 border border-gray-200 border-dashed bg-gray-50 rounded-2xl text-center cursor-pointer hover:bg-gray-100">
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
                    JPG or PNG • 3MB max Recommended size: 1280 × 720 px (16:9)
                  </div>
                </div>
              )}
            </div>
          </label>
          <input
            id={projectCoverInputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleCoverChange}
          />
        </div>
        {errors?.coverFile ? (
          <p className="text-xs text-red-500">{errors.coverFile}</p>
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
