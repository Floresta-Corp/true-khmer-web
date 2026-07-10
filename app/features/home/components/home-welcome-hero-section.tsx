const HERO_BACKGROUND = "/home-welcome-hero-bg.svg";

interface HomeWelcomeHeroSectionProps {
  name?: string | null;
}

export function HomeWelcomeHeroSection({ name }: HomeWelcomeHeroSectionProps) {
  const firstName = name?.trim().split(/\s+/)[0];

  return (
    <section className="relative flex min-h-130 flex-col bg-white lg:min-h-[max(650px,70vh,34.4vw)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[500px] bg-linear-to-r from-[#D5EDFF] to-[#FFFFFF] lg:hidden"
        style={{
          clipPath: "ellipse(120% 100% at 50% 0%)",
        }}
        aria-hidden
      />
      <img
        src={HERO_BACKGROUND}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-auto w-full lg:block"
      />

      {/* Content Layer */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-12 pb-6 sm:px-6 lg:min-h-[max(420px,34.4vw)] lg:flex-none lg:px-8">
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
