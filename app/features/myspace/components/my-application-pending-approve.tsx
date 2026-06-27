import { ArrowRight, Clock3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLoaderData, useSearchParams } from "react-router";
import type { loader } from "../route/my-applications";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function MyApplicationPendingApprove() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { myApplication } = useLoaderData<typeof loader>();
  const filter = searchParams.get("filter");
  const summary = myApplication.summary;
  const handleReviewClicked = () => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.set("filter", "approved");
        return nextParams;
      },
      { replace: true },
    );
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
          <div className="overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50 shadow-[0_12px_32px_rgba(245,158,11,0.06)] transition-all dark:border-amber-900/50 dark:bg-amber-950/25">
            <div className="flex flex-col items-start justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                  <Clock3 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <h2 className="text-[17px] font-bold tracking-tight text-amber-950 dark:text-amber-100">
                      Confirmation Required
                    </h2>
                    <Badge className="flex items-center gap-1 rounded-full border-none bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm hover:bg-amber-700">
                      {summary.APPROVED} Pending
                    </Badge>
                  </div>
                  <p className="text-[12px] font-semibold text-amber-800/85 dark:text-amber-300/80">
                    Please finalize your participation for approved requests.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  disabled={filter === "approved"}
                  onClick={handleReviewClicked}
                  className="flex h-10 grow cursor-pointer items-center gap-2 rounded-xl border-none bg-amber-600 px-6 text-[12px] font-bold text-white transition-all hover:bg-amber-700 sm:grow-0"
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
