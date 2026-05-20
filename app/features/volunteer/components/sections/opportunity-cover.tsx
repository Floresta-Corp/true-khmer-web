import { cn, resolveImageURL } from "~/lib/utils";
import type { OpportunityDetail } from "~/services/volunteer/types/opportunities";

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
    <div className="overflow-hidden rounded-t-3xl border border-[#e1e7ef]">
      <div className="relative h-100 px-5.25 pb-5.25 pt-50.5">
        <img
          src={image}
          alt="Temple restoration volunteers"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute bottom-0 left-0 p-10 flex min-w-0 flex-col gap-3">
          <div className="flex items-center gap-2">
            {label.map((v) => (
              <span
                className={cn(
                  "rounded-xl uppercase px-2 py-1 text-[10px] font-semibold tracking-[0.12px]",
                  {
                    " text-white bg-[#2f6fe4]": v.type === "category",
                  },
                  {
                    " bg-white text-[#2f6fe4]": v.type === "status",
                  },
                )}
              >
                {v.name}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {volunteer?.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
