import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export function ShareProfileCard() {
  return (
    <Card className="bg-linear-to-br from-blue-500 to-indigo-500 p-4 text-white">
      <h3 className="text-lg font-semibold">Grow together</h3>
      <p className="mt-2 text-sm">
        Inspire others by sharing this verified profile of community achievement
        and social leadership.
      </p>
      <div className="mt-4">
        <Button className="w-full bg-white text-blue-600">Share profile</Button>
      </div>
    </Card>
  );
}
