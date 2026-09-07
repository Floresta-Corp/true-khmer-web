import { myApplicationsLoader } from "../services/my-applications.loader";
import { myApplicationAction } from "../services/my-application.action";
import MyApplicationRightSidebar from "../components/section/my-application-right-sidebar";
import MyApplicationCardList from "../components/section/my-application-card-list";
import MyApplicationMainContentHeader from "../components/section/my-application-main-content-header";
import MyApplicationHeader from "../components/section/my-application-header";
import MyApplicationPendingApprove from "../components/my-application-pending-approve";
import { Link, useSearchParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft } from "lucide-react";

export const loader = myApplicationsLoader;
export const action = myApplicationAction;

export function meta() {
  return [{ title: "My Applications | True Khmer" }];
}

export default function MyApplicationPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("filter");

  return (
    <div className="min-h-full w-full bg-[#f8fafc] py-8 sm:py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 rounded-2xl bg-white p-4 sm:p-6 lg:p-8 dark:bg-slate-900">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <MyApplicationHeader />
          </motion.div>
          <MyApplicationPendingApprove />

          <div className="flex w-full flex-col gap-10 xl:flex-row xl:items-start xl:gap-14">
            <div className="min-w-0 flex-1 space-y-8">
              <AnimatePresence mode="wait">
                {initialTab === "approved" ? (
                  <Link
                    key="my-application-back-link"
                    to="/my-applications"
                    className="flex items-center gap-1 text-sm font-bold text-[#1A73E8] transition-colors hover:text-[#1557B0]"
                  >
                    <ChevronLeft className="size-4" />
                    Back to Dashboard
                  </Link>
                ) : (
                  <MyApplicationMainContentHeader key="my-application-main-content-header" />
                )}
              </AnimatePresence>
              <MyApplicationCardList />
            </div>
            <div className="w-full xl:w-85 xl:shrink-0">
              <MyApplicationRightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
