import { cn, resolveImageURL } from "~/lib/utils";
import type { OpportunityDetail } from "~/features/volunteer/types/opportunities";

const coverImage = "/images/volunteer-placeholder.svg";

interface OpportunityCoverProps {
  volunteer: OpportunityDetail;
}

export default function OpportunityCover({ volunteer }: OpportunityCoverProps) {
  const image = resolveImageURL(volunteer.coverImageKey, coverImage);
  const label = [
    {
      name: volunteer.category.name,
      type: "category",
    },
    {
      name: volunteer.status,
      type: "status",
    },
  ];
  return (
    <div className="overflow-hidden rounded-t-3xl">
      <div className="relative h-100 overflow-hidden px-5.25 pt-50.5 pb-5.25">
        <div className="absolute inset-0 size-full after:pointer-events-none after:absolute after:inset-0 after:bg-linear-to-t after:from-black/30 after:from-0% after:via-black/30 after:via-0% after:to-transparent after:to-50% after:content-['']">
          <img
            src={image}
            alt={volunteer.title}
            className="size-full object-cover"
          />
        </div>
        <div className="absolute bottom-8 left-8 flex min-w-0 flex-col gap-3">
          <div className="flex items-center gap-2">
            {label.map((v) => (
              <span
                key={v.name}
                className={cn(
                  "rounded-xl px-2 py-1 text-[10px] font-semibold tracking-[0.12px] uppercase",
                  {
                    "bg-[#2f6fe4] text-white": v.type === "category",
                  },
                  {
                    "bg-white text-[#2f6fe4]": v.type === "status",
                  },
                )}
              >
                {v.name}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {volunteer?.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
