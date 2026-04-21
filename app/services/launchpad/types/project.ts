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
    image: string;
    thumbnail: string;
};