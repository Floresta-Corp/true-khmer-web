import { Link } from "react-router";
import type { PublicPartner } from "~/types/api-client";
import { PartnerSocialLinks } from "./partner-social-links";

export type PartnerCardVariant = 1 | 2 | 3 | 4 | 5;

const CARD_CLASSES: Record<PartnerCardVariant, string> = {
  1: "flex w-full max-w-sm flex-col items-center justify-center rounded-xl border-2 border-blue-600/20 bg-card shadow-lg transition duration-300 hover:scale-105 hover:border-blue-600 hover:shadow-xl sm:max-w-md md:h-[404px] md:max-w-[400px]",
  2: "flex w-full max-w-[220px] flex-col items-center justify-center rounded-xl border-2 border-blue-600/20 bg-card shadow-lg transition duration-300 hover:border-blue-600 hover:shadow-xl sm:max-w-[240px] md:h-[280px] md:max-w-[260px]",
  3: "flex w-full max-w-[180px] flex-col items-center justify-center rounded-xl border-2 border-blue-600/20 bg-card shadow-lg transition duration-300 hover:border-blue-600 hover:shadow-xl sm:max-w-[200px] md:h-[260px] md:max-w-[220px]",
  4: "flex h-20 w-full max-w-[100px] items-center justify-center rounded-xl bg-card sm:h-24 sm:max-w-[120px]",
  5: "flex h-20 w-full max-w-[100px] items-center justify-center rounded-xl bg-card sm:h-24 sm:max-w-[120px]",
};

const FIGURE_CLASSES: Record<PartnerCardVariant, string> = {
  1: "flex h-48 w-full items-center justify-center p-4 md:h-64",
  2: "flex h-32 w-full items-center justify-center p-2 md:h-40",
  3: "flex h-24 w-full items-center justify-center p-2 md:h-32",
  4: "flex size-full items-center justify-center p-1 sm:p-2 md:p-3",
  5: "flex size-full items-center justify-center p-1 sm:p-2 md:p-3",
};

const BODY_CLASSES: Record<PartnerCardVariant, string> = {
  1: "flex w-full flex-col items-center p-4 text-center md:p-6",
  2: "flex w-full flex-col items-center p-2 text-center md:p-4",
  3: "flex w-full flex-col items-center p-2 text-center md:p-3",
  4: "",
  5: "",
};

interface PartnerCardProps {
  partner: PublicPartner;
  variant: PartnerCardVariant;
}

function PartnerLogo({
  logo,
  name,
  variant,
}: {
  logo: string | null;
  name: string;
  variant: PartnerCardVariant;
}) {
  return (
    <div className={FIGURE_CLASSES[variant]}>
      {logo ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      ) : (
        <div className="flex size-full items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
          No logo
        </div>
      )}
    </div>
  );
}

export function PartnerCard({ partner, variant }: PartnerCardProps) {
  const name = partner.name || "";
  const sectorActivity = partner.sectorActivity || "";
  const bio = partner.bio || "No bio available";

  if (variant === 4 || variant === 5) {
    return (
      <div className={CARD_CLASSES[variant]} title={name}>
        <PartnerLogo logo={partner.logo} name={name} variant={variant} />
      </div>
    );
  }

  const body = (
    <div className={BODY_CLASSES[variant]}>
      <h3 className="text-center text-base font-bold text-card-foreground md:text-xl">
        {name}
      </h3>
      <p className="text-center text-xs text-muted-foreground">
        {sectorActivity}
      </p>
      {variant === 1 ? (
        <p className="mt-2 line-clamp-3 p-2 text-center text-sm font-normal text-muted-foreground">
          {bio}
        </p>
      ) : (
        <PartnerSocialLinks
          website={partner.website}
          facebook={partner.facebook}
          linkedin={partner.linkedin}
          telegram={partner.telegram}
          name={name}
        />
      )}
    </div>
  );

  // Only Platinum/Gold (variant 1) partners have a public detail page.
  if (variant === 1) {
    return (
      <Link
        to={`/community/partner/${partner.id}`}
        className={CARD_CLASSES[variant]}
      >
        <PartnerLogo logo={partner.logo} name={name} variant={variant} />
        {body}
      </Link>
    );
  }

  return (
    <div className={CARD_CLASSES[variant]}>
      <PartnerLogo logo={partner.logo} name={name} variant={variant} />
      {body}
    </div>
  );
}
