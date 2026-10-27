import { useState } from "react";
import { CheckCircle2, ChevronDown, Star, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useLaunchpadSelectedRoles } from "../../../../stores/selected-launchpad-roles-store";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface CollaborationCardProps {
  data: {
    id: string;
    title: string;
    responsibilities: string[];
    requirements: string[];
    availableSpot: number;
  };
  launchpadId: string;
  launchpadName?: string;
  roles?: Array<{ id: string; title: string }>;
  hideApplyButton?: boolean;
}

export default function LaunchpadCollaborationCard({
  data,
  hideApplyButton,
}: CollaborationCardProps) {
  const { addRole, removeRole, setTopPick, isRoleSelected, isTopPick } =
    useLaunchpadSelectedRoles();

  const [expanded, setExpanded] = useState(false);
  const hasDetails =
    data.responsibilities.length > 0 || data.requirements.length > 0;

  const spotLabel = data.availableSpot === 1 ? "Spot" : "Spots";
  const selected = isRoleSelected(data.id);
  const topPick = isTopPick(data.id);

  return (
    <div className="rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] p-4">
      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF]">
            <Users className="size-4.25 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1 text-sm">
            <div className="truncate font-semibold text-[#0F1729]">
              {data.title}
            </div>
            {data.responsibilities[0] ? (
              <p className="line-clamp-1 text-[13px] text-[#94A3B8]">
                {data.responsibilities[0]}
              </p>
            ) : null}
            {hasDetails ? (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="mt-1 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#2f6fe4]"
              >
                {expanded ? "Hide details" : "View details"}
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    expanded && "rotate-180",
                  )}
                />
              </button>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs whitespace-nowrap text-[#9EACC0]">
              Available
            </div>
            <p className="text-sm font-semibold whitespace-nowrap text-blue-500">
              {data.availableSpot} {spotLabel}
            </p>
          </div>
        </div>
        {!hideApplyButton && (
          <div className="flex w-full items-center gap-1.5 sm:w-auto">
            <Button
              className={cn(
                "h-9 flex-1 px-4 text-sm font-medium hover:bg-blue-600 sm:h-8 sm:flex-none",
                selected ? "bg-[#1c5dd4]" : "bg-blue-500",
              )}
              onClick={() => {
                if (!selected) addRole(data.id);
                else removeRole(data.id);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={selected ? "selected" : "select"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {selected ? "Selected" : "Select"}
                </motion.span>
              </AnimatePresence>
            </Button>
            <AnimatePresence>
              {selected && (
                <motion.div
                  key="top-pick-btn"
                  initial={{ opacity: 0, x: -12, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 12, width: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <Button
                    type="button"
                    variant={topPick ? "default" : "outline"}
                    className={cn(
                      "h-9 shrink-0 px-2 text-xs sm:h-8",
                      topPick
                        ? "bg-[#2f6fe4] text-white hover:bg-[#245fca]"
                        : "border-[#e1e7ef] text-[#65758b] hover:bg-[#f8fafc]",
                    )}
                    onClick={() => setTopPick(data.id)}
                  >
                    <Star className={cn("size-3.5", topPick && "fill-white")} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {selected && (
                <motion.div
                  key="remove-btn"
                  initial={{ opacity: 0, x: -12, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 12, width: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut", delay: 0.05 }}
                  className="overflow-hidden"
                >
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-9 shrink-0 border-red-200 px-2 text-xs text-red-500 hover:bg-red-50 sm:h-8"
                    onClick={() => removeRole(data.id)}
                  >
                    Remove
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <AnimatePresence initial={false}>
        {expanded && hasDetails ? (
          <motion.div
            key="role-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-5 border-t border-[#E7ECF3] pt-4 lg:grid-cols-2">
              <RolePointList
                title="Responsibilities"
                items={data.responsibilities}
              />
              <RolePointList title="Requirements" items={data.requirements} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

interface RolePointListProps {
  title: string;
  items: string[];
}

// Mirrors the role details on the Volunteer detail page.
function RolePointList({ title, items }: RolePointListProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h4 className="text-sm font-semibold text-[#030213] uppercase">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-sm text-gray-600">
            <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
