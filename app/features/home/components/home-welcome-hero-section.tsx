import WelcomeHeroBg from "~/components/icons/welcomeHeroBg";

const ALIGN_TO_CONTAINER =
  "translateX(calc(min(100%, 75rem) / 2 - 1.5rem - 44.709%))";

interface HomeWelcomeHeroSectionProps {
  name?: string | null;
}

export function HomeWelcomeHeroSection({ name }: HomeWelcomeHeroSectionProps) {
  const firstName = name?.trim().split(/\s+/)[0];

  return (
    <section className="relative flex min-h-115 flex-col overflow-hidden bg-white lg:min-h-[max(650px,70vh,34.4vw)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-115 bg-linear-to-r from-[#D5EDFF] to-[#FFFFFF] lg:hidden"
        style={{
          clipPath: "ellipse(120% 100% at 50% 0%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block"
        aria-hidden
      >
        <div className="relative" style={{ transform: ALIGN_TO_CONTAINER }}>
          <div className="absolute top-0 right-full h-[72.795%] w-screen bg-[#D5EDFF]" />
          <div className="absolute top-0 left-full h-[84.99%] w-screen bg-linear-to-b from-white to-[#FCFEFF]" />
          <WelcomeHeroBg className="h-auto w-full" />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-4 pb-6 sm:px-6 sm:pt-8 lg:min-h-[max(420px,34.4vw)] lg:flex-none lg:items-center lg:px-8 lg:pt-0">
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
