import { Facebook, Globe, Linkedin, Send } from "lucide-react";
import { getSafeExternalUrl } from "~/lib/utils";

interface PartnerSocialLinksProps {
  website?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  telegram?: string | null;
  name?: string | null;
}

export function PartnerSocialLinks({
  website,
  facebook,
  linkedin,
  telegram,
  name,
}: PartnerSocialLinksProps) {
  const links = [
    { url: website, icon: Globe, label: "Website" },
    { url: facebook, icon: Facebook, label: "Facebook" },
    { url: linkedin, icon: Linkedin, label: "LinkedIn" },
    {
      url: telegram ? `https://t.me/${telegram.replace("@", "")}` : null,
      icon: Send,
      label: "Telegram",
    },
  ]
    .map((link) => ({ ...link, url: getSafeExternalUrl(link.url) }))
    .filter(
      (link): link is typeof link & { url: string } =>
        typeof link.url === "string",
    );

  if (links.length === 0) return null;

  return (
    <div className="mt-2 flex justify-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Visit ${name ?? "partner"}'s ${link.label}`}
          className="flex size-8 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 transition-colors duration-200 hover:bg-blue-600/20"
        >
          <link.icon size={16} />
        </a>
      ))}
    </div>
  );
}
