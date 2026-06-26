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
        <header className="py-10 flex items-center justify-between">
          <div className="text-3xl font-bold">All Projects</div>
          <Button
            className="cursor-pointer"
            variant={"outline"}
            onClick={() => navigate("/launchpad/all")}
          >
            View All
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-6 pb-10">
          {displayedProjects.map((item) => (
            <LaunchpadProjectCard
              key={item.id}
              item={item}
              onOpenOpportunity={onOpenOpportunity}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
