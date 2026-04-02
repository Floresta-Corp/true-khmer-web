import { Form, Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronRight, LogOut, Plus, Settings } from "lucide-react";
import { Separator } from "./ui/separator";
import { AvatarFallback, Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import type { AuthenticatedUser } from "~/lib/server/route-guards.server";
import { resolveImageURL } from "~/lib/utils";

interface ProfileDropDownProps {
  user: AuthenticatedUser;
}

export default function ProfileDropDown({ user }: ProfileDropDownProps) {
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const profileImage = resolveImageURL(user?.avatarKey);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-2.5 h-10 pl-2 pr-2 sm:pr-4 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileImage} alt={displayName} />
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
        <div>
          <p className="px-5 pt-5 text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1">
            Public Profile
          </p>
          <DropdownMenuItem className="px-5 py-4 rounded-none">
            <Link to="/profile" className="flex items-center gap-3 group">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gray-800 text-white text-lg font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          </DropdownMenuItem>
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
        <div className="py-2 pb-3">
          <DropdownMenuItem asChild className="rounded-none px-5">
            <Link
              to="/settings"
              className="flex items-center gap-3 py-3 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </DropdownMenuItem>

          <Form method="post" action="/logout" id="logout-form">
            <DropdownMenuItem
              className="flex items-center gap-3 py-3 rounded-none px-5 cursor-pointer text-gray-700 hover:text-gray-900"
              onSelect={() => {
                (
                  document.getElementById("logout-form") as HTMLFormElement
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
  );
}
