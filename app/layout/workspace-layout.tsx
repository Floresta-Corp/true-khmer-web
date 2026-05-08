import { Outlet, useLocation } from "react-router";
import MySpaceSideBar from "~/components/myspace-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { TooltipProvider } from "~/components/ui/tooltip";
import { useIsMobile } from "~/hooks/use-mobile";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/workspace": {
    title: "My Discussions",
    subtitle: "Track your community engagement and shared knowledge.",
  },
  "/manage-post": {
    title: "Manage Posting",
    subtitle:
      "Manage and monitor your active community opportunities postings.",
  },
  "/volunteer": {
    title: "Opportunities",
    subtitle: "Browse and apply for volunteer opportunities near you",
  },
};

export default function AppLayout() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? { title: "", subtitle: "" };
  const isMobile = useIsMobile();
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <MySpaceSideBar />
          <SidebarInset className="flex-1 flex flex-col bg-[#f8fafc]">
            {/* <header className="flex h-14 items-center border-b bg-white p-4 lg:px-6 shrink-0">
            </header> */}
            {/* Only show trigger on mobile */}
            {isMobile && <SidebarTrigger className="h-10 w-10" />}

            <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                {meta.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-2xl">
                {meta.subtitle}
              </p>
            </div>

            <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
