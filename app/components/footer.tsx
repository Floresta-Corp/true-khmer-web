import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router";
import LogoSvg from "../../public/logoSvg";

const footerColumns = [
  {
    heading: "Platform",
    links: [
      { label: "Forum", to: "/forum" },
      // { label: "Events", to: "/events" },
      { label: "Volunteers", to: "/volunteer" },
      { label: "Launchpad", to: "/launchpad" },
      { label: "People of Cambodia", to: "#" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Sponsors", to: "/" },
      { label: "Success Stories", to: "/" },
      { label: "Partners", to: "/" },
      { label: "News", to: "/" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Our Team", to: "/" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    to: "https://www.facebook.com/truekhmerofficial",
    icon: Facebook,
  },
  {
    label: "TikTok",
    to: "https://www.tiktok.com/@truekhmerofficial",
    icon: "/images/tiktok.svg",
  },
  {
    label: "YouTube",
    to: "https://www.youtube.com/@TrueKhmerofficial",
    icon: Youtube,
  },
  {
    label: "LinkedIn",
    to: "https://www.linkedin.com/company/truekhmerofficial/posts/?feedView=all",
    icon: Linkedin,
  },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/" },
  { label: "Terms of Service", to: "/" },
  { label: "Cookie Settings", to: "/" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e2e8f0] bg-[#f9fafb]">
      <div className="w-full px-6 py-14 md:px-12 lg:px-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
          {/* Brand section */}
          <div className="flex max-w-sm shrink-0 flex-col gap-5">
            <Link to="/" className="inline-flex w-fit">
              <LogoSvg
                width={82}
                height={32}
                className="h-8 w-auto"
                aria-label="True Khmer"
              />
            </Link>
            <p className="text-sm leading-6 text-[#6a7282]">
              The leading community platform for Khmer business and career
              growth. Bridging the gap between talent and opportunity worldwide.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#6a7282] transition-all hover:border-[#2f6fe4] hover:text-[#2f6fe4]"
                  >
                    {typeof Icon === "string" ? (
                      <img src={Icon} alt="" className="size-4" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:max-w-xl lg:gap-12">
            {footerColumns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2f6fe4]">
                  {column.heading}
                </h3>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm leading-5 text-[#374151] transition-colors hover:text-[#2f6fe4]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#e2e8f0] pt-8 text-sm text-[#6a7282] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} True Khmer. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="transition-colors hover:text-[#2f6fe4]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
