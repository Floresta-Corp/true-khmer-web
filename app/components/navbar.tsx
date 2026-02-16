import { Form, Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
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
  Menu,
  X,
  Bell,
  LayoutDashboard,
  Settings,
  Plus,
  ChevronRight,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { useState } from "react";

interface NavbarProps {
  user: { id: string; email: string; name?: string } | null;
}

const navLinks = [
  { to: "/workspace", label: "Workspace", icon: Briefcase },
  { to: "/dashboard", label: "MY JOURNEY", icon: Compass },
  { to: "/forum", label: "Forum", icon: MessageSquare },
  { to: "/volunteer", label: "Volunteer", icon: Heart },
  { to: "/launchpad", label: "Launchpad", icon: Rocket },
  { to: "/events", label: "Events", icon: CalendarDays },
];

export function Navbar({ user }: NavbarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-blue-600 tracking-tight">
                ខ្មែរពិត
              </span>
              <span className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
                True Khmer
              </span>
            </div>
            <svg
              className="h-8 w-8 text-blue-500"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 4C10 4 6 10 6 16C6 22 10 28 16 28C22 28 26 22 26 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 4C20 8 22 12 22 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>

        {/* Center: Navigation Links */}
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
                {/* Active indicator bar at bottom */}
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
                className="hidden md:inline-flex text-gray-500 hover:text-gray-700"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex text-gray-500 hover:text-gray-700 relative"
              >
                <Bell className="h-5 w-5" />
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center gap-2.5 h-10 pl-2 pr-4 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200"
                  >
                    <Avatar className="h-8 w-8">
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

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Button
                  key={link.to}
                  variant={isActive ? "secondary" : "ghost"}
                  className="justify-start"
                  asChild
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to={link.to} className="gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
            {!user && (
              <>
                <div className="my-2 h-px bg-gray-200" />
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  className="justify-start bg-blue-600 hover:bg-blue-700"
                  asChild
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
