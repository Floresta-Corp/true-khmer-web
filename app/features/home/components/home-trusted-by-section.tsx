const PARTNERS = [
  { src: "/images/Plumpi.svg", name: "Plumpi" },
  { src: "/images/CashewNotes.svg", name: "CashewNotes" },
  { src: "/images/Bondoul.svg", name: "Bondoul" },
  { src: "/images/Floresta.svg", name: "Floresta" },
  { src: "/images/Innovex.svg", name: "Innovex" },
  { src: "/images/Joblink.svg", name: "Joblink" },
  { src: "/images/ESC.svg", name: "ESC" },
] as const;

export function HomeTrustedBySection() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-[#2f6fe4]">
          Trusted &amp; Loved By Cambodia's Community
        </p>
        {/* Mobile: auto-scrolling marquee (duplicated track for a seamless loop) */}
        <div className="scrollbar-hide mt-4 overflow-x-auto sm:hidden">
          <div className="animate-marquee flex w-max items-center">
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <img
                key={`${partner.src}-${index}`}
                src={partner.src}
                alt={partner.name}
                className="mr-10 h-12 w-32 shrink-0 object-contain"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* Desktop static wrapped layout */}
        <div className="mt-4 hidden items-center gap-x-12 gap-y-6 sm:flex sm:flex-wrap sm:justify-center">
          {PARTNERS.map((partner) => (
            <img
              key={partner.src}
              src={partner.src}
              alt={partner.name}
              className="h-12 w-32 shrink-0 object-contain"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
