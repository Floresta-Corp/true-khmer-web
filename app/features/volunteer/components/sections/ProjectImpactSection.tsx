import { Target } from "lucide-react";
import type { VolunteerPost } from "~/lib/post";

interface ProjectImpactSectionProps {
  volunteer: VolunteerPost;
}

export default function ProjectImpactSection({
  volunteer,
}: ProjectImpactSectionProps) {
  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        <Target className="size-[17.5px] text-[#2f6fe4]" />
        Project Impact
      </h2>
      <p className="mt-5 text-[15px] font-medium leading-[24.375px] tracking-[-0.23px] text-[#4a5565]">
        {volunteer?.projectImpact ??
          "Lorem ipsum dolor sit amet consectetur. Pretium nulla tellus volutpat augue vulputate amet. Id facilisis elit aliquam mattis. Pellentesque tristique eget mauris tempus egestas sapien libero. In tincidunt duis volutpat pellentesque mauris ac lacus nisi a. Gravida nulla risus massa viverra praesent. Elit malesuada condimentum neque in amet eget. Tincidunt diam nulla lectus."}
      </p>
    </article>
  );
}
