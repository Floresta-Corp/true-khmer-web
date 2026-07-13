import { Facebook, Linkedin, Youtube } from "lucide-react";
import TikTok from "~/components/icons/tiktok";
import type { Member, SocialLink } from "../types";

// Variant-specific styling; the layout is otherwise identical across roles.
const variantStyles = {
  executive: {
    avatar: "size-32",
    name: "text-sm/7",
    role: "text-xs/6 text-gray-400",
  },
  board: {
    avatar: "size-60",
    name: "text-base/7",
    role: "text-base-content/60 text-sm/6",
  },
} as const;

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

function TeamMember({
  name,
  role,
  imageUrl,
  imagePosition,
  imageTransform,
  socialLinks = [],
  variant,
}: Member & { variant: keyof typeof variantStyles }) {
  const styles = variantStyles[variant];
  return (
    <div>
      <div className={`mx-auto ${styles.avatar} overflow-hidden rounded-full`}>
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
      <h3
        className={`text-base-content mt-6 ${styles.name} font-semibold tracking-tight`}
      >
        {name}
      </h3>
      {role && <p className={styles.role}>{role}</p>}
      {socialLinks.length > 0 && (
        <ul className="mt-6 flex justify-center gap-x-6">
          {socialLinks.map((link) => {
            const platformLabel =
              link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
            return (
              <li key={link.platform}>
                <a
                  href={link.url}
                  className="text-base-content/60 hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on ${platformLabel}`}
                >
                  <span className="sr-only">{platformLabel}</span>
                  <SocialIcon platform={link.platform} />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ExecutiveMember(props: Member) {
  return <TeamMember {...props} variant="executive" />;
}

export function BoardMember(props: Member) {
  return <TeamMember {...props} variant="board" />;
}
