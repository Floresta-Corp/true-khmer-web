import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export interface ProjectOverviewCardProps {
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

export function ProjectOverviewCard({
  overview,
  responsibilities,
  requirements,
}: ProjectOverviewCardProps) {
  return (
    <Card className="rounded-[28px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-[20px] font-semibold tracking-tight text-[#182031]">
          Project Overview
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-[#556071]">{overview}</p>

        <Separator className="my-7 bg-[#EEF2F7]" />

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-[15px] font-semibold text-[#182031]">
              Responsibilities
            </h3>
            <ul className="space-y-3">
              {responsibilities.map((item, index) => (
                <li
                  key={(item as any)?.id ?? `${item}-${index}`}
                  className="flex items-start gap-2.5 text-[14px] leading-6 text-[#556071]"
                >
                  <span className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-emerald-400 text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-semibold text-[#182031]">
              Requirements
            </h3>
            <ul className="space-y-3">
              {requirements.map((item, index) => (
                <li
                  key={(item as any)?.id ?? `${item}-${index}`}
                  className="flex items-start gap-2.5 text-[14px] leading-6 text-[#556071]"
                >
                  <span className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-emerald-400 text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
