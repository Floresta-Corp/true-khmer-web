import { Facebook, Globe, Linkedin, Send } from "lucide-react";
import FullFlower from "~/components/icons/fullFlower";

interface PartnerOnlinePresenceProps {
  website?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  telegram?: string | null;
}

export function PartnerOnlinePresence({
  website,
  facebook,
  linkedin,
  telegram,
}: PartnerOnlinePresenceProps) {
  const links = [
    { url: website, icon: Globe, label: "Website" },
    { url: facebook, icon: Facebook, label: "Facebook" },
    { url: linkedin, icon: Linkedin, label: "LinkedIn" },
    {
      url: telegram ? `https://t.me/${telegram.replace("@", "")}` : null,
      icon: Send,
      label: "Telegram",
    },
  ].filter(
    (link): link is typeof link & { url: string } =>
      typeof link.url === "string" && link.url.length > 0,
  );

  return (
    <div>
      <h2 className="mb-9 text-2xl font-bold text-card-foreground">
        Contact Information
      </h2>
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-muted to-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10">
            <Globe className="size-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="mb-4 font-semibold text-card-foreground">
              Online Presence
            </h4>
            {links.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md border-l-2 border-l-blue-600 bg-muted px-3 py-1.5 text-sm text-foreground hover:bg-muted/70"
                  >
                    <link.icon size={16} />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No online presence information available
              </p>
            )}
          </div>
        </div>
        <div className="absolute -top-3 -right-8 rotate-30 text-blue-600">
          <FullFlower width={100} height={100} />
        </div>
      </div>
    </div>
  );
}
