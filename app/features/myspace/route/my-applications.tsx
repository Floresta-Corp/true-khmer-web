import { myApplicationsLoader } from "../services/my-applications.loader";
import { myApplicationAction } from "../services/my-application.action";
import MyApplicationRightSidebar from "../components/section/my-application-right-sidebar";
import MyApplicationCardList from "../components/section/my-application-card-list";
import MyApplicationMainContentHeader from "../components/section/my-application-main-content-header";
import MyApplicationPendingApprove from "../components/my-application-pending-approve";
import { Link, useSearchParams } from "react-router";
import { AnimatePresence } from "motion/react";
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
    <div className="min-h-screen w-full bg-white py-8 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto flex max-w-350 flex-col gap-8 px-4 sm:px-6 lg:px-10">
        <MyApplicationPendingApprove />
        <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start xl:gap-14">
          <div className="flex-1 space-y-8">
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
          <div className="w-full lg:w-85">
            <MyApplicationRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
