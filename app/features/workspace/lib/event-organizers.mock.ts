import type { EventOrganizer } from "~/features/workspace/types/my-events";

/**
 * Organizations the signed-in creator can host events as. Replace with the
 * organizations endpoint once it is available.
 */
export const EVENT_ORGANIZERS: EventOrganizer[] = [
  {
    id: "phnom-penh-tech-hub",
    name: "Phnom Penh Tech Hub",
    logo: null,
  },
  {
    id: "true-khmer-community",
    name: "True Khmer Community",
    logo: null,
  },
  {
    id: "khmer-artisans-collective",
    name: "Khmer Artisans Collective",
    logo: null,
  },
];
