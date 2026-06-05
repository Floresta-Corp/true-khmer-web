import { Form, Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ChevronDown,
  CirclePlus,
  UserRound,
  FileUser,
  Ticket,
  BookmarkCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import type { AuthenticatedUser } from "~/lib/server/types";
import { cn, resolveImageURL } from "~/lib/utils";

interface ProfileDropDownProps {
  user: AuthenticatedUser;
}

function ProfileAvatar({
  className,
  profileImage,
  displayName,
  initials,
}: {
  className?: string;
  profileImage?: string;
  displayName?: string;
  initials: string;
}) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage
        src={profileImage || undefined}
        alt={displayName}
        className="object-center"
      />
      <AvatarFallback className="bg-[#EFF6FF] text-xs font-semibold text-[#2F6FE4]">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default function ProfileDropDown({ user }: ProfileDropDownProps) {
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const profileImage =
    resolveImageURL(user?.profile?.avatarUrl || undefined) ||
    resolveImageURL(user?.profile?.avatarKey || user?.avatar);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-9 rounded-full border border-[#f9fafb] bg-transparent p-0 hover:bg-[#f8fafc]"
          aria-label="Open profile menu"
        >
          <ProfileAvatar
            className="size-9 rounded-full object-cover"
            profileImage={profileImage}
            displayName={displayName}
            initials={initials}
          />
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-white p-0.5 flex items-center justify-center">
            <ChevronDown className="size-1.75 text-[#64748b]" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-50 pb-3 rounded-2xl border border-[#e2e8f0] px-0 pt-0 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
        align="end"
        sideOffset={8}
        forceMount
      >
        {/* Profile Section */}
        <div className="flex items-center gap-2 pb-2 pt-3 px-3">
          <Avatar className="size-7 border border-[#f9fafb]">
            <AvatarImage
              src={profileImage || undefined}
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#EFF6FF] text-[10px] font-semibold text-[#2F6FE4]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#344256] leading-3">
              {displayName}
            </span>
            <span className="text-[10px] text-[#65758b] leading-3">
              {user.email}
            </span>
          </div>
        </div>
        <Separator className="bg-[#f3f4f6]" />
        <div className="p-1">
          <DropdownMenuItem className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256] cursor-pointer hover:bg-[#f3f4f6]">
            <CirclePlus className="size-4 shrink-0" />
            <span>Enable new role</span>
          </DropdownMenuItem>
        </div>

        <Separator className="bg-[#f3f4f6]" />
        {/* Action List */}
        <div className="flex flex-col gap-1 py-1 px-1">
          <DropdownMenuItem
            asChild
            className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256] cursor-pointer hover:bg-[#f3f4f6]"
          >
            <Link to="/myspace" className="flex gap-3 items-center w-full">
              <UserRound className="size-4 shrink-0" />
              <span>My space</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256] cursor-pointer hover:bg-[#f3f4f6]"
          >
            <Link
              to="/my-applications"
              className="flex gap-3 items-center w-full"
            >
              <FileUser className="size-4 shrink-0" />
              <span>My applications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256] cursor-pointer hover:bg-[#f3f4f6]"
          >
            <Link to="/my-ticket" className="flex gap-3 items-center w-full">
              <Ticket className="size-4 shrink-0" />
              <span>My tickets</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256] cursor-pointer hover:bg-[#f3f4f6]"
          >
            <Link to="/saved-items" className="flex gap-3 items-center w-full">
              <BookmarkCheck className="size-4 shrink-0" />
              <span>Saved items</span>
            </Link>
          </DropdownMenuItem>
        </div>
        <Separator className="bg-[#f1f5f9]" />
        <div className="flex flex-col gap-0 py-1 px-1">
          <DropdownMenuItem
            asChild
            className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256] cursor-pointer hover:bg-[#f3f4f6]"
          >
            <Link to="/settings" className="flex gap-3 items-center w-full">
              <Settings className="size-4 shrink-0" />
              <span>Account settings</span>
            </Link>
          </DropdownMenuItem>
          <Form method="post" action="/logout" id="logout-form">
            <DropdownMenuItem
              className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#fb3748] cursor-pointer hover:bg-[#fbeaec]"
              onSelect={() => {
                (
                  document.getElementById("logout-form") as HTMLFormElement
                )?.requestSubmit();
              }}
            >
              <LogOut className="size-4 shrink-0" />
              <span>Log out</span>
            </DropdownMenuItem>
          </Form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
