import { ArrowUpRight, Facebook, Linkedin, Youtube } from "lucide-react";
import TikTok from "~/components/icons/tiktok";
import { Button } from "~/components/ui/button";

const socialLinks = [
  {
    label: "Facebook",
    to: "https://www.facebook.com/peopleofcambodiaofficial",
    icon: Facebook,
  },
  {
    label: "LinkedIn",
    to: "https://www.linkedin.com/company/peopleofcambodiaofficial/",
    icon: Linkedin,
  },
  {
    label: "TikTok",
    to: "https://www.tiktok.com/@peopleofcambodiaofficial",
    icon: TikTok,
  },
  {
    label: "YouTube",
    to: "https://www.youtube.com/@PeopleofCambodiaofficial",
    icon: Youtube,
  },
];

export function PocIntroSection() {
  return (
    <section className="relative z-10 w-full py-8 sm:py-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:px-8">
        <h2 className="flex-1 text-3xl leading-relaxed font-bold text-[#243d95] md:text-4xl lg:text-5xl">
          Khmer role models - stories that inspire positive change
        </h2>

        <div className="flex-1">
          <p className="mt-2 text-justify text-lg text-[#243d95]/90 md:mt-4 md:text-left md:text-xl">
            As actions are often born from inspiration, People of Cambodia
            presents inspiring stories of local role models who, just like you,
            faced various obstacles along the way and confronted them with
            resolve and positivity. Their brave actions led to meaningful
            improvements in their own lives, as well as the lives of their
            families and communities—ultimately making the world a little better
            than the day before and moving Cambodia one step closer to its
            declared development goals.
          </p>

          <Button
            title="Watch More Videos - Coming Soon"
            className="mt-8 h-11 cursor-not-allowed rounded-lg bg-[#1c5dd4] px-5 text-sm font-medium text-white hover:bg-[#2f6fe4]"
          >
            Watch More Videos
            <ArrowUpRight />
          </Button>

          <div className="mt-4 flex items-center gap-4 lg:mt-10">
            <span className="text-sm text-[#243d95]">We are on:</span>
            {socialLinks.map(({ label, to, icon: Icon }) => (
              <a
                key={label}
                href={to}
                title={label}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#243d95] transition-colors hover:text-[#1c97d4]"
              >
                <Icon className="size-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
