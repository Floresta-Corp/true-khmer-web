import { Button } from "~/components/ui/button";
import LaunchpadAboutProjectCard from "../components/card/launchpad-about-project-card";
import LaunchpadProjectDetailInputCard from "../components/card/launchpad-project-detail-input-card";
import { useEffect } from "react";

interface LaunchpadPostPage1Props {
  onSaveClicked?: () => void;
  onCancelClicked?: () => void;
}

export default function LaunchpadPostPage1({
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
      <LaunchpadProjectDetailInputCard />
      <LaunchpadAboutProjectCard />
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
