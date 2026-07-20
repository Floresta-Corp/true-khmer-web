import { useEffect } from "react";
import { Outlet } from "react-router";
import AppSidebar, { type AppSidebarProps } from "~/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "~/components/ui/sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";

/**
 * Bridges a `window` "space-sidebar:open" event (dispatched by the mobile
 * bottom navbar, which lives outside this SidebarProvider) to the mobile
 * sidebar drawer. Only active on mobile.
 */
function SidebarOpenBridge() {
  const { setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (!isMobile) return;
    const open = () => setOpenMobile(true);
    window.addEventListener("space-sidebar:open", open);
    return () => window.removeEventListener("space-sidebar:open", open);
  }, [isMobile, setOpenMobile]);

  return null;
}

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
          <SidebarOpenBridge />
          <AppSidebar {...sidebar} />
          <SidebarInset className="flex h-[calc(100vh-var(--navbar-height))] flex-1 flex-col overflow-y-auto bg-[#f8fafc]">
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
