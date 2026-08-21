import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
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
  ClipboardPen,
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
  "/edit-profile",
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

const LAST_SECTION_STORAGE_KEY = "navbar:last-section";
type NavSection = "myspace" | "workspace";

export function Navbar({ user, loginRedirectTo }: NavbarProps) {
  const location = useLocation();

  const isInMySpace = isInSection(location.pathname, MYSPACE_SECTION_PATHS);
  const isInWorkspace = isInSection(location.pathname, WORKSPACE_SECTION_PATHS);

  const [lastSection, setLastSection] = useState<NavSection>("myspace");

  useEffect(() => {
    const stored = window.localStorage.getItem(LAST_SECTION_STORAGE_KEY);
    if (stored === "myspace" || stored === "workspace") {
      setLastSection(stored);
    }
  }, []);

  useEffect(() => {
    const currentSection: NavSection | null = isInMySpace
      ? "myspace"
      : isInWorkspace
        ? "workspace"
        : null;
    if (currentSection) {
      setLastSection(currentSection);
      window.localStorage.setItem(LAST_SECTION_STORAGE_KEY, currentSection);
    }
  }, [isInMySpace, isInWorkspace]);
  const isInSpaceSection = isInMySpace || isInWorkspace;

  const activeSection: NavSection = isInMySpace
    ? "myspace"
    : isInWorkspace
      ? "workspace"
      : lastSection;

  const sectionLink: NavLink =
    activeSection === "myspace"
      ? {
          to: "/myspace",
          label: "My space",
          icon: UserRound,
          forceActive: isInMySpace,
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
    { to: "/blog", label: "Blog", icon: ClipboardPen },
    { to: "/about", label: "About", icon: CircleUser, hide: !!user },
    { to: "/poc", label: "POC", icon: TvMinimalPlay, hide: true },
  ];

  // Mobile bottom nav shows the section link (My space / Workspace) at the
  // far right instead of the left, while the desktop nav keeps it first.
  const [firstNavLink, ...restNavLinks] = navLinks;
  const mobileNavLinks: NavLink[] = [...restNavLinks, firstNavLink];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#f1f5f9] bg-white shadow-sm">
        <div
          className={cn(
            "flex h-(--navbar-height) items-center justify-between",
            isInSpaceSection ? "w-full px-10" : "site-container",
          )}
        >
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
                    "group relative flex items-center gap-1.5 text-sm text-[#344256] transition-colors duration-200",
                    link === navLinks[0] &&
                      "mr-1 border-r border-[#c8d6e5] pr-6",
                    isActive ? "text-blue-600" : "hover:text-blue-600",
                  )}
                >
                  <link.icon className="h-4 w-4" />

                  <span className="relative grid">
                    <span
                      aria-hidden
                      className="invisible col-start-1 row-start-1 font-semibold"
                    >
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1",
                        isActive && "font-semibold",
                      )}
                    >
                      {link.label}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-1 left-0 h-0.5 w-full origin-center rounded-full bg-blue-600 transition-transform duration-200 ease-out",
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
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
      <nav className="fixed right-3 bottom-2.5 left-3 z-50 rounded-[24px] border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
        <div className="flex h-16 items-center justify-around gap-1.5 px-4">
          {mobileNavLinks.map((link) => {
            if (link.hide) return null;
            const isActive =
              link.forceActive ??
              (link.to === "/"
                ? location.pathname === "/"
                : location.pathname === link.to ||
                  location.pathname.startsWith(`${link.to}/`));
            const itemClassName = cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[11px] font-semibold transition-colors",
              isActive ? "text-blue-600" : "text-gray-400",
            );
            const itemContent = (
              <>
                <link.icon
                  className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "")}
                />
                <span>{link.label}</span>
              </>
            );
            if (link.forceActive) {
              return (
                <button
                  key={link.to}
                  type="button"
                  aria-label={`Open ${link.label} menu`}
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("space-sidebar:open"))
                  }
                  className={itemClassName}
                >
                  {itemContent}
                </button>
              );
            }

            return (
              <Link key={link.to} to={link.to} className={itemClassName}>
                {itemContent}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
