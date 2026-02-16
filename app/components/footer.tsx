import { Link } from "react-router";
import { Separator } from "~/components/ui/separator";
import { Instagram, Facebook, Twitter, Mail, Globe } from "lucide-react";

const footerLinks = {
  "Your Journey": [
    { label: "My Identity", to: "#" },
    { label: "My Impact", to: "#" },
    { label: "Leaderboard", to: "#" },
    { label: "Tier Benefits", to: "#" },
  ],
  Marketplace: [
    { label: "Product", to: "#" },
    { label: "Service Providers", to: "#" },
    { label: "Merchant Tools", to: "#" },
  ],
  Community: [
    { label: "Resources", to: "#" },
    { label: "Forum", to: "/forum" },
    { label: "Events", to: "/events" },
    { label: "Mentorship", to: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "#" },
    { label: "Terms of Service", to: "#" },
    { label: "Cookie Policy", to: "#" },
    { label: "Ethics Covenant", to: "#" },
  ],
};

const socialLinks = [
  { icon: Instagram, to: "#", label: "Instagram" },
  { icon: Facebook, to: "#", label: "Facebook" },
  { icon: Twitter, to: "#", label: "Twitter" },
  { icon: Mail, to: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Logo + Description */}
          <div className="md:col-span-2">
            <div className="flex flex-col gap-4">
              <Link to="/">
                <img
                  src="/logofullcolor.svg"
                  alt="Logo"
                  className="h-10 w-auto"
                  loading="lazy"
                />
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
                Empowering the Khmer community through heritage-driven growth,
                cultural preservation, and collective economic sovereignty.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  to={social.to}
                  className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
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
      <Separator className="bg-gray-100" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              © 2026 True Khmer. All roots protected.
            </p>
            <p className="text-[11px] text-gray-400 italic mt-0.5">
              Designed with respect for heritage and future.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Region: Cambodia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
