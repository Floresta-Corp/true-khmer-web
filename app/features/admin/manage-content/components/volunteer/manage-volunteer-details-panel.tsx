import {
  CalendarDays,
  Clock,
  Eye,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import DetailPanel from "~/features/admin/components/detail-panel";
import DetailRow from "~/features/admin/components/detail-row";
import { formatDate } from "~/lib/time";
import { formatCompactNumber } from "~/lib/utils";
import type { AdminVolunteerPostDetailResponse } from "~/types/api-client";

export default function ManageVolunteerDetailsPanel({
  opportunity,
}: {
  opportunity: AdminVolunteerPostDetailResponse;
}) {
  const totalSpots = opportunity.roles.reduce(
    (total, role) => total + role.capacity,
    0,
  );

  const dateRange =
    opportunity.startDate && opportunity.endDate
      ? `${formatDate(opportunity.startDate)} – ${formatDate(opportunity.endDate)}`
      : opportunity.startDate
        ? `From ${formatDate(opportunity.startDate)}`
        : "—";

  return (
    <DetailPanel title="Details">
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <DetailRow
          icon={<MapPin size={13} />}
          label="Location"
          value={opportunity.location.name}
        />
        <DetailRow
          icon={<CalendarDays size={13} />}
          label="Dates"
          value={dateRange}
        />
        <DetailRow
          icon={<Clock size={13} />}
          label="Deadline"
          value={formatDate(opportunity.applicationDeadline)}
        />
        {opportunity.commitmentLabel && (
          <DetailRow
            icon={<Sparkles size={13} />}
            label="Commitment"
            value={opportunity.commitmentLabel}
          />
        )}
        <DetailRow
          icon={<Users size={13} />}
          label="Role spots"
          value={totalSpots}
        />
        <DetailRow
          icon={<Eye size={13} />}
          label="Views"
          value={formatCompactNumber(opportunity.totalView)}
        />
      </div>

      {opportunity.commitmentDescription && (
        <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {opportunity.commitmentDescription}
        </p>
      )}
    </DetailPanel>
  );
}
