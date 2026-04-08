import { useCallback } from "react";
import { Button } from "~/components/ui/button";

import ProjectCard from "../project-card";

export type LaunchpadOpportunity = {
  id: string;
  name: string;
  description: string;
  tagline: string;
  stage: "Idea" | "MVP" | "Growth";
  location: string;
  teamSize: number;
  seekingRoles: number;
  views: number;
  applicationClose: string;
  category: string;
};

const mockLaunchpadItems: LaunchpadOpportunity[] = [
  {
    id: "lp-1",
    name: "Kroma Logistics",
    tagline: "Sustainable last-mile delivery across Phnom Penh.",
    description:
      "Kroma Logistics is an exciting new mobility solution which immerses users in a naval-inspired virtual world built for competition.",
    stage: "MVP",
    location: "Phnom Penh",
    teamSize: 7,
    category: "Mobility",
    seekingRoles: 3,
    views: 1240,
    applicationClose: "27/03/2026",
  },
  {
    id: "lp-2",
    name: "MedBridge KH",
    tagline: "Connecting patients with verified local clinics.",
    description:
      "MedBridge KH is a Growth-stage HealthTech platform streamlining patient-clinic interactions through verified digital records.",
    stage: "Growth",
    location: "Siem Reap",
    teamSize: 11,
    category: "HealthTech",
    seekingRoles: 2,
    views: 1240,
    applicationClose: "27/03/2026",
  },
  {
    id: "lp-3",
    name: "RiceLoop",
    tagline: "Smart supply matching for independent farmers.",
    description:
      "RiceLoop provides an immersive virtual supply world built for competition among independent agricultural producers.",
    stage: "Idea",
    location: "Battambang",
    teamSize: 4,
    category: "AgriTech",
    seekingRoles: 1,
    views: 1240,
    applicationClose: "27/03/2026",
  },
  {
    id: "lp-4",
    name: "StudyLoom",
    tagline: "Peer-led learning circles for university students.",
    description:
      "StudyLoom is an EdTech initiative focusing on naval-inspired collaborative learning models for higher education.",
    stage: "MVP",
    location: "Phnom Penh",
    teamSize: 6,
    category: "EdTech",
    seekingRoles: 4,
    views: 1240,
    applicationClose: "27/03/2026",
  },
  {
    id: "lp-5",
    name: "Temple Trails",
    tagline: "Cultural experiences curated by local communities.",
    description:
      "Temple Trails immerses travelers in a naval-inspired virtual world built for community-led tourism competition.",
    stage: "Growth",
    location: "Siem Reap",
    teamSize: 9,
    category: "Travel",
    seekingRoles: 5,
    views: 1240,
    applicationClose: "27/03/2026",
  },
  {
    id: "lp-6",
    name: "CraftLink",
    tagline: "Digital storefront toolkit for Khmer artisans.",
    description:
      "CraftLink is an Idea-stage project providing Khmer artisans with the digital tools needed for global market competition.",
    stage: "Idea",
    location: "Kampot",
    teamSize: 5,
    category: "Commerce",
    seekingRoles: 2,
    views: 1240,
    applicationClose: "27/03/2026",
  },
];

export function LaunchpadAvailableProjectsSection() {
  const onOpenOpportunity = useCallback((item: LaunchpadOpportunity) => {
    console.log("Open launchpad item", item.id, item.name);
  }, []);

  return (
    <section className="w-full bg-white px-4 pb-10 sm:px-6 md:px-12 lg:px-[131.5px] lg:pb-14">
      <div className="mx-auto w-full max-w-294.25">
        <header className="py-8 flex items-center justify-between">
          <div className="text-3xl font-bold">All Projects</div>
          <Button className="curosr-pointer" variant={"outline"}>
            View All
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mockLaunchpadItems.map((item) => (
            <ProjectCard item={item} onOpenOpportunity={onOpenOpportunity} />
          ))}
        </div>

        <Button
          variant="secondary"
          className="mt-6 h-9 w-full rounded-lg bg-[#f1f5f9] px-4 text-sm font-medium text-[#2f6fe4] hover:bg-[#e8eef8] md:hidden"
        >
          View all
        </Button>
      </div>
    </section>
  );
}
