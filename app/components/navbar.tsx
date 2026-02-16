import { Form, Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Briefcase,
  Compass,
  MessageSquare,
  Heart,
  Rocket,
  CalendarDays,
  LogOut,
  Bell,
  LayoutDashboard,
  Settings,
  Plus,
  ChevronRight,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

interface NavbarProps {
  user: { id: string; email: string; name?: string } | null;
}

const navLinks = [
  { to: "/workspace", label: "Workspace", icon: Briefcase },
  { to: "/dashboard", label: "My Journey", icon: Compass },
  { to: "/forum", label: "Forum", icon: MessageSquare },
  { to: "/volunteer", label: "Volunteer", icon: Heart },
  { to: "/launchpad", label: "Launchpad", icon: Rocket },
  { to: "/events", label: "Events", icon: CalendarDays },
];

export function Navbar({ user }: NavbarProps) {
  const location = useLocation();

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

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
              const isActive =
                location.pathname === link.to ||
                (link.to === "/dashboard" &&
                  location.pathname.startsWith("/dashboard"));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative flex items-center gap-2.5 h-10 pl-2 pr-2 sm:pr-4 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://i.pravatar.cc/150?u=socheata"
                          alt={displayName}
                        />
                        <AvatarFallback className="bg-gray-800 text-white text-sm font-semibold">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:block text-sm font-medium text-gray-700">
                        {displayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-72 rounded-2xl p-0 shadow-lg border border-gray-100"
                    align="end"
                    sideOffset={8}
                    forceMount
                  >
                    {/* Public Profile Section */}
                    <div className="px-5 pt-5 pb-4">
                      <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-4">
                        Public Profile
                      </p>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 group"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gray-800 text-white text-lg font-bold">
                            {displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">
                            {displayName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </Link>
                    </div>

                    <Separator className="bg-gray-100" />

                    {/* Contributor Ecosystem Section */}
                    <div className="px-5 py-4">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Contributor Ecosystem
                      </p>
                      <Link
                        to="#"
                        className="flex items-center gap-3 rounded-full bg-blue-50 border border-blue-100 px-4 py-2.5 hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-600">
                          Contributor profile
                        </span>
                      </Link>
                    </div>

                    <Separator className="bg-gray-100" />

                    {/* Settings & Logout */}
                    <div className="px-3 py-2">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-gray-700 hover:text-gray-900"
                        >
                          <Settings className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">Settings</span>
                        </Link>
                      </DropdownMenuItem>

                      <Form method="post" action="/logout" id="logout-form">
                        <DropdownMenuItem
                          className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-gray-700 hover:text-gray-900"
                          onSelect={() => {
                            (
                              document.getElementById(
                                "logout-form",
                              ) as HTMLFormElement
                            )?.requestSubmit();
                          }}
                        >
                          <LogOut className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">Logout</span>
                        </DropdownMenuItem>
                      </Form>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
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
            const isActive =
              location.pathname === link.to ||
              (link.to === "/dashboard" &&
                location.pathname.startsWith("/dashboard"));
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
