import { Heart, MapPin, Timer, Workflow } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const volunteerPlaceholderImage = "/images/volunteer-placeholder.svg";

const opportunities = [
  {
    id: 1,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 2,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 3,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 4,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 5,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 6,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 7,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 8,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
  {
    id: 9,
    image: volunteerPlaceholderImage,
    category: "Environment",
    title: "Digital Literacy for Artisans",
    description:
      "Foundational steps for launching your first venture in the local market.",
    tags: ["Online", "Skill-share", "Trade"],
    location: "Phnom Penh",
    schedule: "Flexible",
    urgency: "24 HOURS LEFT",
    filled: 12,
    total: 20,
  },
];

function OpportunityCard({
  id,
  image,
  category,
  title,
  description,
  tags,
  location,
  schedule,
  urgency,
  filled,
  total,
}: (typeof opportunities)[number]) {
  const progress = `${(filled / total) * 100}%`;

  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border border-[#f3f4f6] bg-white p-px shadow-[0px_10px_30px_-15px_rgba(0,0,0,0.05)]">
      <div className="relative h-39.25 w-full overflow-hidden p-3.5">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 size-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="relative inline-flex rounded-xl border border-white/20 bg-white/95 px-2.25 py-1 text-[10px] font-semibold tracking-[-0.13px] text-[#2f6fe4]">
          {category}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Save opportunity"
          className="relative float-right flex size-[31.5px] items-center justify-center rounded-2xl bg-white/95 text-[#9aa2af] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
        >
          <Heart className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-6 p-5">
        <div className="flex flex-col gap-3">
          <h3 className="text-[17px] font-semibold leading-[21.25px] tracking-[-0.43px] text-[#030213]">
            {title}
          </h3>
          <p className="text-sm font-medium leading-[22.75px] tracking-[-0.15px] text-[#99a1af]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.75">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-xl bg-[#f9fafb] px-[10.5px] py-[3.5px] text-[10px] font-bold leading-3.75 text-[#99a1af]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-1.75">
            <div className="flex items-center gap-[5.25px] text-[11px] font-bold leading-[16.5px] text-[#4a5565]">
              <MapPin className="size-[12.25px]" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-[5.25px] text-[11px] font-bold leading-[16.5px] text-[#4a5565]">
              <Workflow className="size-[12.25px]" />
              <span>{schedule}</span>
            </div>
            <div className="flex items-center gap-[5.25px] text-[11px] font-black uppercase leading-[16.5px] text-[#ff5a5f]">
              <Timer className="size-[12.25px]" />
              <span>{urgency}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.75">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold leading-4.5 text-[#4a5565]">
                Spots filled
              </span>
              <span className="text-xs font-black leading-4.5 text-[#2f6fe4]">
                {filled} / {total}
              </span>
            </div>
            <div className="h-[5.25px] w-full overflow-hidden rounded-full bg-[#f9fafb]">
              <div
                className="h-full rounded-full bg-[#2f6fe4]"
                style={{ width: progress }}
              />
            </div>
          </div>
        </div>

        <Link to={`/volunteer/${id}`}>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full text-sm font-medium"
          >
            Apply
          </Button>
        </Link>
      </div>
    </article>
  );
}

export function AvailableOpportunities() {
  return (
    <section className="w-full bg-gray-50 px-6 py-14 md:px-12 lg:px-28">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[32px] font-bold leading-12 text-[#020618]">
            Available Opportunities
          </h2>
          <Button type="button" variant="outline" className="h-9 px-4 text-sm">
            View all
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} {...opportunity} />
          ))}
        </div>
      </div>
    </section>
  );
}
