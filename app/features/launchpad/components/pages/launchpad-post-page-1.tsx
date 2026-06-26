import { Button } from "~/components/ui/button";
import LaunchpadAboutProjectCard from "../card/launchpad-about-project-card";
import LaunchpadProjectDetailInputCard from "../card/launchpad-project-detail-input-card";
import { useEffect } from "react";

interface LaunchpadPostPage1Props {
  name: string;
  categoryId: string;
  cityId: string;
  deadline: string;
  logoFile: File | null;
  coverFile: File | null;
  description: string;
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
  onDescriptionChange: (value: string) => void;
  onSaveClicked?: () => void;
  onCancelClicked?: () => void;
}

export default function LaunchpadPostPage1({
  name,
  categoryId,
  cityId,
  deadline,
  logoFile,
  coverFile,
  description,
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
  onDescriptionChange,
  onSaveClicked,
  onCancelClicked,
}: LaunchpadPostPage1Props) {
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
  return (
    <div className="flex flex-col gap-8 pb-10">
      <LaunchpadProjectDetailInputCard
        name={name}
        categoryId={categoryId}
        cityId={cityId}
        deadline={deadline}
        logoFile={logoFile}
        coverFile={coverFile}
        categories={categories}
        cities={cities}
        existingLogoUrl={existingLogoUrl}
        existingCoverUrl={existingCoverUrl}
        errors={errors}
        onNameChange={onNameChange}
        onCategoryChange={onCategoryChange}
        onCityChange={onCityChange}
        onDeadlineChange={onDeadlineChange}
        onLogoChange={onLogoChange}
        onCoverChange={onCoverChange}
      />
      <LaunchpadAboutProjectCard
        value={description}
        onChange={onDescriptionChange}
      />
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="cursor-pointer h-10 px-6"
          onClick={onCancelClicked}
        >
          Cancel
        </Button>
        <Button
          onClick={onSaveClicked}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white h-10 px-6"
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
