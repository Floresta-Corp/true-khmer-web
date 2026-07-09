import { Outlet } from "react-router";
import AppSidebar, { mySpaceSidebarConfig } from "~/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";
import { useIsMobile } from "~/hooks/use-mobile";

export default function MySpaceLayout() {
  const isMobile = useIsMobile();
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-[calc(100vh-var(--navbar-height))] w-full">
          <AppSidebar {...mySpaceSidebarConfig} />
          <SidebarInset className="flex h-[calc(100vh-var(--navbar-height))] flex-1 flex-col overflow-y-auto bg-[#f8fafc]">
            {isMobile && <SidebarTrigger className="h-10 w-10" />}

            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
