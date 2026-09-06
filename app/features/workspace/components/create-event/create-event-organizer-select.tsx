import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import type { EventOrganizer } from "~/features/workspace/types/my-events";

function organizerInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

/** Square logo tile with an initial fallback when no image is available. */
function OrganizerLogo({
  organizer,
  className,
}: {
  organizer: EventOrganizer;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8E8E8] font-bold text-[#1D283A]",
        className,
      )}
    >
      {organizer.logo ? (
        <img src={organizer.logo} alt="" className="size-full object-cover" />
      ) : (
        organizerInitial(organizer.name)
      )}
    </span>
  );
}

function OrganizerRow({
  organizer,
  subtitle,
}: {
  organizer: EventOrganizer | null;
  subtitle: string;
}) {
  return (
    <>
      {organizer ? (
        <OrganizerLogo organizer={organizer} className="size-10 text-base" />
      ) : (
        <span className="size-10 shrink-0 rounded-full bg-[#E8E8E8]" />
      )}

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-[#1D283A]">
          {organizer?.name ?? "Select organization"}
        </span>
        <span className="block truncate text-[12.5px] text-slate-500">
          {subtitle}
        </span>
      </span>
    </>
  );
}

const SUBTITLE = "This organization will appear as the event organizer.";

type Props = {
  organizers: EventOrganizer[];
  selectedOrganizerId: string;
  error?: string;
  onSelect: (organizerId: string) => void;
};

/**
 * Picks which organization hosts the event. Creating an organization happens
 * elsewhere, so this only switches between the ones the creator already has.
 */
export default function CreateEventOrganizerSelect({
  organizers,
  selectedOrganizerId,
  error,
  onSelect,
}: Props) {
  const selected =
    organizers.find((organizer) => organizer.id === selectedOrganizerId) ??
    null;

  const label = (
    <span className="block text-xs font-bold tracking-wide text-slate-400 uppercase">
      Hosted by
    </span>
  );

  if (organizers.length === 0) {
    return (
      <section
        className={cn(
          "rounded-[10px] border bg-white p-4",
          error ? "border-red-500" : "border-[#E1E7EF]",
        )}
      >
        {label}
        <div className="mt-2.5 flex items-center gap-3.5">
          <OrganizerRow organizer={null} subtitle={SUBTITLE} />
        </div>
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-[10px] border bg-white",
        error ? "border-red-500" : "border-[#E1E7EF]",
      )}
    >
      <DropdownMenu>
        {/* The trigger spans the whole card so the menu can match its width. */}
        <DropdownMenuTrigger className="w-full cursor-pointer rounded-[10px] p-4 text-left transition-colors hover:bg-slate-50/70 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:outline-none">
          {label}
          <span className="mt-2.5 flex items-center gap-3.5">
            <OrganizerRow organizer={selected} subtitle={SUBTITLE} />
            <ChevronDown className="size-4.5 shrink-0 text-slate-400" />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="w-(--radix-dropdown-menu-trigger-width) rounded-xl border-[#E1E7EF] p-1.5"
        >
          {organizers.map((organizer) => {
            const isActive = organizer.id === selectedOrganizerId;

            return (
              <DropdownMenuItem
                key={organizer.id}
                onSelect={() => onSelect(organizer.id)}
                className={cn(
                  "gap-3.5 rounded-lg px-3 py-2.5",
                  isActive && "bg-slate-50",
                )}
              >
                <OrganizerLogo organizer={organizer} className="size-9" />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#1D283A]">
                    {organizer.name}
                  </span>
                  <span className="block text-xs text-slate-500">
                    Organization
                  </span>
                </span>

                {isActive && (
                  <span className="size-2 shrink-0 rounded-full bg-blue-600" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && <p className="px-4 pb-4 text-xs text-red-500">{error}</p>}
    </section>
  );
}
