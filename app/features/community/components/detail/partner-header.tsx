import { ImageOff } from "lucide-react";
import { useState } from "react";
import { PartnerTierBadge } from "../partner-tier-badge";

interface PartnerHeaderProps {
  logo?: string | null;
  name: string;
  bio?: string | null;
  tier?: string | null;
  onLogoClick?: () => void;
}

export function PartnerHeader({
  logo,
  name,
  bio,
  tier,
  onLogoClick,
}: PartnerHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onLogoClick?.();
    }
  };

  return (
    <header className="z-10 grid grid-cols-1 items-center gap-6 rounded-2xl border border-border bg-card py-6 md:gap-8 md:py-9 lg:grid-cols-2">
      <div className="order-1 flex items-center justify-center overflow-hidden px-4 md:px-6">
        {logo && !imageError ? (
          <button
            type="button"
            onClick={onLogoClick}
            onKeyDown={handleKeyDown}
            aria-label={`View ${name} logo in lightbox`}
            className="group relative mx-auto flex h-48 w-full max-w-xs cursor-pointer items-center justify-center rounded-2xl sm:h-56 sm:max-w-sm md:h-72 md:w-80"
          >
            <img
              src={logo}
              alt={`${name} logo`}
              className="h-auto max-h-56 w-auto max-w-56 rounded-2xl object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-80 sm:max-w-80"
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
          </button>
        ) : (
          <div className="mx-auto flex h-48 w-full max-w-xs items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted sm:h-56 sm:max-w-sm md:h-72 md:w-80">
            <div className="p-4 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted-foreground/10">
                <ImageOff size={32} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No logo available</p>
            </div>
          </div>
        )}
      </div>

      <div className="order-2 flex flex-col justify-center space-y-4 px-4 text-center sm:space-y-5 md:space-y-6 md:px-6 lg:text-left">
        <div className="flex flex-wrap justify-center lg:justify-start">
          <PartnerTierBadge tier={tier ?? "None"} className="text-sm md:text-base" />
        </div>

        <h1 className="text-2xl leading-tight font-bold text-card-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          {name}
        </h1>

        {bio && (
          <p className="mx-auto max-w-full text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl lg:mx-0 lg:max-w-3xl">
            {bio}
          </p>
        )}
      </div>
    </header>
  );
}
