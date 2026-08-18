import { Bookmark, Calendar, Clock, Eye, Heart, MapPin } from "lucide-react";
import { Link, useFetcher, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { cn, formatCompactNumber, resolveImageURL } from "~/lib/utils";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const volunteerPlaceholderImage = "/images/volunteer-placeholder.svg";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onMutationComplete?: () => void;
}

export function OpportunityCard({
  opportunity,
  onMutationComplete,
}: OpportunityCardProps) {
  const image = resolveImageURL(
    opportunity.coverImageKey,
    volunteerPlaceholderImage,
  );
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [isHovered, setIsHovered] = useState(false);
  const didNotifyRef = useRef(false);
  const loading = fetcher.state === "loading" || fetcher.state === "submitting";

  const progress =
    opportunity.capacity > 0
      ? Math.min(
          (opportunity.applicationCount / opportunity.capacity) * 100,
          100,
        )
      : 0;

  const handleOnSaveClicked = () => {
    didNotifyRef.current = false;

    if (opportunity.viewerSave) {
      fetcher.submit(
        { opportunityId: opportunity.id, actionType: "unsave-opportunity" },
        { method: "DELETE", action: "/saved-items" },
      );
    } else {
      fetcher.submit(
        {
          opportunityId: opportunity.id,
          actionType: "save-opportunity",
        },
        { method: "POST", action: "/saved-items" },
      );
    }
  };

  useEffect(() => {
    if (fetcher.state !== "idle" || didNotifyRef.current) {
      return;
    }

    if (fetcher.data?.ok) {
      didNotifyRef.current = true;
      onMutationComplete?.();
    } else if (fetcher.data && !fetcher.data.ok) {
      // Handle error case - could show toast, log, etc.
      didNotifyRef.current = true;
    }
  }, [fetcher.state, fetcher.data, onMutationComplete]);

  return (
    <motion.article
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[14px] border border-[#f3f4f6] bg-white p-px shadow-[0px_10px_30px_-15px_rgba(0,0,0,0.05)]"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/volunteer/detail/${opportunity.id}`)}
    >
      <div className="relative h-39.25 w-full overflow-hidden p-3.5">
        <img
          src={image}
          alt={opportunity.title}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <span className="relative inline-flex rounded-xl border border-white/20 bg-white/95 px-2.25 py-1 text-[10px] font-semibold tracking-[-0.13px] text-[#2f6fe4]">
          {opportunity.category.name}
        </span>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="relative float-right"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Save opportunity"
            className={cn(
              "flex size-[31.5px] cursor-pointer items-center justify-center rounded-2xl bg-white/95 text-[#9aa2af] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] transition-colors",
              { "bg-blue-600": opportunity.viewerSave },
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleOnSaveClicked();
            }}
          >
            {loading ? (
              <Spinner />
            ) : (
              <Bookmark
                className={cn("size-3.5", {
                  "fill-white text-white": opportunity.viewerSave,
                })}
              />
            )}
          </Button>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <h3 className="text-[17px] leading-[21.25px] font-semibold tracking-[-0.43px] text-[#030213]">
            {opportunity.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-[22.75px] tracking-[-0.15px] text-[#99a1af]">
            {opportunity.overview}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-semibold sm:grid sm:grid-cols-3 sm:gap-1.75">
            <div className="flex items-center gap-[5.25px] text-[11px] whitespace-nowrap text-[#4a5565]">
              <Calendar size={13.5} className="shrink-0 text-slate-500" />
              <span className="text-zinc-800">
                {opportunity.startDate && opportunity.endDate
                  ? `${format(opportunity.startDate, "MMM dd")} - ${format(opportunity.endDate, "MMM dd")}`
                  : "-"}
              </span>
            </div>
            <div className="flex items-center gap-[5.25px] text-[11px] whitespace-nowrap">
              <MapPin size={13.5} className="shrink-0 text-slate-500" />
              <span className="text-zinc-800">{opportunity.location.name}</span>
            </div>
            <div className="flex items-center gap-[5.25px] text-[11px] whitespace-nowrap">
              <Eye size={13.5} className="shrink-0 text-slate-500" />
              <span className="text-zinc-800">
                {formatCompactNumber(opportunity.totalView)}{" "}
                {opportunity.totalView > 1 ? "views" : "view"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-gray-400 uppercase">
                Spots filled
              </span>
              <span className="text-xs leading-4.5 font-black text-[#2f6fe4]">
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
          <div className="-mt-2 flex items-center text-xs">
            <span className="text-gray-400">Application close:</span>
            <span className="font-medium text-gray-700">
              {format(opportunity.applicationDeadline, "dd/MM/yyyy")}
            </span>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-gray-200 hover:text-blue-500"
        >
          <Link
            to={`/volunteer/detail/${opportunity.id}?tab=open-roles`}
            onClick={(e) => e.stopPropagation()}
          >
            Apply
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
