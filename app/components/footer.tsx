import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router";

const footerColumns = [
  {
    heading: "Platform",
    links: [
      { label: "Forum", to: "/" },
      { label: "Events", to: "/events" },
      { label: "Volunteers", to: "/volunteer" },
      { label: "Launchpad", to: "/" },
      { label: "People of Cambodia", to: "/" },
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
  { label: "Facebook", to: "#", icon: Facebook },
  { label: "Twitter", to: "#", icon: Twitter },
  { label: "Instagram", to: "#", icon: Instagram },
  { label: "LinkedIn", to: "#", icon: Linkedin },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/" },
  { label: "Terms of Service", to: "/" },
  { label: "Cookie Settings", to: "/" },
];

export function Footer() {
  return (
    <footer className="w-full bg-white px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto flex w-full max-w-[1278px] flex-col gap-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,493px)_minmax(0,1fr)] lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-flex w-fit">
              <img
                src="/logofullcolor.svg"
                alt="True Khmer"
                className="h-[29px] w-auto"
                loading="lazy"
              />
            </Link>
            <p className="max-w-[413px] text-sm leading-5 text-[#6a7282]">
              The leading community platform for Khmer business and career
              growth. Bridging the gap between talent and opportunity worldwide.
            </p>
            <div className="flex items-center gap-3.5 pt-1">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    aria-label={item.label}
                    className="flex size-[35px] items-center justify-center rounded-full border border-[#f3f4f6] bg-[#f9fafb] text-[#2f6fe4] transition-colors hover:bg-[#eff6ff]"
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <p className="text-xs font-semibold leading-4 text-[#2f6fe4]">
                  {column.heading}
                </p>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="w-fit text-sm leading-5 text-[#020618] transition-colors hover:text-[#2f6fe4]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e2e8f0] pt-[33px] text-sm leading-5 text-[#62748e] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 True Khmer. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
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
