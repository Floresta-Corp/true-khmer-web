import type { VolunteerPost } from "~/lib/post";

const coverImage =
  "https://www.figma.com/api/mcp/asset/b7008d38-7e7e-480c-9520-1c39a524a5f5";

interface OpportunityCoverProps {
  volunteer: VolunteerPost;
}

export default function OpportunityCover({ volunteer }: OpportunityCoverProps) {
  return (
    <div className="overflow-hidden rounded-t-3xl border border-[#e1e7ef]">
      <div className="relative h-70 px-5.25 pb-5.25 pt-50.5">
        <img
          src={coverImage}
          alt="Temple restoration volunteers"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />

        <div className="relative flex items-end gap-3">
          <div className="size-14 rounded-2xl border border-[#f3f4f6] bg-white shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]" />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="rounded-[3.5px] bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.12px] text-[#2f6fe4]">
                Heritage
              </span>
              <span className="rounded-[3.5px] bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.12px] text-[#fb3748]">
                {volunteer?.status ?? "Urgent"}
              </span>
            </div>
            <h1 className="truncate text-[26px] font-semibold leading-8 tracking-[0.24px] text-white">
              {volunteer?.title ?? "Temple Restoration Support"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
