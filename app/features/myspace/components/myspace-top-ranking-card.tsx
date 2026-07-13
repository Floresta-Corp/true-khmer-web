import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import LogoMark from "~/components/icons/logoMark";

interface RankedUser {
  name: string;
  points: string;
  rank: number;
}

const mockRankings: RankedUser[] = [
  {
    name: "Sarah Jenkins",
    points: "12.5k points",
    rank: 1,
  },
];

export function TopRankingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 10 Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {mockRankings.map((user) => (
            <li key={user.rank} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#F1F6FF]">
                    <LogoMark size={20} aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.points}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{user.rank}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
