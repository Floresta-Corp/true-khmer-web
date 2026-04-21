import { Separator } from "~/components/ui/separator";
import LaunchpadOpenRoleCard from "../components/card/launchpad-openrole-card";
import LaunchpadProjectMaterialCard from "../components/card/launchpad-project-material-card";
import LaunchpadContactDetailCard from "../components/card/launchpad-contact-detail-card";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";

interface LaunchpadPostPage2Props {
  onBackToDetailClicked: () => void;
  onPublishedClicked: () => void;
}

export default function LaunchpadPostPage2({
  onBackToDetailClicked,
  onPublishedClicked,
}: LaunchpadPostPage2Props) {
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
  const count = 0;
  return (
    <div className="space-y-8">
      <LaunchpadOpenRoleCard />
      <div className="gap-2">
        <div className="pb-1">Roles added ({count})</div>
        <div className="w-full p-6 bg-[#F8FAFC] rounded-xl">
          No roles added yet. Add at least one so collaborators know how to
          contribute.
        </div>
      </div>
      <Separator />
      <LaunchpadProjectMaterialCard
        file={[
          {
            name: "Test File",
          },
          {
            name: "Test File 2",
          },
        ]}
      />
      <LaunchpadContactDetailCard />
      <Separator />
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="h-10 px-6 cursor-pointer"
          onClick={onBackToDetailClicked}
        >
          Cancel
        </Button>
        <Button
          onClick={onPublishedClicked}
          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white h-10 px-6"
        >
          Publish Project
        </Button>
      </div>
    </div>
  );
}
