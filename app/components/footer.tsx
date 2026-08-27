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
      // { label: "Events", to: "/events" },
      { label: "Volunteers", to: "/volunteer" },
      { label: "Launchpad", to: "/launchpad" },
      { label: "People of Cambodia", to: "#" },
    ],
  },
  {
    heading: "Community",
    links: [
      // { label: "Sponsors", to: "/" },
      // { label: "Success Stories", to: "/" },
      { label: "Blog", to: "/blog" },
      { label: "Partners", to: "/community" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Us", to: "/about" },
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

const legalLinks = [
  { label: "Privacy Policy", to: "/" },
  { label: "Terms of Service", to: "/" },
  { label: "Cookie Settings", to: "/" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e2e8f0] bg-[#f9fafb]">
      <div className="site-container pt-14 pb-28 sm:pb-14">
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
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:max-w-xl lg:gap-12">
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
