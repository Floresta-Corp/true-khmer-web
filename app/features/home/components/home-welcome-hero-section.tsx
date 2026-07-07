const HERO_BACKGROUND = "/home-welcome-hero-bg.svg";
const FLOWER = "/home-romdoul-flower.svg";

// Mobile-only romdoul flowers, matching the guest (logged-out) hero's white
// background treatment. Placed around the edges so they frame the text.
const MOBILE_DECORATIONS = [
  { left: "10%", top: "10%", size: "4.5rem", rotate: -20, opacity: 0.85 },
  { left: "80%", top: "15%", size: "9rem", rotate: 0, opacity: 0.9 },
  { left: "90%", top: "90%", size: "4.5rem", rotate: 10, opacity: 0.8 },
  { left: "16%", top: "83%", size: "9rem", rotate: 70, opacity: 0.9 },
] as const;

interface HomeWelcomeHeroSectionProps {
  name?: string | null;
}

export function HomeWelcomeHeroSection({ name }: HomeWelcomeHeroSectionProps) {
  const firstName = name?.trim().split(/\s+/)[0];

  return (
    <section className="relative flex min-h-130 flex-col overflow-hidden bg-white lg:min-h-[max(650px,70vh,34.4vw)]">
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#eef2ff] to-[#ffffff] lg:hidden"
        aria-hidden
      >
        {MOBILE_DECORATIONS.map((flower, i) => (
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
      <img
        src={HERO_BACKGROUND}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-auto w-full lg:block"
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-12 sm:px-6 lg:min-h-[max(420px,34.4vw)] lg:flex-none lg:px-8">
        <div className="mx-auto max-w-md text-center sm:max-w-xl lg:mx-0 lg:max-w-3xl lg:text-left">
          <p className="text-sm font-semibold text-[#1c5dd4]">
            {firstName ? `Welcome, ${firstName}!` : "Welcome!"}
          </p>
          <h1 className="mt-3 text-[30px] leading-[1.15] font-medium tracking-[-0.04em] text-[#333333] sm:text-5xl sm:tracking-[-0.06em] lg:text-[60px] lg:leading-18">
            Find Opportunities.
            <br />
            Make An Impact Today.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#606060] sm:mt-5 sm:text-lg">
            Join discussions, launch ideas, volunteer, and attend events with
            people building Cambodia's future.
          </p>
        </div>
      </div>
    </section>
  );
}
