import { cn } from "~/lib/utils";
import LogoMark from "~/components/icons/logoMark";

type OnboardingRomdoulCornersProps = {
  topLeftClassName?: string;
  bottomRightClassName?: string;
  topLeftGlowClassName?: string;
  bottomRightGlowClassName?: string;
  showGlow?: boolean;
};

const DEFAULT_TOP_LEFT_CLASS =
  "pointer-events-none absolute -left-8 top-[30px] h-[220px] w-[226px] opacity-45 sm:h-[240px] sm:w-[246px] md:h-[250px] md:w-[256px] xl:-left-[4.9vw] xl:top-[2vh] xl:h-auto xl:w-[18.5vw] xl:min-w-[226px] xl:max-w-[266px]";

const DEFAULT_BOTTOM_RIGHT_CLASS =
  "pointer-events-none absolute -bottom-8 -right-8 h-[220px] w-[226px] opacity-45 sm:h-[240px] sm:w-[246px] md:h-[250px] md:w-[256px] xl:bottom-[14.7vh] xl:right-[5.8vw] xl:h-auto xl:w-[18.5vw] xl:min-w-[226px] xl:max-w-[266px]";

const DEFAULT_TOP_LEFT_GLOW_CLASS =
  "pointer-events-none absolute left-[clamp(-70px,-4.86vw,-20px)] top-[clamp(72px,12.21vh,125px)] h-[clamp(220px,22.22vw,320px)] w-[clamp(220px,22.22vw,320px)] rounded-full bg-blue-100/50 blur-3xl";

const DEFAULT_BOTTOM_RIGHT_GLOW_CLASS =
  "pointer-events-none absolute right-[clamp(-208px,-14.44vw,-24px)] top-[clamp(240px,35.84vh,367px)] h-[clamp(300px,31.6vw,455px)] w-[clamp(300px,31.6vw,455px)] rounded-full bg-blue-100/50 blur-3xl";

export function OnboardingRomdoulCorners({
  topLeftClassName,
  bottomRightClassName,
  topLeftGlowClassName,
  bottomRightGlowClassName,
  showGlow = true,
}: OnboardingRomdoulCornersProps) {
  return (
    <>
      {showGlow ? (
        <div className={cn(DEFAULT_TOP_LEFT_GLOW_CLASS, topLeftGlowClassName)} />
      ) : null}
      <LogoMark
        width={256}
        height={256}
        aria-hidden="true"
        className={cn(DEFAULT_TOP_LEFT_CLASS, topLeftClassName)}
      />
      {showGlow ? (
        <div
          className={cn(DEFAULT_BOTTOM_RIGHT_GLOW_CLASS, bottomRightGlowClassName)}
        />
      ) : null}
      <LogoMark
        width={256}
        height={256}
        aria-hidden="true"
        className={cn(DEFAULT_BOTTOM_RIGHT_CLASS, bottomRightClassName)}
      />
    </>
  );
}
