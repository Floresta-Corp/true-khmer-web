import { ChevronRight, Vote } from "lucide-react";
import { motion } from "motion/react";
import { useLoaderData } from "react-router";
import type { loader } from "../routes/my-applications";

export default function MyApplicationPendingApprove() {
  const { myApplication } = useLoaderData<typeof loader>();
  const summary = myApplication.summary;
  return (
    <motion.div
      hidden={summary.APPROVED > 0 ? false : true}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
    >
      <div className="flex items-center gap-4 text-center md:text-left">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
          <Vote size={24} />
        </div>
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400 tracking-tight">
              {summary.APPROVED} Approve Applications
            </h3>
            <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-400 text-[10px] font-black rounded-full">
              ACTION NEEDED
            </span>
          </div>
          {/*<p className="text-sm text-amber-700/70 dark:text-amber-400/60 mt-1">
            There are 7 user verification requests waiting for manual
            validation.
          </p>*/}
        </div>
      </div>
      <button
        // onClick={() => onAction?.("kyc")}
        className="w-full md:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
      >
        Review Applications
        <ChevronRight size={16} />
      </button>
    </motion.div>
  );
}
