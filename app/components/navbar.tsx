import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Mail,
  LayoutDashboard,
  HeartHandshake,
  Calendar,
  MessagesSquare,
  House,
  BriefcaseBusiness,
  TvMinimalPlay,
  UserRound,
  CircleUser,
  Users,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import NotificationBellPopOver from "~/components/notification-bell-pop-over";
import { cn } from "~/lib/utils";
import type { AuthenticatedUser } from "~/lib/server/types";
import ProfileDropDown from "./profile-dropdown";
import LogoSvg from "~/components/icons/logoSvg";

interface NavbarProps {
  user: AuthenticatedUser | null;
  loginRedirectTo?: string;
}

type NavLink = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  hide?: boolean;
  forceActive?: boolean;
};

const MYSPACE_SECTION_PATHS = [
  "/myspace",
  "/my-applications",
  "/my-ticket",
  "/saved-items",
];
const WORKSPACE_SECTION_PATHS = ["/manage-post", "/workspace", "/my-events"];

function isInSection(pathname: string, sectionPaths: string[]) {
  return sectionPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function Navbar({ user, loginRedirectTo }: NavbarProps) {
  const location = useLocation();

  const isInMySpace = isInSection(location.pathname, MYSPACE_SECTION_PATHS);
  const isInWorkspace = isInSection(location.pathname, WORKSPACE_SECTION_PATHS);

  const sectionLink: NavLink = isInMySpace
    ? {
        to: "/myspace",
        label: "My space",
        icon: UserRound,
        forceActive: true,
      }
    : {
        to: "/manage-post",
        label: "Workspace",
        icon: LayoutDashboard,
        forceActive: isInWorkspace,
      };

  const navLinks: NavLink[] = [
    { ...sectionLink, hide: !user },
    { to: "/", label: "Home", icon: House },
    // { to: "/dashboard", label: "My Journey", icon: Compass },
    { to: "/forum", label: "Forum", icon: MessagesSquare },
    // { to: "/forumv2", label: "Forum V2", icon: MessageSquare },
    // { to: "/events", label: "Events", icon: Calendar },
    { to: "/volunteer", label: "Volunteer", icon: HeartHandshake },
    { to: "/launchpad", label: "Launchpad", icon: BriefcaseBusiness },
    {to : "/community", label: "Community", icon: Users},
    { to: "/about", label: "About", icon: CircleUser },
    { to: "/poc", label: "POC", icon: TvMinimalPlay, hide: true },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#f1f5f9] bg-white shadow-sm">
        <div className="mx-auto flex h-(--navbar-height) w-full max-w-300 items-center justify-between px-4 lg:px-6">
          {/* Left: Logo */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="flex items-center gap-2">
              <LogoSvg
                width={102}
                height={40}
                className="h-10 w-auto"
                aria-label="True Khmer"
              />
            </Link>
          </div>

          {/* Center: Navigation Links (desktop only) */}
          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.forceActive ??
                (link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to ||
                    location.pathname.startsWith(`${link.to}/`));
              if (link.hide) return null;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative flex items-center gap-1.5 text-sm text-[#344256] transition-all",
                    link === navLinks[0] &&
                      "mr-1 border-r border-[#c8d6e5] pr-6",
                    isActive
                      ? "font-semibold text-blue-600"
                      : "hover:font-semibold hover:text-blue-600",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notification icons */}
                {/* <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="size-9 rounded-full border border-[#f1f5f9] bg-white text-[#344256] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                  aria-label="Messages"
                >
                  <Link to="/messages">
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button> */}
                <NotificationBellPopOver />
                {/* User dropdown */}
                <ProfileDropDown user={user} />
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to={`/login?redirectTo=${encodeURIComponent(loginRedirectTo || "/")}`}
                  >
                    Sign in
                  </Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="bg-linear-to-r from-[#0082e1] to-[#5ab9ff] text-white hover:from-[#0078d2] hover:to-[#4aaef8]"
                >
                  <Link to="/register">Join the community</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
        <div className="flex h-16 items-center justify-around px-1">
          {navLinks.map((link) => {
            if (link.hide) return null;
            const isActive =
              link.forceActive ??
              (link.to === "/"
                ? location.pathname === "/"
                : location.pathname === link.to ||
                  location.pathname.startsWith(`${link.to}/`));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold transition-colors",
                  isActive ? "text-blue-600" : "text-gray-400",
                )}
              >
                <link.icon
                  className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "")}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
