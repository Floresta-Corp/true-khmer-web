import { MyApplicationLoader } from "~/routes/api/myspace/my-application-loader";
import MyApplicationHeader from "../components/section/my-application-header";
import MyApplicationRightSidebar from "../components/section/my-application-right-sidebar";
import { useLoaderData } from "react-router";
import MyApplicationCardList from "../components/section/my-application-card-list";
import MyAppicationMainContentHeader from "../components/section/my-application-main-content-header";
import MyApplicationPendingApprove from "../components/my-application-pending-approve";

export const loader = MyApplicationLoader;

export function meta() {
  return [{ title: "My Applications | True Khmer" }];
}

export default function MyApplicationPage() {
  return (
    <div className="w-full min-h-screen py-12 bg-gray-100">
      <div className="max-w-300 mx-auto flex flex-col gap-8 px-4 lg:px-6">
        <MyApplicationHeader />
        <MyApplicationPendingApprove />
        <div className="w-full flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1 space-y-8">
            <MyAppicationMainContentHeader />
            <MyApplicationCardList />
          </div>
          <div className="w-full lg:w-80">
            <MyApplicationRightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
