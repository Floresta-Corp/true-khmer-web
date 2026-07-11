import { Button } from "~/components/ui/button";
import LaunchpadAboutProjectCard from "../card/launchpad-about-project-card";
import LaunchpadProjectDetailInputCard from "../card/launchpad-project-detail-input-card";
import { useEffect } from "react";

interface LaunchpadPostPage1Props {
  name: string;
  categoryId: string;
  cityId: string;
  deadline: string;
  coverFile: File | null;
  description: string;
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
  onDescriptionChange: (value: string) => void;
  onSaveClicked?: () => void;
  onCancelClicked?: () => void;
}

export default function LaunchpadPostPage1({
  name,
  categoryId,
  cityId,
  deadline,
  coverFile,
  description,
  categories,
  cities,
  existingCoverUrl,
  errors,
  onNameChange,
  onCategoryChange,
  onCityChange,
  onDeadlineChange,
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
        coverFile={coverFile}
        categories={categories}
        cities={cities}
        existingCoverUrl={existingCoverUrl}
        errors={errors}
        onNameChange={onNameChange}
        onCategoryChange={onCategoryChange}
        onCityChange={onCityChange}
        onDeadlineChange={onDeadlineChange}
        onCoverChange={onCoverChange}
      />
      <LaunchpadAboutProjectCard
        value={description}
        onChange={onDescriptionChange}
      />
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="h-10 cursor-pointer px-6"
          onClick={onCancelClicked}
        >
          Cancel
        </Button>
        <Button
          onClick={onSaveClicked}
          className="h-10 cursor-pointer bg-blue-500 px-6 text-white hover:bg-blue-600"
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
