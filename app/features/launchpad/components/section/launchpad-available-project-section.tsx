import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import LaunchpadProjectCard from "../card/launchpad-project-card";
import { useLoaderData, useNavigate } from "react-router";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";
import type { loader } from "~/features/launchpad/routes/launchpad";

export function LaunchpadAvailableProjectsSection() {
  const { projects } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const onOpenOpportunity = useCallback((item: LaunchpadOpportunity) => {
    navigate(`/launchpad/detail/${item.id}`);
  }, []);

  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-[121.5px]">
      <div className="mx-auto w-full max-w-304">
        <header className="py-10 flex items-center justify-between">
          <div className="text-3xl font-bold">All Projects</div>
          <Button className="cursor-pointer" variant={"outline"}>
            View All
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-6">
          {projects.map((item) => (
            <LaunchpadProjectCard
              key={item.id}
              item={item}
              onOpenOpportunity={onOpenOpportunity}
            />
          ))}
        </div>
      </div>
      <div className="py-10 text-center">
        <Button variant="outline" className="text-sm px-6 py-5 rounded-md">
          Load more
        </Button>
      </div>
    </section>
  );
}
