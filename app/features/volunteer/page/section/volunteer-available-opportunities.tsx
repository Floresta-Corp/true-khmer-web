import { Calendar, Clock, Heart, MapPin, Timer } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";
import type { Opportunity } from "~/services/volunteer/volunteer-types";
import { format } from "date-fns";
import { motion } from "framer-motion";

const volunteerPlaceholderImage = "/images/volunteer-placeholder.svg";

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const image = resolveImageURL(
    opportunity.coverImageKey,
    volunteerPlaceholderImage,
  );

  const progress =
    opportunity.capacity > 0
      ? Math.min(
          (opportunity.applicationCount / opportunity.capacity) * 100,
          100,
        ) + 50
      : 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#f3f4f6] bg-white p-px shadow-[0px_10px_30px_-15px_rgba(0,0,0,0.05)]">
      <div className="relative h-39.25 w-full overflow-hidden p-3.5">
        <img
          src={image}
          alt={opportunity.title}
          className="absolute inset-0 size-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="relative inline-flex rounded-xl border border-white/20 bg-white/95 px-2.25 py-1 text-[10px] font-semibold tracking-[-0.13px] text-[#2f6fe4]">
          {opportunity.category.name}
        </span>
        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Save opportunity"
          className="relative float-right flex size-[31.5px] items-center justify-center rounded-2xl bg-white/95 text-[#9aa2af] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]"
        >
          <Heart className="size-3.5" />
        </Button> */}
      </div>

      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <h3 className="text-[17px] font-semibold leading-[21.25px] tracking-[-0.43px] text-[#030213]">
            {opportunity.title}
          </h3>
          <p className="text-sm font-medium leading-[22.75px] tracking-[-0.15px] text-[#99a1af] line-clamp-3">
            {opportunity.overview}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <div className="grid grid-cols-3 gap-1.75 font-semibold">
            <div className="flex items-center gap-[5.25px] text-[11px] text-[#4a5565]">
              <Calendar size={13.5} className="text-blue-500" />
              <span>{format(opportunity.createdAt, "MMM, yyyy")}</span>
            </div>
            <div className="flex items-center gap-[5.25px] text-[11px] text-[#4a5565]">
              <Clock size={13.5} className="text-blue-500" />
              <span>{opportunity.durationLabel}</span>
            </div>
            <div className="flex items-center gap-[5.25px] text-[11px]">
              <MapPin size={13.5} className="text-blue-500" />
              <span>{opportunity.location.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.75">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium leading-4.5 text-[#4a5565]">
                Spots filled
              </span>
              <span className="text-xs font-black leading-4.5 text-[#2f6fe4]">
                {opportunity.applicationCount}/{opportunity.capacity}
              </span>
            </div>
            <div className="h-[5.25px] w-full overflow-hidden rounded-full bg-[#f9fafb]">
              <motion.div
                className="h-full rounded-full bg-[#2f6fe4]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <p className="text-gray-400">Application close:</p>
            <p className="text-gray-500">
              {format(opportunity.applicationDeadline, "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        <Link to={`/volunteer/detail/${opportunity.id}`}>
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

interface VolunteerAvailableOpportunitiesProps {
  opportunities?: Opportunity[];
}

export function VolunteerAvailableOpportunities({
  opportunities = [],
}: VolunteerAvailableOpportunitiesProps) {
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

        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="rounded-[14px] border border-dashed border-[#e5e7eb] bg-white px-6 py-12 text-center text-sm font-medium text-[#6b7280]">
            No opportunities are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
