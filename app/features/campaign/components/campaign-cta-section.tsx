import { CircleArrowRight } from "lucide-react";
import BigFlower from "~/components/icons/bigFlower";
import FullFlower from "~/components/icons/fullFlower";
import { CampaignLinkButton } from "./campaign-link-button";

export function CampaignCtaSection() {
  return (
    <section className="site-container pb-20 lg:pb-24">
      <div className="relative isolate overflow-hidden rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-16 text-center sm:px-16 sm:py-20">
        <div className="pointer-events-none absolute -top-24 -left-6 -z-10 text-[#1c5dd4]">
          <BigFlower width={178} height={306} />
        </div>
        <div className="pointer-events-none absolute -right-20 -bottom-24 -z-10 rotate-70 text-[#1c5dd4]">
          <FullFlower width={282} height={288} />
        </div>

        <p className="text-sm font-semibold text-[#2f6fe4]">Get Involved</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#333333] sm:text-[36px]">
          Join The Campaign
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#606060]">
          Khmer for Khmer, together, taking an active role in shaping our
          Kingdom's future by rebuilding trust in local capacity and supporting
          Khmer products, services, and initiatives.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CampaignLinkButton to="/registration/partner-registration">
            Join the Campaign
            <CircleArrowRight />
          </CampaignLinkButton>
          <CampaignLinkButton to="/register" variant="outline">
            Join as a Member
          </CampaignLinkButton>
        </div>
      </div>
    </section>
  );
}
