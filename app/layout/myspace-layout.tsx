import { Outlet } from "react-router";
import MySpaceSideBar from "~/components/myspace-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <MySpaceSideBar />
      <SidebarInset className="bg-[#F8FAFC]">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
