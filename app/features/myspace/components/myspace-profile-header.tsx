import { Linkedin, Facebook, Twitter, Globe, MapPin, Mail } from "lucide-react";
import { resolveImageURL } from "~/lib/utils";

interface ProfileHeaderProps {
  displayName: string;
  avatarKey: string | null;
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
  avatarKey,
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
    <div className="flex flex-col overflow-hidden rounded-3xl border bg-white">
      <div className="flex flex-col items-start gap-4 bg-linear-to-br from-[#deeefe] to-[#f8fafc] px-6 py-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8 sm:py-7">
        <div className="relative size-20 shrink-0 rounded-full bg-white p-0.5">
          <div className="h-full w-full overflow-hidden rounded-full">
            {avatarKey ? (
              <img
                src={resolveImageURL(avatarKey)}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-indigo-100">
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
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[24px] font-bold tracking-tight text-[#1e2329]">
              {displayName}
            </span>

            {tier && (
              <span className="rounded-full bg-[#e5b25d] px-3 py-1 text-[10px] font-black tracking-wider text-white">
                {tier.toUpperCase()}
              </span>
            )}
          </div>
          {occupation && (
            <p className="text-[14px] font-semibold">{occupation}</p>
          )}
        </div>
      </div>

      {/* 2. Crisp Divider Line */}
      <div className="h-px bg-[#e2e8f0]" />

      <div className="flex flex-col items-start gap-2 bg-white bg-linear-to-br from-blue-50/70 to-[#f8fafc] px-6 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 sm:px-8">
        {infoLinks.map((link, i) =>
          link?.href ? (
            <a
              key={i}
              href={link?.href}
              target={link?.external ? "_blank" : undefined}
              rel={link?.external ? "noopener noreferrer" : undefined}
              className="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-blue-500 transition-colors hover:underline"
            >
              {link?.icon}
              <span className="max-w-55 truncate">
                {link?.label}
                {link?.external && (
                  <span className="ml-0.5 text-[10px] opacity-60">↗</span>
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
