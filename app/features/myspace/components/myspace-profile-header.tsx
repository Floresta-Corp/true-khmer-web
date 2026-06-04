import { Linkedin, Facebook, Twitter, Globe, MapPin, Mail } from "lucide-react";

interface ProfileHeaderProps {
  displayName: string;
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  occupation: string | null;
  tier?: string | null;
  location: string | null;
  email: string | null;
  socialLinks: {
    linkedin?: string | null;
    facebook?: string | null;
    twitter?: string | null;
    website?: string | null;
  };
}

interface LinkItem {
  icon: React.ReactNode;
  label: string;
  href: string | null;
  external?: boolean;
  isText?: boolean;
}

export function ProfileHeader({
  displayName,
  avatarUrl,
  firstName,
  lastName,
  occupation,
  socialLinks,
  tier,
  location,
  email,
}: ProfileHeaderProps) {
  const infoLinks = [
    location && {
      icon: <MapPin className="size-3.5 shrink-0 text-[#8a94a6]" />,
      label: location,
      href: null,
      isText: true,
    },
    email && {
      icon: <Mail className="size-3.5 shrink-0 text-[#8a94a6]" />,
      label: email,
      href: `mailto:${email}`,
    },
    socialLinks.website && {
      icon: <Globe className="size-3.5 shrink-0 text-[#8a94a6]" />,
      label: socialLinks.website.replace(/^https?:\/\//, ""),
      href: socialLinks.website,
      external: true,
    },
    socialLinks.linkedin && {
      icon: <Linkedin className="size-3.5 shrink-0 text-[#8a94a6]" />,
      label: socialLinks.linkedin.replace(/^https?:\/\//, ""),
      href: socialLinks.linkedin,
      external: true,
    },
    socialLinks.facebook && {
      icon: <Facebook className="size-3.5 shrink-0 text-[#8a94a6]" />,
      label: socialLinks.facebook.replace(/^https?:\/\//, ""),
      href: socialLinks.facebook,
      external: true,
    },
    socialLinks.twitter && {
      icon: <Twitter className="size-3.5 shrink-0 text-[#8a94a6]" />,
      label: socialLinks.twitter.replace(/^https?:\/\//, ""),
      href: socialLinks.twitter,
      external: true,
    },
  ].filter(Boolean) as LinkItem[];

  return (
    <div className="rounded-[24px] overflow-hidden border border-[#e2e8f0] shadow-sm flex flex-col bg-white">
      <div className="px-8 py-7 flex items-center gap-6 bg-linear-to-br from-[#deeefe] to-[#f8fafc]">
        <div className="shrink-0 bg-white size-20 rounded-full relative p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="object-cover size-full"
              />
            ) : (
              <div className="size-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-500">
                  {firstName[0]}
                  {lastName[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name + Tier + Occupation */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-[24px] tracking-tight text-[#1e2329]">
              {displayName}
            </span>

            {tier && (
              <span className="text-[10px] font-black tracking-wider px-3 py-1 rounded-full text-white bg-[#e5b25d] ">
                {tier.toUpperCase()}
              </span>
            )}
          </div>
          {occupation && (
            <p className="text-[14px] font-semibold ">{occupation}</p>
          )}
        </div>
      </div>

      {/* 2. Crisp Divider Line */}
      <div className="h-px bg-[#e2e8f0]" />

      <div className="bg-white px-8 py-4 flex flex-wrap gap-x-6 gap-y-2 items-center bg-linear-to-br from-[#ecf5ff] to-[#f8fafc]">
        {infoLinks.map((link, i) =>
          link?.href ? (
            <a
              key={i}
              href={link?.href}
              target={link?.external ? "_blank" : undefined}
              rel={link?.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 text-[13px] font-semibold text-blue-500 hover:underline transition-colors min-w-0"
            >
              {link?.icon}
              <span className="truncate max-w-55">
                {link?.label}
                {link?.external && (
                  <span className="text-[10px] ml-0.5 opacity-60">↗</span>
                )}
              </span>
            </a>
          ) : (
            <div
              key={i}
              className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]"
            >
              {link?.icon ?? ""}
              <span>{link?.label}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
