import {
  EyeOff,
  Globe,
  Info,
  Lock,
  MailOpen,
  ShieldCheck,
  Ticket,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio";
import { cn } from "~/lib/utils";
import { isOpenEntryDisabled } from "~/features/workspace/lib/my-events-format";
import type {
  EventAccessPatch,
  EventEntryMode,
  EventRegistrationMode,
  EventVisibility,
} from "~/features/workspace/types/my-events";

type AccessOption<T extends string> = {
  id: T;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Tinted red when active to flag that the choice narrows the audience. */
  restrictive?: boolean;
};

const VISIBILITY_OPTIONS: AccessOption<EventVisibility>[] = [
  {
    id: "LISTED",
    title: "Listed",
    description: "Anyone can discover this event",
    icon: Globe,
  },
  {
    id: "UNLISTED",
    title: "Unlisted",
    description: "Only accessible via direct link",
    icon: EyeOff,
    restrictive: true,
  },
];

const REGISTRATION_OPTIONS: AccessOption<EventRegistrationMode>[] = [
  {
    id: "ANYONE",
    title: "Anyone",
    description: "Open to anyone",
    icon: Globe,
  },
  {
    id: "REQUIRED_APPROVAL",
    title: "Required Approval",
    description: "Only approved guests can attend",
    icon: Lock,
    restrictive: true,
  },
  {
    id: "INVITED_GUESTS_ONLY",
    title: "Invited Guests Only",
    description: "Only invited guests can register",
    icon: UserRound,
    restrictive: true,
  },
];

const ENTRY_OPTIONS: AccessOption<EventEntryMode>[] = [
  {
    id: "TICKETED",
    title: "Ticketed",
    description: "Valid ticket required to attend",
    icon: Ticket,
  },
  {
    id: "RSVP",
    title: "RSVP",
    description: "Attendance confirmation required",
    icon: MailOpen,
  },
  {
    id: "OPEN_ACCESS",
    title: "Open Access",
    description: "Event open to everyone",
    icon: Globe,
  },
];

/**
 * Options Plumpi does not accept yet. They stay visible so organizers can see
 * what is coming, but cannot be picked.
 */
const UNAVAILABLE_VISIBILITIES: EventVisibility[] = ["UNLISTED"];
const UNAVAILABLE_REGISTRATION_MODES: EventRegistrationMode[] = [
  "REQUIRED_APPROVAL",
  "INVITED_GUESTS_ONLY",
];
const UNAVAILABLE_ENTRY_MODES: EventEntryMode[] = ["RSVP"];

function AccessOptionGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  isOptionDisabled,
}: {
  legend: string;
  name: string;
  options: AccessOption<T>[];
  value: T;
  onChange: (id: T) => void;
  isOptionDisabled?: (id: T) => boolean;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-[13px] font-bold text-[#344256]">{legend}</legend>

      <RadioGroup
        name={name}
        value={value}
        onValueChange={(next) => onChange(next as T)}
        className={cn(
          "grid gap-3 sm:grid-cols-2",
          options.length > 2 && "lg:grid-cols-3",
        )}
      >
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.id;
          const isDisabled = isOptionDisabled?.(option.id) ?? false;

          return (
            <label
              key={option.id}
              aria-disabled={isDisabled}
              className={cn(
                "flex min-w-0 items-start gap-3 rounded-[10px] border p-4 transition-all",
                isDisabled
                  ? "cursor-not-allowed border-[#E1E7EF] bg-slate-50/60 opacity-60"
                  : isActive
                    ? "cursor-pointer border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                    : "cursor-pointer border-[#E1E7EF] bg-white hover:border-blue-200 hover:bg-slate-50",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 size-4.5 shrink-0",
                  !isActive || isDisabled
                    ? "text-slate-400"
                    : option.restrictive
                      ? "text-red-600"
                      : "text-blue-600",
                )}
              />

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#1D283A]">
                  {option.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                  {option.description}
                </span>
              </span>

              <RadioGroupItem
                value={option.id}
                disabled={isDisabled}
                aria-label={option.title}
                // The label owns the click target, so the dot is decorative.
                className="pointer-events-none mt-0.5 shrink-0 border-slate-300 text-blue-600 data-[state=checked]:border-blue-600"
              />
            </label>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}

type Props = {
  visibility: EventVisibility;
  registrationMode: EventRegistrationMode;
  entryMode: EventEntryMode;
  onChange: (patch: EventAccessPatch) => void;
};

/**
 * Access & visibility step: how the event is discovered, who may register and
 * how attendees get in.
 */
export default function CreateEventAccessForm({
  visibility,
  registrationMode,
  entryMode,
  onChange,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#E1E7EF] bg-white">
      <div className="flex items-center gap-3.5 border-b border-[#E1E7EF] px-5 py-4.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <ShieldCheck className="size-4.5" />
        </span>
        <div>
          <div className="text-[15px] font-bold text-[#1D283A]">
            Access &amp; Visibility
          </div>
          <div className="text-[12.5px] text-slate-500">
            Define event discovery, registration rules and entry method
          </div>
        </div>
      </div>

      <div className="space-y-6 px-5 pt-5 pb-6">
        <AccessOptionGroup<EventVisibility>
          legend="How visible should this event be?"
          name="visibility"
          options={VISIBILITY_OPTIONS}
          value={visibility}
          onChange={(next) => onChange({ visibility: next })}
          isOptionDisabled={(id) => UNAVAILABLE_VISIBILITIES.includes(id)}
        />

        <div className="h-px bg-[#E1E7EF]" />

        <AccessOptionGroup<EventRegistrationMode>
          legend="Who can register for this event?"
          name="registrationMode"
          options={REGISTRATION_OPTIONS}
          value={registrationMode}
          onChange={(next) => onChange({ registrationMode: next })}
          isOptionDisabled={(id) => UNAVAILABLE_REGISTRATION_MODES.includes(id)}
        />

        <div className="h-px bg-[#E1E7EF]" />

        <AccessOptionGroup<EventEntryMode>
          legend="How do attendees enter?"
          name="entryMode"
          options={ENTRY_OPTIONS}
          value={entryMode}
          onChange={(next) => onChange({ entryMode: next })}
          isOptionDisabled={(id) =>
            UNAVAILABLE_ENTRY_MODES.includes(id) ||
            isOpenEntryDisabled(registrationMode, id)
          }
        />
      </div>
    </section>
  );
}
