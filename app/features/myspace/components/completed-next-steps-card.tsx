import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import type { MyApplicationRequestSourceType } from "~/features/myspace/types";

interface CompletedNextStepsCardProps {
  sourceType: MyApplicationRequestSourceType;
  pointsEarned: number;
}

/** What comes after a completed placement: what it earned, and where to go next. */
export function CompletedNextStepsCard({
  sourceType,
  pointsEarned,
}: CompletedNextStepsCardProps) {
  const isVolunteer = sourceType === "volunteer";
  const browseHref = isVolunteer ? "/volunteer" : "/launchpad";

  return (
    <Card className="rounded-3xl border-blue-100 bg-linear-to-r from-blue-50 via-blue-50/50 to-white shadow-none dark:border-blue-900/40 dark:from-blue-950/20 dark:via-blue-950/10 dark:to-slate-900">
      <CardContent className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-wider text-blue-700 uppercase dark:text-blue-300">
              {isVolunteer ? "Mission complete" : "Project complete"}
            </p>
            <p className="mt-1.5 max-w-xl text-sm leading-6 font-medium text-slate-700 dark:text-slate-300">
              Thank you for taking part.{" "}
              {pointsEarned > 0
                ? "Your contribution has been added to your profile."
                : "It now counts toward your record on True Khmer."}
            </p>
            {pointsEarned > 0 ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                <Star className="size-3.5 fill-current" />+{pointsEarned} impact
                points earned
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-slate-200 px-5 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            <Link to="/myspace">See your impact</Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-xl bg-blue-600 px-5 font-bold text-white hover:bg-blue-700"
          >
            <Link to={browseHref}>
              {isVolunteer
                ? "Find your next mission"
                : "Find your next project"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
