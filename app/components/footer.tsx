import { Facebook, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router";
import LogoSvg from "~/components/icons/logoSvg";

// Inline so the icon inherits currentColor (hover/theme) like the lucide icons.
function TikTok({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564" />
    </svg>
  );
}

const footerColumns = [
  {
    heading: "Platform",
    links: [
      { label: "Forum", to: "/forum" },
      { label: "Events", to: "/events" },
      { label: "Volunteers", to: "/volunteer" },
      { label: "Launchpad", to: "/launchpad" },
      // { label: "People of Cambodia", to: "#" },
    ],
  },
  {
    heading: "Community",
    links: [
      // { label: "Sponsors", to: "/" },
      // { label: "Success Stories", to: "/" },
      { label: "Khmer voices", to: "/blog" },
      { label: "Partners", to: "/community" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Us", to: "/about" },
      // { label: "Our Team", to: "/" },
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
    icon: TikTok,
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

const storeLinks = [
  {
    caption: "Download on the",
    label: "App Store",
    to: "#",
    path: "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.47-2.09-.49-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.24 7.31c1.35.07 2.29.74 3.07.79.9-.16 1.85-.86 3.24-.75 2.06.16 3.51 1.51 4.06 3.05-3.46 2.05-2.71 6.66.44 7.62-.65 1.05-1.19 1.66-2 2.26zM12.14 7.15c-.15-2.23 1.63-4.09 3.72-4.26.24 2.14-1.9 4.24-3.72 4.26z",
  },
  {
    caption: "Get it on",
    label: "Google Play",
    to: "#",
    path: "M3.6 2.6c-.3.3-.5.7-.5 1.2v16.4c0 .5.2.9.5 1.2l.1.1L13 12l-9.3-9.4-.1 0zM15.9 14.9l-2.5-2.5L3.7 22.1c.3.2.7.2 1.1 0l11.1-7.2zM15.9 9.1L4.8 1.9c-.4-.2-.8-.2-1.1 0l9.7 9.7 2.5-2.5zM20.6 10.9l-3.5-2-2.7 2.1 2.7 2.1 3.5-2c.6-.4.6-1.4 0-1.8-.1-.1-.1-.1 0-.4z",
  },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Cookie Policy", to: "/cookies" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e2e8f0] bg-white">
      <div className="site-container pt-14 pb-28 sm:pb-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
          {/* Brand section */}
          <div className="flex max-w-sm shrink-0 flex-col gap-5">
            <Link to="/" className="inline-flex w-fit">
              <LogoSvg
                width={82}
                height={32}
                className="h-12 w-auto"
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
                  <Link
                    key={item.label}
                    to={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#6a7282] transition-all hover:border-[#2f6fe4] hover:text-[#2f6fe4]"
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-3">
              {storeLinks.map((store) => (
                <a
                  key={store.label}
                  href={store.to}
                  className="flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-white no-underline transition-opacity hover:opacity-90"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path d={store.path} />
                  </svg>
                  <span className="whitespace-nowrap">
                    <span className="block text-[9px] leading-tight font-medium text-white">
                      {store.caption}
                    </span>
                    <span className="block text-[13px] leading-tight font-bold text-white">
                      {store.label}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:max-w-3xl lg:gap-12">
            {footerColumns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold tracking-wider text-[#2f6fe4] uppercase">
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
