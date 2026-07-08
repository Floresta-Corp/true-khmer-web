import { Outlet, useLocation } from "react-router";
import WorkSpaceSideBar from "~/components/workspace-sidebar";
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

export default function WorkspaceLayout() {
  const isMobile = useIsMobile();
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-[calc(100vh-68px)] w-full">
          <WorkSpaceSideBar />
          <SidebarInset className="flex h-[calc(100vh-68px)] flex-1 flex-col overflow-y-auto bg-[#f8fafc]">
            {isMobile && <SidebarTrigger className="h-10 w-10" />}

            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
