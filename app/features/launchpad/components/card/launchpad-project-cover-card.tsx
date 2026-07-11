import { resolveImageURL } from "~/lib/utils";
import type { LaunchpadDetail } from "~/features/launchpad/types";

interface LaunchpadProjectCoverCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadProjectCoverCard({
  project,
}: LaunchpadProjectCoverCardProps) {
  const categoryName = project.category.name;
  const coverImageUrl = project.coverKey
    ? resolveImageURL(project.coverKey)
    : undefined;

  return (
    <section
      className="relative h-72 w-full overflow-hidden rounded-3xl border border-[#E7ECF3] p-6 md:h-80 md:p-8"
      style={{
        backgroundImage: coverImageUrl
          ? `linear-gradient(180deg, rgba(7, 20, 53, 0.24) 0%, rgba(7, 20, 53, 0.75) 100%), url('${coverImageUrl}')`
          : "linear-gradient(180deg, rgba(7, 20, 53, 0.24) 0%, rgba(7, 20, 53, 0.75) 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex h-full items-end">
        <div className="space-y-2">
          <div className="inline-flex rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#2F6FE4]">
            {categoryName}
          </div>
          <div className="text-3xl leading-tight font-bold text-white md:text-5xl">
            {project.name}
          </div>
        </div>
      </div>
    </section>
  );
}
