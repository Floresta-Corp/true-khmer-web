import { Link } from "react-router";

type OnboardingHeaderProps = {
  title: string;
  rightText?: string;
  rightTo?: string;
  titlePosition?: "center" | "right";
};

export function OnboardingHeader({
  title,
  rightText,
  rightTo,
  titlePosition = "center",
}: OnboardingHeaderProps) {
  const renderRight = () => {
    if (titlePosition === "right") {
      return <span className="text-base font-medium leading-7 text-[#737373]">{title}</span>;
    }

    if (rightText) {
      if (rightTo) {
        return (
          <Link to={rightTo} className="text-base font-normal leading-6 text-[#9BA9BF]">
            {rightText}
          </Link>
        );
      }

      return <span className="text-base font-normal leading-6 text-[#9BA9BF]">{rightText}</span>;
    }

    return <span className="w-28" aria-hidden="true" />;
  };

  return (
    <header className="w-full border-b border-[#DDE3ED] bg-white">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 lg:px-0">
        <img
          src="/logofullcolor.svg"
          alt="True Khmer"
          className="h-7 w-auto object-contain sm:h-8"
        />

        {titlePosition === "center" ? (
          <p className="absolute left-1/2 -translate-x-1/2 text-lg font-medium leading-7 text-[#737373]">
            {title}
          </p>
        ) : (
          <span className="w-28" aria-hidden="true" />
        )}

        {renderRight()}
      </div>
    </header>
  );
}
