import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { Opportunity } from "~/services/volunteer/volunteer-types";
import OpportunityCardSkeleton from "../../components/sections/opportunity-card-skeleton";
import { OpportunityCard } from "~/components/opportunity-card";

interface VolunteerAvailableOpportunitiesProps {
  opportunities?: Opportunity[];
  showHeader?: boolean;
  className?: string;
  isLoading?: boolean;
  onMutationComplete?: () => void;
}

export function VolunteerAvailableOpportunities({
  opportunities = [],
  showHeader = true,
  className = "",
  isLoading = false,
  onMutationComplete,
}: VolunteerAvailableOpportunitiesProps) {
  return (
    <section
      className={className || "w-full bg-gray-50 px-6 py-14 md:px-12 lg:px-28"}
    >
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
        {showHeader && (
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[32px] font-bold leading-12 text-[#020618]">
              Available Opportunities
            </h2>
            <Link to="/volunteer/all">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 text-sm"
              >
                View all
              </Button>
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <OpportunityCardSkeleton key={`opportunity-skeleton-${index}`} />
            ))}
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onMutationComplete={onMutationComplete}
              />
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
