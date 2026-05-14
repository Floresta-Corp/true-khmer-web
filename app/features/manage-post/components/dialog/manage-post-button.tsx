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
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (selected === "volunteer") navigate("/volunteer/create");
    if (selected === "project") navigate("/launchpad/create");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-[14px] text-white rounded-xl gap-2 font-semibold p-6">
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
            disabled={!selected}
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-7 rounded-2xl font-bold text-base shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            Confirm and Continue to Form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
