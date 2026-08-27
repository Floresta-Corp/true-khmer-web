import { Link } from "react-router";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import CreateEventAutosaveStatus, {
  type CreateEventAutosaveStatusValue,
} from "./create-event-autosave-status";

type Props = {
  closeTo: string;
  autosaveStatus: CreateEventAutosaveStatusValue;
  autosaveLabel: string;
};

/**
 * Sticky bar of the create-event takeover: leave, plus the Plumpi attribution.
 */
export default function CreateEventTopBar({
  closeTo,
  autosaveStatus,
  autosaveLabel,
}: Props) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E1E7EF] bg-white px-5 py-4 md:px-8 md:py-5">
      <Button
        asChild
        variant="ghost"
        className="h-9 gap-2 px-2 text-sm font-bold text-[#344256] hover:bg-slate-100"
      >
        <Link to={closeTo}>
          <X className="size-4" strokeWidth={2.4} />
          Close
        </Link>
      </Button>

      <div className="flex min-w-0 items-center gap-3 text-[13px] font-normal text-slate-500">
        <CreateEventAutosaveStatus
          status={autosaveStatus}
          label={autosaveLabel}
          className="hidden sm:flex"
        />

        <span className="hidden h-5 w-px bg-[#E1E7EF] sm:block" />

        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <img
            src="/images/Plumpi.svg"
            alt="Plumpi"
            className="h-8 w-auto md:h-9"
          />
        </div>
      </div>
    </header>
  );
}
