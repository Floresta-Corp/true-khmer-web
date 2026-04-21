import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function YourActivitiesCard() {
  return (
    <Card className="rounded-2xl border border-[#f1f5f9] bg-white p-5 shadow-none">
      <CardContent className="space-y-[10.5px] p-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-5.25 text-[#030213]">
            Your Activities
          </p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs font-semibold leading-4.5 text-[#2f6fe4]"
          >
            Manage
          </Button>
        </div>
        <div className="space-y-[10.5px]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-normal leading-5.25 tracking-[-0.1504px] text-[#65758b]">
              Questions
            </p>
            <p className="text-sm font-semibold leading-5.25 tracking-[-0.1504px] text-[#030213]">
              {5}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-normal leading-5.25 tracking-[-0.1504px] text-[#65758b]">
              Answers
            </p>
            <p className="text-sm font-semibold leading-5.25 tracking-[-0.1504px] text-[#030213]">
              {12}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
