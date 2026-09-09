import { Bookmark, Calendar, MapPin } from "lucide-react";
import { Link, useFetcher, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { cn, resolveImageURL } from "~/lib/utils";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import { format } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

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
  const didNotifyRef = useRef(false);
  const loading = fetcher.state === "loading" || fetcher.state === "submitting";

  const isSaved = opportunity.viewerSave;
  const hasCapacityLimit = opportunity.capacity > 0;
  const spotsLeft = Math.max(
    opportunity.capacity - opportunity.applicationCount,
    0,
  );

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
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#eceef2] bg-white transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(26,26,46,0.10)]"
      onClick={() => navigate(`/volunteer/detail/${opportunity.id}`)}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="relative h-42 w-full shrink-0 overflow-hidden">
        <img
          src={image}
          alt={opportunity.title}
          className="absolute inset-0 size-full object-cover transition-transform"
          loading="lazy"
        />

        <span className="absolute top-3 left-3 inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[-0.1px] text-[#111827] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.08)]">
          {opportunity.category.name}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSaved ? "Remove from saved" : "Save opportunity"}
          aria-pressed={isSaved}
          className={cn(
            "absolute top-3 right-3 z-20 size-8 cursor-pointer rounded-full bg-white text-[#111827] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.08)] transition-colors hover:bg-white",
            isSaved && "bg-[#2f6fe4] text-white hover:bg-[#2f6fe4]",
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleOnSaveClicked();
          }}
        >
          {loading ? (
            <Spinner className="size-3.5" />
          ) : (
            <Bookmark
              className={cn("size-4", isSaved && "fill-current")}
              strokeWidth={2}
            />
          )}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-5 pt-4 pb-3">
        <h3 className="text-[17px] leading-5.5 font-bold tracking-[-0.3px] text-[#111827] transition-colors duration-300 group-hover:text-[#2f6fe4]">
          <Link
            to={`/volunteer/detail/${opportunity.id}`}
            className="outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
            onClick={(e) => e.stopPropagation()}
          >
            {opportunity.title}
          </Link>
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-medium text-[#4a5565]">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Calendar size={14} className="shrink-0 text-[#2f6fe4]" />
            <span>
              {opportunity.startDate && opportunity.endDate
                ? `${format(opportunity.startDate, "MMMM d")} - ${format(opportunity.endDate, "MMMM d, yyyy")}`
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <MapPin size={14} className="shrink-0 text-[#2f6fe4]" />
            <span>{opportunity.location.name}</span>
          </div>
        </div>

        <p className="line-clamp-2 flex-1 text-[12.5px] leading-5 text-[#9aa2af]">
          {opportunity.overview}
        </p>

        <div className="mt-1 flex items-center justify-between gap-3 border-t border-[#f1f2f4] pt-3">
          <span className="text-[12.5px] font-bold text-[#111827]">
            {hasCapacityLimit
              ? `${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`
              : "Unlimited spots"}
          </span>
          <span className="text-[12.5px] font-medium whitespace-nowrap text-[#9aa2af]">
            {format(opportunity.applicationDeadline, "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
