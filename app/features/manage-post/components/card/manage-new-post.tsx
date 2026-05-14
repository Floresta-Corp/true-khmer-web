import { Link } from "react-router";
import { Plus } from "lucide-react";
import CreateOpportunityDialog from "../dialog/manage-post-button";

export default function PostingNewCard() {
  return (
    <CreateOpportunityDialog
      trigger={
        <button
          type="button"
          className="w-full h-full outline-dashed outline-2 outline-gray-200 border-none rounded-2xl p-5 flex flex-col items-center justify-center gap-2 min-h-55 hover:bg-gray-50 hover:outline-blue-400 transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-colors shadow-sm">
            <Plus size={20} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
              New Posting
            </p>
            <p className="text-[12px] text-gray-400">
              Start a new community opportunity
            </p>
          </div>
        </button>
      }
    />
  );
}
