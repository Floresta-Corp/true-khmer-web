import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import type { AuthenticatedUser } from "~/lib/server/types";
import LogoSvg from "~/components/icons/logoSvg";
import type { AppSidebarProps } from "~/components/app-sidebar";

type NavLink = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  hide?: boolean;
  forceActive?: boolean;
  isSection?: boolean;
};

export type MobileSpaceNav = AppSidebarProps & { label: string };

interface MobileNavSheetProps {
  navLinks: NavLink[];
  spaceNav: MobileSpaceNav | null;
  user: AuthenticatedUser | null;
  loginRedirectTo?: string;
}

export default function MobileNavSheet({
  navLinks,
  spaceNav,
  user,
  loginRedirectTo,
}: MobileNavSheetProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const itemClassName = (isActive: boolean) =>
    cn(
      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-blue-50 font-semibold text-blue-600"
        : "text-[#344256] hover:bg-[#f8fafc]",
    );
  const activeSpaceItemId =
    spaceNav?.items.reduce<string | null>((match, item) => {
      const matches =
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`);
      if (!matches) return match;

      const bestTo =
        spaceNav.items.find((candidate) => candidate.id === match)?.to ?? "";
      return item.to.length > bestTo.length ? item.id : match;
    }, null) ?? null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="-ml-1 text-[#344256] md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[82%] max-w-[320px] gap-0 bg-white p-0"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-[#f1f5f9] px-4 py-3">
          <SheetTitle asChild>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center"
            >
              <LogoSvg
                width={102}
                height={40}
                className="h-9 w-auto"
                aria-label="True Khmer"
              />
            </Link>
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close menu">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-3">
          {spaceNav && (
            <div className="mb-3 border-b border-[#f1f5f9] pb-3">
              <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                {spaceNav.label}
              </p>
              <ul className="flex flex-col gap-1">
                {spaceNav.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={itemClassName(item.id === activeSpaceItemId)}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
            Explore
          </p>
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              if (link.hide || (link.isSection && spaceNav)) return null;
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to ||
                    location.pathname.startsWith(`${link.to}/`);

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={itemClassName(isActive)}
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {spaceNav && (
          <div className="mt-auto border-t border-[#f1f5f9] p-4">
            <Button
              asChild
              onClick={() => setOpen(false)}
              className={cn(
                "h-12 w-full rounded-xl text-sm font-bold text-white",
                spaceNav.footer.className,
              )}
            >
              <Link to={spaceNav.footer.to}>{spaceNav.footer.label}</Link>
            </Button>
          </div>
        )}

        {!user && (
          <div className="mt-auto flex flex-col gap-2 border-t border-[#f1f5f9] p-4">
            <Button variant="ghost" asChild onClick={() => setOpen(false)}>
              <Link
                to={`/login?redirectTo=${encodeURIComponent(loginRedirectTo || "/")}`}
              >
                Sign in
              </Link>
            </Button>
            <Button
              asChild
              onClick={() => setOpen(false)}
              className="bg-linear-to-r from-[#0082e1] to-[#5ab9ff] text-white hover:from-[#0078d2] hover:to-[#4aaef8]"
            >
              <Link to="/register">Join the community</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
