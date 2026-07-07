import { Facebook, Linkedin, Youtube } from "lucide-react";
import TikTok from "../../../../public/icons/tiktok";
interface SocialLink {
  platform: "youtube" | "linkedin" | "facebook" | "tiktok";
  url: string;
}

interface TeamMemberProps {
  name: string;
  role?: string;
  imageUrl: string;
  imagePosition?: string;
  imageTransform?: string;
  socialLinks?: SocialLink[];
}

const SocialIcon = ({ platform }: { platform: SocialLink["platform"] }) => {
  switch (platform) {
    case "linkedin":
      return <Linkedin size={20} />;
    case "facebook":
      return <Facebook size={20} />;
    case "youtube":
      return <Youtube size={20} />;
    case "tiktok":
      return <TikTok size={20} />;
    default:
      return null;
  }
};

export function ExecutiveMember({
  name,
  role,
  imageUrl,
  imagePosition,
  imageTransform,
  socialLinks = [],
}: TeamMemberProps) {
  return (
    <div>
      <div className="mx-auto size-32 overflow-hidden rounded-full">
        <img
          className="size-full object-cover"
          style={{
            objectPosition: imagePosition,
            transform: imageTransform,
          }}
          src={imageUrl}
          alt={`${name}`}
          loading="lazy"
        />
      </div>
      <h3 className="text-base-content mt-6 text-sm/7 font-semibold tracking-tight">
        {name}
      </h3>
      {role && <p className="text-xs/6 text-gray-400">{role}</p>}
      {socialLinks.length > 0 && (
        <ul className="mt-6 flex justify-center gap-x-6">
          {socialLinks.map((link) => (
            <li key={link.platform}>
              <a
                href={link.url}
                className="text-base-content/60 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}`}
              >
                <span className="sr-only">
                  {link.platform.charAt(0).toUpperCase() +
                    link.platform.slice(1)}
                </span>
                <SocialIcon platform={link.platform} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BoardMember({
  name,
  role,
  imageUrl,
  imagePosition,
  imageTransform,
  socialLinks = [],
}: TeamMemberProps) {
  return (
    <div>
      <div className="mx-auto size-60 overflow-hidden rounded-full">
        <img
          className="size-full object-cover"
          style={{
            objectPosition: imagePosition,
            transform: imageTransform,
          }}
          src={imageUrl}
          alt={`${name}`}
          loading="lazy"
        />
      </div>
      <h3 className="text-base-content mt-6 text-base/7 font-semibold tracking-tight">
        {name}
      </h3>
      {role && <p className="text-base-content/60 text-sm/6">{role}</p>}
      {socialLinks.length > 0 && (
        <ul className="mt-6 flex justify-center gap-x-6">
          {socialLinks.map((link) => (
            <li key={link.platform}>
              <a
                href={link.url}
                className="text-base-content/60 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}`}
              >
                <span className="sr-only">
                  {link.platform.charAt(0).toUpperCase() +
                    link.platform.slice(1)}
                </span>
                <SocialIcon platform={link.platform} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
