import { Link, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import type { forumListloader } from "../../services/forum.loader";

export default function YourActivitiesCard() {
  const { questionCount, answerCount } =
    useLoaderData<typeof forumListloader>();

  return (
    <Card className="rounded-2xl border border-[#e9eef5] bg-white p-5 shadow-none">
      <CardContent className="space-y-[10.5px] p-0">
        <div className="flex items-center justify-between">
          <p className="text-base leading-6 font-bold text-[#0f1729]">
            My Discussion
          </p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs leading-4.5 font-semibold text-[#2f6fe4]"
          >
            <Link to="/workspace">Manage</Link>
          </Button>
        </div>
        <div className="space-y-[10.5px]">
          <div className="flex items-center justify-between">
            <p className="text-sm leading-5.25 font-normal tracking-[-0.1504px] text-[#65758b]">
              Questions
            </p>
            <p className="text-sm leading-5.25 font-semibold tracking-[-0.1504px] text-[#030213]">
              {questionCount}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm leading-5.25 font-normal tracking-[-0.1504px] text-[#65758b]">
              Answers
            </p>
            <p className="text-sm leading-5.25 font-semibold tracking-[-0.1504px] text-[#030213]">
              {answerCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
