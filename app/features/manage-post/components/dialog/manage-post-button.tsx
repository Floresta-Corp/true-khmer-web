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
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-[14px] text-white rounded-xl gap-2 font-semibold p-6 shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto whitespace-nowrap">
            <Plus size={18} strokeWidth={2.5} />
            New Opportunity
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl p-10 rounded-[40px] gap-8 border-none [&>button]:top-8 [&>button]:right-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-slate-900">
            Post New Opportunity
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-base">
            Choose the type of engagement you want to create.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-6">
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

        {/* Footer Button from image_65e293.png */}
        <div className="flex justify-end pt-4">
          <Button
            disabled={!selected || isLoading}
            onClick={handleConfirm}
            className={`relative cursor-pointer overflow-hidden rounded-2xl py-7 font-bold text-base text-white transition-[width,background-color,color] duration-300 ease-out disabled:bg-slate-200 disabled:text-slate-400 ${
              isLoading
                ? "w-55 bg-blue-600 hover:bg-blue-700"
                : "w-80 bg-blue-600 hover:bg-blue-700"
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
