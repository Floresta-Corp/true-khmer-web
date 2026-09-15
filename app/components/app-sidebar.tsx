import {
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  FileUser,
  GraduationCap,
  MessagesSquare,
  PenLine,
  Ticket,
  UserRound,
} from "lucide-react";
import { Link, useLocation, useRouteLoaderData } from "react-router";
import SpaceSwitchButton, {
  type SpaceSwitchFooter,
} from "~/components/space-switch/space-switch-button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useUserDisplay } from "~/hooks/use-user-display";
import { cn } from "~/lib/utils";
import type { loader as appLayoutLoader } from "~/layout/app-layout";

export type SidebarNavItem = {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Extra paths that keep this item active, for sub-pages on their own URL. */
  matchPaths?: string[];
};

export interface AppSidebarProps {
  /** Role badge shown under the user's name (e.g. "Member", "Creator"). */
  roleLabel: string;
  /** Primary navigation links. */
  items: SidebarNavItem[];
  headerAccentSrc?: string;
  /** Footer CTA that switches the user to the other space. */
  footer: SpaceSwitchFooter;
}

export default function AppSidebar({
  roleLabel,
  items,
  headerAccentSrc,
  footer,
}: AppSidebarProps) {
  const location = useLocation();
  const { isMobile } = useSidebar();
  const routeData =
    useRouteLoaderData<typeof appLayoutLoader>("layout/app-layout");
  const user = routeData?.user;
  const { displayName, initials, profileImage } = useUserDisplay(user);

  if (isMobile) return null;

  const isUnder = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const activeId = items.reduce<string | null>((match, item) => {
    const matches = isUnder(item.to) || (item.matchPaths ?? []).some(isUnder);
    if (!matches) return match;

    const bestTo = items.find((candidate) => candidate.id === match)?.to ?? "";
    return item.to.length > bestTo.length ? item.id : match;
  }, null);

  return (
    <Sidebar
      collapsible="none"
      className="h-full border-r bg-white"
      style={{ width: "17.5rem" }}
    >
      <SidebarHeader className="p-4">
        <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-2xl border border-[#e2e8f0] p-4">
          {headerAccentSrc && (
            <img
              src={headerAccentSrc}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-2 -right-2 h-19 w-auto select-none"
            />
          )}
          <div
            className={cn(
              "relative flex min-w-0 items-center gap-3",
              headerAccentSrc && "pr-12",
            )}
          >
            <Avatar className="size-11 border border-[#f9fafb]">
              <AvatarImage
                src={profileImage || undefined}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#EFF6FF] text-sm font-semibold text-[#2F6FE4]">
                {initials}
              </AvatarFallback>
              <AvatarBadge className="bg-emerald-500 ring-2 ring-white" />
            </Avatar>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-base font-semibold text-[#344256]">
                {displayName}
              </span>
              <span className="w-fit truncate rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={item.id === activeId}
                  className="rounded-xl px-3 py-5 text-[12px] font-normal transition-all data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
                >
                  <Link to={item.to}>
                    <item.icon className="size-5 shrink-0" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SpaceSwitchButton {...footer} />
      </SidebarFooter>
    </Sidebar>
  );
}

const workspaceNavItems: SidebarNavItem[] = [
  {
    id: "managepost",
    label: "Manage Opportunities",
    to: "/workspace/manage-post",
    icon: ClipboardList,
  },
  {
    id: "discussion",
    label: "My Discussions",
    to: "/workspace",
    icon: MessagesSquare,
  },
  {
    id: "courselisting",
    label: "Course Listing",
    to: "/course-listing",
    icon: GraduationCap,
  },
  {
    id: "myevents",
    label: "My Events",
    to: "/my-events",
    icon: CalendarDays,
  },
  {
    id: "khmervoices",
    label: "My Voices",
    to: "/workspace/khmer-voices",
    icon: PenLine,
  },
];

export const mySpaceSidebarConfig: AppSidebarProps = {
  roleLabel: "Member",
  items: [
    {
      id: "myprofile",
      label: "My Profile",
      to: "/myspace",
      icon: UserRound,
      matchPaths: ["/edit-profile"],
    },
    {
      id: "myapplications",
      label: "My Applications",
      to: "/my-applications",
      icon: FileUser,
    },
    { id: "myticket", label: "My Tickets", to: "/my-ticket", icon: Ticket },
    {
      id: "saveditems",
      label: "Saved Items",
      to: "/saved-items",
      icon: BookmarkCheck,
    },
    {
      id: "myclasses",
      label: "My Classes",
      to: "/my-classes",
      icon: GraduationCap,
    },
  ],
  footer: {
    to: "/workspace/manage-post",
    label: "Switch to Workspace",
    className: "bg-[#32A8FF] [a]:hover:bg-[#1E90FF]",
    spaceId: "workspace",
    switchingLabel: "Switching to Workspace…",
    intro: {
      icon: BriefcaseBusiness,
      title: "Welcome to your Workspace",
      description:
        "This is where you manage everything you post to the community. Here's what you can do:",
      items: workspaceNavItems.map(({ label, icon }) => ({ label, icon })),
      confirmLabel: "Go to Workspace",
    },
  },
};

export const workSpaceSidebarConfig: AppSidebarProps = {
  roleLabel: "Creator",
  items: workspaceNavItems,
  headerAccentSrc: "/images/workspace-icon.png",
  footer: {
    to: "/myspace",
    label: "Switch to My space",
    className: "bg-[#0b57d0] [a]:hover:bg-[#0b57d0]/90",
    spaceId: "myspace",
    switchingLabel: "Switching to My Space…",
  },
};
