import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Briefcase,
  MessageSquare,
  Heart,
  Rocket,
  CalendarDays,
  Bell,
  LayoutDashboard,
  Video,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { AuthenticatedUser } from "~/lib/server/types";
import ProfileDropDown from "./profile-dropdown";

interface NavbarProps {
  user: AuthenticatedUser | null;
  loginRedirectTo?: string;
}

const navLinks = [
  { to: "/myspace", label: "My Space", icon: LayoutDashboard },
  // { to: "/dashboard", label: "My Journey", icon: Compass },
  { to: "/forum", label: "Forum", icon: MessageSquare },
  { to: "/forumv2", label: "Forum V2", icon: MessageSquare },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/volunteer", label: "Volunteer", icon: Heart },
  { to: "/launchpad", label: "Launchpad", icon: Rocket },
  { to: "/poc", label: "POC", icon: Video },
];

export function Navbar({ user, loginRedirectTo }: NavbarProps) {
  const location = useLocation();

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logofullcolor.svg"
                alt="Logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Center: Navigation Links (desktop only) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to)
                ? true
                : false;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-5 text-sm transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900",
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 relative"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                {/* User dropdown */}
                <ProfileDropDown user={user} />
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to={`/login?redirectTo=${encodeURIComponent(loginRedirectTo || "/")}`}
                  >
                    Login
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-[10px] font-semibold transition-colors",
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
