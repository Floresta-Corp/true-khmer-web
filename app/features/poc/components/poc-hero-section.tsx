import { Badge } from "~/components/ui/badge";

export function PocHeroSection() {
  return (
    <section className="relative z-10 w-full py-8 sm:py-12 lg:py-16">
      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:mb-12 sm:px-6 lg:px-8">
        <Badge className="mb-6 bg-[#1c97d4] px-4 py-0 text-sm font-normal text-white hover:bg-[#1c97d4] md:text-base">
          People of Cambodia
        </Badge>
        <h1 className="text-3xl leading-tight font-normal text-[#243d95] md:text-6xl lg:text-7xl">
          Stories that shape the nation
        </h1>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl cursor-not-allowed items-center justify-center">
          <img
            src="/images/poc/poc.webp"
            alt="People of Cambodia"
            title="Video Coming Soon"
            className="h-full w-full rounded-2xl shadow-2xl drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
