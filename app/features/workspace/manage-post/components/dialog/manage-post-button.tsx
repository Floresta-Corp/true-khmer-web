import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Briefcase, HandHeart, Plus } from "lucide-react";
import OptionCard from "./manage-post-btn-option";

export default function CreateOpportunityDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [selected, setSelected] = useState<"volunteer" | "project" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!selected || isLoading) return;
    setIsLoading(true);
    if (selected === "volunteer") navigate("/volunteer/create");
    if (selected === "project") navigate("/launchpad/create");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="shadow-brand-blue/20 w-full cursor-pointer gap-2 rounded-xl bg-blue-600 p-6 text-[14px] font-semibold whitespace-nowrap text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-95 sm:w-auto">
            <Plus size={18} strokeWidth={2.5} />
            New Opportunity
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-92 max-w-[calc(100%-2rem)] gap-5 rounded-3xl border border-slate-200 p-5 shadow-2xl sm:w-auto sm:max-w-3xl sm:gap-8 sm:rounded-[40px] sm:border-none sm:p-10 [&>button]:top-4 [&>button]:right-4 sm:[&>button]:top-8 sm:[&>button]:right-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 sm:text-3xl">
            Post New Opportunity
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 sm:text-base">
            Choose the type of engagement you want to create.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <OptionCard
            title="Volunteer"
            description="Perfect for community tasks, seasonal events, or recurring help functions."
            icon={<HandHeart size={28} strokeWidth={2} />}
            actionText="Post Opportunity"
            isSelected={selected === "volunteer"}
            onClick={() => setSelected("volunteer")}
          />

          <OptionCard
            title="Project"
            description="For specific initiatives with defined goals, milestones, and outcomes."
            icon={<Briefcase size={28} strokeWidth={2} />}
            actionText="Post Project"
            isSelected={selected === "project"}
            onClick={() => setSelected("project")}
          />
        </div>

        {/* Footer Button  */}
        <div className="flex justify-end pt-2 sm:pt-4">
          <Button
            disabled={!selected || isLoading}
            onClick={handleConfirm}
            className={`relative w-full cursor-pointer overflow-hidden rounded-2xl py-5 text-base font-bold text-white transition-[width,background-color,color] duration-300 ease-out disabled:bg-slate-200 disabled:text-slate-400 sm:py-7 ${
              isLoading
                ? "bg-blue-600 hover:bg-blue-700 sm:w-55"
                : "bg-blue-600 hover:bg-blue-700 sm:w-80"
            }`}
          >
            <span
              className={`block transition-all duration-300 ${
                isLoading
                  ? "translate-y-1 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              Confirm and Continue to Form
            </span>

            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isLoading
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-1 opacity-0"
              }`}
            >
              Loading...
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
