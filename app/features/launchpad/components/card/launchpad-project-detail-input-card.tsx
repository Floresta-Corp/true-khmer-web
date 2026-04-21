import { useId, useState } from "react";
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

const PROJECT_LOGO_PLACEHOLDER = "/placeholder/images.svg";

export default function LaunchpadProjectDetailInputCard() {
  const projectLogoInputId = useId();
  const projectCoverInputId = useId();
  const [projectLogoPreview, setProjectLogoPreview] = useState<
    string | undefined
  >(PROJECT_LOGO_PLACEHOLDER);
  const [projectCoverPreview, setProjectCoverPreview] = useState<
    string | undefined
  >(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleProjectLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      setProjectLogoPreview(PROJECT_LOGO_PLACEHOLDER);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProjectLogoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      setProjectCoverPreview(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProjectCoverPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
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
          placeholder="e.g., Digital Literacy for Artisans"
          className="h-12.5 rounded-xl px-4 border-none bg-[#F8FAFC]"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel>Industry</FieldLabel>
          <Input
            placeholder="e.g., Education"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
        </div>
        <div className="space-y-3">
          <FieldLabel>Location</FieldLabel>
          <Input
            placeholder="e.g., Phnom Penh"
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
        </div>
      </div>

      <div className="space-y-3">
        <FieldLabel>Application deadline</FieldLabel>
        <InputGroup className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]">
          <InputGroupInput type="date" />
          <InputGroupAddon>
            <Calendar />
          </InputGroupAddon>
        </InputGroup>
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
