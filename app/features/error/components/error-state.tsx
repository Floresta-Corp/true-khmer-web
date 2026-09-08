import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const FLOWER = "/home-romdoul-flower.svg";

/* The romdoul motif from the home hero, thinned out so it frames the card
   instead of competing with it. */
const DECORATIONS = [
  { left: "8%", top: "18%", size: "9rem", rotate: -30, opacity: 0.12 },
  { left: "18%", top: "72%", size: "16rem", rotate: 75, opacity: 0.1 },
  { left: "88%", top: "22%", size: "6rem", rotate: 12, opacity: 0.14 },
  { left: "94%", top: "74%", size: "18rem", rotate: 75, opacity: 0.1 },
] as const;

interface ErrorStateProps {
  /** Rendered above the heading, e.g. "Error 404". */
  code?: string;
  heading: string;
  /** One entry per line, matching the two-line copy in the design. */
  lines?: string[];
  action?: ReactNode;
  /** Extra content below the action, e.g. the dev-only stack trace. */
  children?: ReactNode;
  className?: string;
}

export function ErrorState({
  code,
  heading,
  lines = [],
  action,
  children,
  className,
}: ErrorStateProps) {
  return (
    <main
      className={cn(
        "relative flex min-h-screen items-center overflow-hidden bg-[#f4f6f9] px-4 py-12 sm:py-20",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden
      >
        {DECORATIONS.map((flower, i) => (
          <img
            key={i}
            src={FLOWER}
            alt=""
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: flower.left,
              top: flower.top,
              width: flower.size,
              height: flower.size,
              opacity: flower.opacity,
              transform: `rotate(${flower.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-[#e7ecf3] bg-white px-6 py-14 text-center shadow-[0_30px_70px_-40px_rgba(28,150,211,0.45)] sm:px-12 sm:py-20">
          <span className="mx-auto flex size-18 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eaf2fe] to-[#dbe8fb] ring-1 ring-[#1c5dd4]/15">
            <img src={FLOWER} alt="" className="size-10" aria-hidden />
          </span>

          {code && (
            <p className="mt-8 bg-gradient-to-r from-[#1c97d4] to-[#243d95] bg-clip-text text-2xl font-semibold tracking-[-0.03em] text-transparent sm:text-3xl">
              {code}
            </p>
          )}

          <h1 className="mt-1 text-2xl leading-tight font-semibold tracking-[-0.04em] text-[#333333] sm:text-[32px]">
            {heading}
          </h1>

          {lines.length > 0 && (
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#606060]">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          )}

          {action !== undefined ? (
            action
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 w-full rounded-lg border border-[#1c5dd4] bg-[#1c5dd4] px-6 text-sm font-medium text-white hover:bg-[#2F6FE4] sm:w-auto"
              >
                <Link to="/">Back Home</Link>
              </Button>
            </div>
          )}

          {children}
        </div>
      </div>
    </main>
  );
}
