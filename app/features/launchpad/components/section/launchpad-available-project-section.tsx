import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import LaunchpadProjectCard from "../card/launchpad-project-card";
import { useLoaderData, useNavigate } from "react-router";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import type { loader } from "~/features/launchpad/route/launchpad";

const PAGE_SIZE = 9;

export function LaunchpadAvailableProjectsSection() {
  const { projects } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const onOpenOpportunity = useCallback(
    (item: LaunchpadOpportunity) => {
      navigate(`/launchpad/detail/${item.id}`);
    },
    [navigate],
  );

  const displayedProjects = projects.slice(0, PAGE_SIZE);

  return (
    <section className="mb-10 w-full bg-white">
      <div className="site-container flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl leading-8 font-bold text-[#020618] md:text-[22px] md:leading-8">
              Open Opportunities
            </h2>
          </div>
          <Button
            className="h-9 px-4 text-sm text-blue-500 hover:bg-transparent hover:text-blue-700 hover:underline"
            variant={"ghost"}
            onClick={() => navigate("/launchpad/all")}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayedProjects.map((item) => (
            <LaunchpadProjectCard
              key={item.id}
              item={item}
              onOpenOpportunity={onOpenOpportunity}
              showApplyButton
            />
          ))}
        </div>
      </div>
    </section>
  );
}
