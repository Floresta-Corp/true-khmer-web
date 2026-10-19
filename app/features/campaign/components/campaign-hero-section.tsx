import { CircleArrowRight } from "lucide-react";
import BigFlower from "~/components/icons/bigFlower";
import FullFlower from "~/components/icons/fullFlower";
import WaveBackground from "~/components/icons/waveBg";
import { Badge } from "~/components/ui/badge";
import { CampaignLinkButton } from "./campaign-link-button";

const heroImage = "/images/campaign/CampaignsBG.webp";

export function CampaignHeroSection() {
  return (
    <section className="relative overflow-hidden lg:min-h-180">
      <div className="pointer-events-none absolute top-1/2 left-0 hidden -translate-y-1/4 text-[#1c5dd4] md:block">
        <div className="flex items-end -space-x-12">
          <div className="-translate-x-32 translate-y-1/4">
            <BigFlower width={492} height={478} />
          </div>
          <div className="-translate-x-1/2 translate-y-20">
            <FullFlower width={162} height={158} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden text-[#1c5dd4] xl:block">
        <WaveBackground />
      </div>

      <img
        src={heroImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 hidden h-140 w-auto -translate-y-1/2 object-contain lg:block xl:h-160"
      />

      <div className="relative site-container flex flex-col items-center gap-10 py-12 lg:min-h-180 lg:flex-row lg:py-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="ml-auto w-3/4 max-w-sm object-contain lg:hidden"
          loading="lazy"
        />

        <div className="flex w-full flex-col items-center text-center lg:max-w-2xl lg:items-start lg:text-left">
          <Badge className="rounded-full bg-[#1c5dd4] px-3 py-1 text-sm font-medium text-white hover:bg-[#1c5dd4]">
            Campaign
          </Badge>
          <h1 className="mt-6 text-[36px] leading-[1.15] font-medium tracking-[-0.04em] text-[#333333] sm:text-5xl lg:text-[60px] lg:leading-18">
            A Khmer to Khmer Communication Campaign
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#606060] sm:text-lg">
            Creating essential dialogues around subjects that matter, carried by
            our partners and members across the Kingdom.
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <CampaignLinkButton to="/registration/partner-registration">
              Join as a Partner
              <CircleArrowRight />
            </CampaignLinkButton>
            <CampaignLinkButton to="/register" variant="outline">
              Join as a Member
            </CampaignLinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
