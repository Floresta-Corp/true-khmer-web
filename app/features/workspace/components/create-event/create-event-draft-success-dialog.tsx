import { ArrowRight, CircleCheckBig, LoaderCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";

type Props = {
  open: boolean;
  eventName: string;
  isContinuing: boolean;
  onContinue: () => void;
  onGoBack: () => void;
};

export default function CreateEventDraftSuccessDialog({
  open,
  eventName,
  isContinuing,
  onContinue,
  onGoBack,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        className="w-full max-w-155 gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-[0_24px_80px_rgba(15,23,42,0.22)] ring-0 sm:max-w-155"
      >
        <div className="px-6 pt-8 pb-7 text-center sm:px-10 sm:pt-10 sm:pb-8">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-7 ring-emerald-50/60">
            <CircleCheckBig className="size-7" strokeWidth={2.2} />
          </span>

          <DialogTitle className="mt-6 text-[22px] leading-tight font-extrabold text-[#1D283A] sm:text-2xl">
            Draft created successfully
          </DialogTitle>
          <DialogDescription className="mx-auto mt-3 max-w-110 text-sm leading-6 text-slate-500">
            <span className="font-semibold text-[#344256]">
              {eventName || "Your event"}
            </span>{" "}
            is saved as a draft. Continue in Plumpi now to finish tickets,
            program scheduling and guest management.
          </DialogDescription>

          <div className="mx-auto mt-6 flex w-fit items-center gap-2.5 rounded-full border border-blue-100 bg-blue-50/60 px-4 py-2">
            <span className="text-xs font-semibold text-slate-500">
              Continue with
            </span>
            <img src="/images/Plumpi.svg" alt="Plumpi" className="h-7 w-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-[#E1E7EF] bg-[#F8FAFC] px-6 py-5 sm:grid-cols-2 sm:px-10 sm:py-6">
          <Button
            type="button"
            variant="outline"
            disabled={isContinuing}
            onClick={onGoBack}
            className="h-12 w-full rounded-xl border-[#DCE3EC] bg-white px-5 text-sm font-bold text-[#344256] hover:bg-slate-50"
          >
            Back to My Events
          </Button>
          <Button
            type="button"
            disabled={isContinuing}
            onClick={onContinue}
            className="h-12 w-full gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
          >
            {isContinuing ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ArrowRight className="size-4" />
            )}
            Continue in Plumpi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
