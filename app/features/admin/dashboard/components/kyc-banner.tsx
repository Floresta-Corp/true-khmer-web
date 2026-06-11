import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Fingerprint } from "lucide-react";

export function KycBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-950 dark:bg-orange-950/20"
    >
      <div className="absolute inset-y-0 left-0 w-0.75 rounded-l-xl bg-orange-500" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 pr-6 pl-8">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 shrink-0 rounded-full bg-orange-500/15 flex items-center justify-center">
            <Fingerprint className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-amber-700 dark:text-amber-400 font-semibold text-[15px] leading-none">
                Pending KYC Review
              </span>
              <span className="inline-flex items-center rounded bg-orange-100 border border-orange-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-orange-700 dark:bg-orange-500/20 dark:border-orange-500/30 dark:text-orange-400">
                ACTION NEEDED
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              There are 7 user verification requests waiting for manual
              validation.
            </p>
          </div>
        </div>
        <Link
          to="/tk-admin/kyc"
          className="shrink-0 flex items-center gap-2 rounded-lg bg-orange-600 hover:bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          Review Applications
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
