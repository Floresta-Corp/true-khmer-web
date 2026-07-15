import { Form, Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ChevronDown,
  UserRound,
  FileUser,
  Ticket,
  BookmarkCheck,
  Settings,
  LogOut,
  Moon,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import type { AuthenticatedUser } from "~/lib/server/types";
import { cn } from "~/lib/utils";
import { useUserDisplay } from "~/hooks/use-user-display";

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
  const { displayName, initials, profileImage } = useUserDisplay(user);

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
          <span className="absolute right-0 bottom-0 flex size-3 items-center justify-center rounded-full bg-white p-0.5">
            <ChevronDown className="size-1.75 text-[#64748b]" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[288px] rounded-2xl border border-[#e2e8f0] px-0 pt-0 pb-3 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
        align="end"
        sideOffset={8}
        forceMount
      >
        {/* Profile Section */}
        <div className="flex items-center gap-3 px-5 py-5">
          <Avatar className="size-11 border border-[#f9fafb]">
            <AvatarImage
              src={profileImage || undefined}
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#EFF6FF] text-[10px] font-semibold text-[#2F6FE4]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-3 font-semibold text-[#344256]">
              {displayName}
            </span>
            <span className="text-xs leading-3 font-semibold text-[#65758b]">
              {user.email}
            </span>
          </div>
        </div>
        {/* <Separator className="bg-[#f3f4f6]" />
        <div className="p-1">
          <DropdownMenuItem className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256]">
            <Moon className="size-5 shrink-0" />
            <span className="text-sm font-semibold">Dark Mode</span>
            <Toggle />
          </DropdownMenuItem>
        </div> */}
        {/* THIS IS TURN OFF FOR NOW */}
        {/* <Separator className="bg-[#f3f4f6]" />
        <div className="p-1">
          <DropdownMenuItem className="flex gap-3 items-center px-3 py-2 rounded-lg text-xs font-normal text-[#344256] cursor-pointer hover:bg-[#f3f4f6]">
            <CirclePlus className="size-5 shrink-0" />
            <span className="text-sm font-semibold">Enable new role</span>
          </DropdownMenuItem>
        </div>
        */}

        {/* Action List */}
        {/* <Separator className="bg-[#f3f4f6]" />
        <div className="flex flex-col gap-1 px-1 py-1">
          <DropdownMenuItem
            asChild
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-normal text-[#344256] hover:bg-[#f3f4f6]"
          >
            <Link to="/myspace" className="flex w-full items-center gap-3">
              <UserRound className="size-5 shrink-0" />
              <span className="text-sm font-semibold">My space</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-normal text-[#344256] hover:bg-[#f3f4f6]"
          >
            <Link
              to="/my-applications"
              className="flex w-full items-center gap-3"
            >
              <FileUser className="size-5 shrink-0" />
              <span className="text-sm font-semibold">My applications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-normal text-[#344256] hover:bg-[#f3f4f6]"
          >
            <Link to="/my-ticket" className="flex w-full items-center gap-3">
              <Ticket className="size-5 shrink-0" />
              <span className="text-sm font-semibold">My tickets</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-normal text-[#344256] hover:bg-[#f3f4f6]"
          >
            <Link to="/saved-items" className="flex w-full items-center gap-3">
              <BookmarkCheck className="size-5 shrink-0" />
              <span className="text-sm font-semibold">Saved items</span>
            </Link>
          </DropdownMenuItem>
        </div> */}
        <Separator className="bg-[#f1f5f9]" />
        <div className="flex flex-col gap-0 px-1 py-1">
          <DropdownMenuItem
            asChild
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-normal text-[#344256] hover:bg-[#f3f4f6]"
          >
            <Link to="/settings" className="flex w-full items-center gap-3">
              <Settings className="size-5 shrink-0" />
              <span className="text-sm font-semibold">Account settings</span>
            </Link>
          </DropdownMenuItem>
          <Form method="post" action="/logout" id="logout-form">
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-normal text-[#fb3748] hover:bg-[#fbeaec] hover:text-[#fb3748]"
              onSelect={() => {
                (
                  document.getElementById("logout-form") as HTMLFormElement
                )?.requestSubmit();
              }}
            >
              <LogOut className="size-5 shrink-0" />
              <span className="text-sm font-semibold">Log out</span>
            </DropdownMenuItem>
          </Form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
