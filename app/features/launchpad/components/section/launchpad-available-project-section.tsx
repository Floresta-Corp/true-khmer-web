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
    <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-[121.5px]">
      <div className="mx-auto w-full max-w-304">
        <header className="flex items-center justify-between py-10">
          <div className="text-3xl font-bold">All Projects</div>
          <Button
            className="h-9 px-4 text-sm text-blue-500 hover:bg-transparent hover:text-blue-700 hover:underline"
            variant={"ghost"}
            onClick={() => navigate("/launchpad/all")}
          >
            View All
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-5 gap-x-5 gap-y-6 pb-10 md:grid-cols-2 xl:grid-cols-3">
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
