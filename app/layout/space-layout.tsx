import { Outlet } from "react-router";
import AppSidebar, { type AppSidebarProps } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";

/**
 * Shared layout for the myspace and workspace areas. Renders the sidebar from
 * the given config alongside a scrollable content area sized to the viewport
 * minus the navbar. Pass `children` to render a placeholder in the content area
 * instead of the matched route, e.g. a skeleton while a route loads.
 */
export default function SpaceLayout({
  sidebar,
  children,
}: {
  sidebar: AppSidebarProps;
  children?: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-[calc(100vh-var(--navbar-height))]">
        <div className="flex h-[calc(100vh-var(--navbar-height))] w-full">
          <AppSidebar {...sidebar} />
          <SidebarInset className="flex h-[calc(100vh-var(--navbar-height))] flex-1 flex-col overflow-y-auto bg-[#f5f6f8]">
            {children ?? <Outlet />}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
