import { Outlet, useLocation } from "react-router";
import MySpaceSideBar from "~/components/myspace-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";
import { useIsMobile } from "~/hooks/use-mobile";

// const pageMeta: Record<string, { title: string; subtitle: string }> = {
//   "/workspace": {
//     title: "My Discussions",
//     subtitle: "Track your community engagement and shared knowledge.",
//   },
//   "/manage-post": {
//     title: "Manage Posting",
//     subtitle:
//       "Manage and monitor your active community opportunities postings.",
//   },
//   "/volunteer": {
//     title: "Opportunities",
//     subtitle: "Browse and apply for volunteer opportunities near you",
//   },
// };

export default function AppLayout() {
  const location = useLocation();

  const isMobile = useIsMobile();
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
          <MySpaceSideBar />
          <SidebarInset className="flex-1 flex flex-col bg-[#f8fafc]">
            {/* <header className="flex h-14 items-center border-b bg-white p-4 lg:px-6 shrink-0">
            </header> */}
            {/* Only show trigger on mobile */}
            {isMobile && <SidebarTrigger className="h-10 w-10" />}

            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
