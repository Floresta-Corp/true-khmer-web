import { MapPin, Clock3, Calendar, Users } from "lucide-react";
import type { Opportunity } from "~/features/volunteer/types/opportunities";
import { format } from "date-fns";

interface OpportunityDetailsGridProps {
  volunteer: Opportunity;
  hideIcon?: boolean;
}

export default function OpportunityDetailsGrid({
  volunteer,
  hideIcon = false,
}: OpportunityDetailsGridProps) {
  function formatDateRange(start?: string | null, end?: string | null) {
    if (!start && !end) return volunteer?.commitmentLabel ?? "Full week";
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);
      if (isNaN(s.getTime()) || isNaN(e.getTime()))
        return volunteer?.commitmentLabel ?? "Full week";
      // If same year, show `M dd - M dd, yyyy` (e.g., 11 15 - 11 20, 2026)
      if (s.getFullYear() === e.getFullYear()) {
        return `${format(s, "MMMM dd")} - ${format(e, "MMMM dd, yyyy")}`;
      }
      // Different years: show full years on both
      return `${format(s, "MMMM dd, yyyy")} - ${format(e, "MMMM dd, yyyy")}`;
    }
    // Only start or only end present
    const single = start ? new Date(start) : new Date(end as string);
    if (isNaN(single.getTime()))
      return volunteer?.commitmentLabel ?? "Full week";
    return format(single, "MMMM dd, yyyy");
  }

  const fields: {
    key: string;
    label: string;
    icon: React.ComponentType<any>;
    value: React.ReactNode;
    hide: boolean;
  }[] = [
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      value: volunteer?.location.name ?? "Siem Reap",
      hide: false,
    },
    {
      key: "duration",
      label: "Duration",
      icon: Clock3,
      value: formatDateRange(volunteer?.startDate, volunteer?.endDate),
      hide: !(volunteer?.startDate || volunteer?.endDate),
    },
  ];

  return (
    <div className="grid gap-6 border-b border-[#f9fafb] sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((field) => {
        if (field.hide) return null;
        const Icon = field.icon;
        return (
          <div className="space-y-1" key={field.key}>
            <p className="mb-1 flex items-center gap-1.5 text-xs text-[10px] leading-tight font-bold tracking-widest text-gray-400 uppercase">
              {!hideIcon && <Icon className="size-[10.5px]" />}
              {field.label}
            </p>
            <p className="font-bold whitespace-nowrap text-gray-900 dark:text-white">
              {field.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
