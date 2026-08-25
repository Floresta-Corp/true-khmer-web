import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export interface ProjectOverviewCardProps {
  overview: string;
  sourceType: "volunteer" | "projects";
  responsibilities: string[];
  requirements: string[];
}

export function ProjectOverviewCard({
  overview,
  sourceType,
  responsibilities,
  requirements,
}: ProjectOverviewCardProps) {
  return (
    <Card className="rounded-[28px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
          About this Role
        </h2>
        <p className="mt-4 text-[14px] leading-7 font-medium text-slate-600 dark:text-slate-400">
          {overview}
        </p>

        {sourceType === "volunteer" && (
          <>
            <Separator className="my-7 bg-[#EEF2F7]" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100/50 bg-slate-50 p-5 dark:border-slate-800/50 dark:bg-slate-800/30">
                <h3 className="mb-4 text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                  Core Responsibilities
                </h3>
                {responsibilities.length > 0 ? (
                  <ul className="space-y-3">
                    {responsibilities.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-3 text-xs leading-6 font-medium text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs font-medium text-slate-400">
                    No responsibilities have been provided yet.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100/50 bg-slate-50 p-5 dark:border-slate-800/50 dark:bg-slate-800/30">
                <h3 className="mb-4 text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                  Prerequisites / Criteria
                </h3>
                {requirements.length > 0 ? (
                  <ul className="space-y-3">
                    {requirements.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-3 text-xs leading-6 font-medium text-slate-600 dark:text-slate-400"
                      >
                        <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs font-medium text-slate-400">
                    No requirements have been provided yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
