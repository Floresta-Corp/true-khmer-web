import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const FLOWER = "/home-romdoul-flower.svg";

const DECORATIONS = [
  {
    left: "13%",
    top: "24%",
    size: "8rem",
    rotate: -30,
    opacity: 0.7,
    hideOnMobile: true,
  },
  {
    left: "20%",
    top: "50%",
    size: "3rem",
    rotate: 7,
    opacity: 0.8,
    hideOnMobile: true,
  },
  {
    left: "10%",
    top: "75%",
    size: "14rem",
    rotate: 75,
    opacity: 0.9,
    hideOnMobile: true,
  },
  {
    left: "80%",
    top: "9%",
    size: "3rem",
    rotate: 0,
    opacity: 0.9,
    hideOnMobile: true,
  },
  {
    left: "92%",
    top: "28%",
    size: "6.5rem",
    rotate: 0,
    opacity: 0.85,
    hideOnMobile: true,
  },
  {
    left: "92%",
    top: "68%",
    size: "20rem",
    rotate: 75,
    opacity: 1,
    hideOnMobile: true,
  },
] as const;

export function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {DECORATIONS.map((flower, i) => (
          <img
            key={i}
            src={FLOWER}
            alt=""
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${flower.hideOnMobile ? "hidden lg:block" : ""}`}
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

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:py-32">
        <h1 className="mt-13 max-w-3xl text-[36px] leading-[1.15] font-medium tracking-[-0.06em] text-[#333333] sm:text-5xl lg:text-[60px] lg:leading-18">
          Unleashing the Potential of Cambodia Through its People
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-[#606060] sm:text-lg">
          Khmer for Khmer, together, taking an active role in shaping our
          Kingdom's future by rebuilding trust in local capacity and supporting
          Khmer products, services, and initiatives.
        </p>
        <div className="mt-12 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            // asChild
            className="h-11 w-full rounded-lg border border-[#1c5dd4] bg-[#1c5dd4] px-5 text-sm font-medium text-white hover:bg-[#174fb4] sm:w-auto"
          >
            <Link to="/register">Join as a Member</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-lg border-[#1c5dd4] bg-white px-5 text-sm font-medium text-[#1c5dd4] hover:bg-[#1c5dd4]/5 hover:text-[#1c5dd4] sm:w-auto"
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
