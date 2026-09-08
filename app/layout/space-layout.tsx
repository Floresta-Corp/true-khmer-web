import { Outlet } from "react-router";
import AppSidebar, { type AppSidebarProps } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";

/**
 * Shared layout for the myspace and workspace areas. Renders the sidebar from
 * the given config alongside a scrollable content area sized to the viewport
 * minus the navbar.
 */
export default function SpaceLayout({ sidebar }: { sidebar: AppSidebarProps }) {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-[calc(100vh-var(--navbar-height))]">
        <div className="flex h-[calc(100vh-var(--navbar-height))] w-full">
          <AppSidebar {...sidebar} />
          <SidebarInset className="flex h-[calc(100vh-var(--navbar-height))] flex-1 flex-col overflow-y-auto bg-[#f8fafc]">
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
