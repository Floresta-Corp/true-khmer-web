const FLOWER = "/home-romdoul-flower.svg";

interface Pillar {
  title: string;
  description: string;
  image: string;
}

const PILLARS: Pillar[] = [
  {
    title: "Inspiration",
    description:
      "As action begins with inspiration, and inspiration comes from appropriation, our first action is sharing the inspiring stories of Cambodia's secret role models.",
    image: "/images/Inspiration.jpg",
  },
  {
    title: "Support",
    description:
      "A growing network of businesses and individuals united by True Khmer's mission, recognized through physical and digital badges.",
    image: "/images/Support.webp",
  },
  {
    title: "Activation",
    description:
      "National bi-monthly campaigns driving public conversations on Khmer identity, generational dialogue, and reimagining cultural legacy as a force for growth.",
    image: "/images/Activation.webp",
  },
  {
    title: "Reward",
    description:
      "A Cambodian award ceremony recognizing those who have contributed to the country's development and its journey toward ambitious goals.",
    image: "/images/Reward.webp",
  },
];

export function HomePillarsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-20 lg:py-24">
      <img
        src={FLOWER}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-12 -left-20 size-64 -rotate-12 opacity-[0.07]"
      />
      <img
        src={FLOWER}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-6 -right-16 size-56 rotate-12 opacity-[0.07]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-[#2f6fe4]">
            Four Pillars of Action
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#333333] sm:text-[36px]">
            How We Build Cambodia's Future
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#606060]">
            To achieve that objective we have defined four pillars of action
            that will be conducted throughout the year.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center text-center"
            >
              <div className="rounded-full border-2 border-dashed border-[#c8d6e5] p-2">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="size-34 rounded-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#1d283a]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#606060]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
