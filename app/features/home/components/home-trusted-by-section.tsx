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
        <div className="mt-4 flex items-center gap-x-10 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:gap-x-12 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
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
