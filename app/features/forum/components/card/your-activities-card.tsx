import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function YourActivitiesCard() {
  return (
    <Card className="shadow-none p-5">
      <CardContent className="space-y-3">
        <div>
          <p>Your Activities</p>
          <Button variant="link">Manage</Button>
        </div>
        <div>
          <div>
            <p>Questions</p>
            <p>{5}</p>
          </div>
          <div>
            <p>Answers</p>
            <p>{12}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
