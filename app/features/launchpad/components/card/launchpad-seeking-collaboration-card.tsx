import { Card } from "~/components/ui/card";
import LaunchpadCollaborationCard from "./launchpad-collaboration-card";

const data = [
  {
    id: "sc-1",
    title: "Co-founders",
    details: "Join our core team to scale operations globally.",
    availableSpot: 1,
  },
  {
    id: "sc-2",
    title: "Game Designers",
    details: "Join our core team to scale operations globally.",
    availableSpot: 3,
  },
  {
    id: "sc-3",
    title: "Early Investors",
    details: "Join our core team to scale operations globally.",
    availableSpot: 2,
  },
];

export default function LaunchpadSeekingCollaborationCard() {
  return (
    <Card className="p-7 bg-white">
      <div className="font-semibold text-lg mb-5">Seeking Collaboration</div>
      <div className="grid grid-cols-1 gap-3.5">
        {data.map((v) => (
          <LaunchpadCollaborationCard key={v.id} data={v} />
        ))}
      </div>
    </Card>
  );
}
