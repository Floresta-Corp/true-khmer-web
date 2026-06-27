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
  const logoImageUrl = project.logoKey
    ? resolveImageURL(project.logoKey)
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
      <div className="flex h-full items-end gap-4">
        <div className="size-18 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-white/90 shadow-sm md:size-22">
          {logoImageUrl ? (
            <img
              src={logoImageUrl}
              alt={`${project.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-xs">No logo</span>
            </div>
          )}
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
