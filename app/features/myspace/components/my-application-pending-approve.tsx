import { ArrowRight, Clock3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLoaderData, useSearchParams } from "react-router";
import type { loader } from "../routes/my-applications";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function MyApplicationPendingApprove() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { myApplication } = useLoaderData<typeof loader>();
  const summary = myApplication.summary;
  const handleReviewClicked = () => {
    setSearchParams({ filter: "approved" }, { replace: true });
  };
  return (
    <AnimatePresence mode="wait">
      {summary.APPROVED > 0 && (
        <motion.div
          key="pending-approve"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="bg-white dark:bg-slate-900 border border-orange-100 dark:border-orange-900/30 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all">
            <div className="bg-orange-50/50 dark:bg-orange-950/10 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                  <Clock3 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <h2 className="text-[17px] font-bold text-gray-900 dark:text-orange-50 tracking-tight">
                      Confirmation Required
                    </h2>
                    <Badge className="bg-orange-600 text-white hover:bg-orange-700 border-none px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm shadow-orange-200">
                      {summary.APPROVED} Pending
                    </Badge>
                  </div>
                  <p className="text-[12px] text-gray-500 dark:text-orange-400/60 font-medium">
                    Please finalize your participation for approved requests.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  onClick={handleReviewClicked}
                  className="h-10 rounded-full px-6 text-[12px] font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all flex items-center gap-2 grow sm:grow-0"
                >
                  Review
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
