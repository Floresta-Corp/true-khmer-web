import { resolveImageURL } from "~/lib/utils";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";

interface LaunchpadProjectCoverCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadProjectCoverCard({
  project,
}: LaunchpadProjectCoverCardProps) {
  const categoryName = project.category.name;

  return (
    <section
      className="relative h-72 w-full overflow-hidden border-b border-[#E7ECF3] p-6 md:h-80 md:p-8"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(7, 20, 53, 0.24) 0%, rgba(7, 20, 53, 0.75) 100%), url('${resolveImageURL(project.coverKey || undefined)}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex h-full items-end gap-4">
        <div className="size-18 overflow-hidden rounded-xl border-4 border-white bg-white/90 shadow-sm md:size-22">
          <img
            src={resolveImageURL(project.logoKey || undefined)}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <div className="inline-flex rounded-md bg-[#2F6FE4] px-2.5 py-1 text-xs font-semibold text-white">
            {categoryName}
          </div>
          <div className="text-3xl font-bold leading-tight text-white md:text-5xl">
            {project.name}
          </div>
        </div>
      </div>
    </section>
  );
}
