import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CircleArrowRight } from "./icons/circle-arrow-right";

const PARTNER_BENEFITS = [
  "Visibility as part of the People of Cambodia campaign",
  "Enhanced visibility across True Khmer channels",
  "Physical certificate and official recognition for display",
  "Regular access to exclusive news, information, and updates",
  "Privileged access to special events and True Khmer merchandise",
  "Co-branding opportunities with True Khmer",
  "VIP invitation to the True Khmer exclusive gala event.",
];

function PartnerGuideContent({ ctaSize }: { ctaSize: "default" | "lg" }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4 text-lg font-bold text-[#243d95] sm:text-xl md:mb-6 md:text-2xl lg:text-3xl dark:text-white">
        As a Partner, you will:
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-foreground/70 sm:text-base md:mb-12 lg:text-lg">
        directly contribute to the movement, providing essential support to
        fuel True Khmer&apos;s nationwide impact. You will join a group of
        resolved Khmer leaders that allow the movement to prevail by
        providing the necessary financial contribution. As a partner you
        will also enjoy attractive benefits including (according to your
        partnership plan):
      </p>

      <div className="space-y-6 md:space-y-10">
        <div>
          <h3 className="mb-3 text-base font-semibold text-[#243d95] sm:text-lg md:mb-4 md:text-xl dark:text-white">
            True Khmer partners will enjoy several advantages
          </h3>
          <ul className="space-y-2 text-sm text-foreground/70 sm:text-base">
            {PARTNER_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start">
                <span className="mr-2 font-bold text-blue-600">•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold text-[#243d95] sm:text-lg md:mb-4 md:text-xl dark:text-white">
            Ok, I want in, what&apos;s next?
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-foreground/70 sm:text-base md:mb-6">
            To be part of the True Khmer initiative, and/or get further
            information, please press the &quot;Join as a Partner&quot;
            button, fill in the required info, and our team will reach out
            to you to proceed with your admission.
          </p>
        </div>

        <div className={ctaSize === "lg" ? "flex justify-center md:justify-end" : ""}>
          <Button
            asChild
            size={ctaSize}
            className={`gap-2 bg-blue-600 text-white hover:bg-blue-700 ${
              ctaSize === "lg" ? "w-full md:w-auto" : "w-full"
            }`}
          >
            <Link
              to="/registration/partner-registration"
              title="Join as Partner"
              aria-label="Join as Partner"
            >
              Join as Partner
              <CircleArrowRight size={ctaSize === "lg" ? 20 : 18} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HowToJoinSection() {
  return (
    <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl text-[#243d95] sm:text-5xl dark:text-white">
          How To Join
        </h1>
        <p className="mx-auto text-sm leading-relaxed text-[#243d95] sm:max-w-4xl sm:text-xl dark:text-slate-300">
          Joining the True Khmer initiative is an easy and straight forward
          process, first you have to choose your level of involvement, you
          can join as a Partner.
        </p>
      </div>

      {/* Mobile/Tablet Tabs (md and below) */}
      <div className="overflow-hidden rounded-3xl bg-card shadow-2xl shadow-blue-600/50 md:hidden">
        <Tabs defaultValue="partner">
          <TabsList
            variant="line"
            className="h-auto w-full justify-start rounded-none bg-muted/40 px-2 pt-2"
          >
            <TabsTrigger
              value="partner"
              className="rounded-none border-b-2 border-b-blue-600 py-3 font-semibold text-blue-600 data-active:border-b-blue-600 data-active:bg-transparent data-active:text-blue-600 data-active:shadow-none"
            >
              Join as Partner
            </TabsTrigger>
          </TabsList>
          <TabsContent value="partner" className="min-h-[400px] p-4 sm:p-6">
            <PartnerGuideContent ctaSize="default" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Sidebar Layout (md and above) */}
      <div className="hidden overflow-hidden rounded-3xl bg-card shadow-2xl shadow-blue-600/50 md:block">
        <div className="flex min-h-[500px]">
          {/* Left Sidebar Navigation */}
          <div className="flex w-80 flex-col p-6 xl:pl-10">
            <div className="space-y-4">
              <div className="relative rounded-lg px-6 py-4 text-left text-base font-semibold text-[#243d95] sm:text-lg md:text-xl lg:text-3xl xl:text-4xl dark:text-white">
                Join as a Partner
                <div className="absolute top-1/2 left-0 h-3/4 w-1 -translate-y-1/2 rounded-r bg-blue-600" />
              </div>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="my-6 w-px bg-border" />
          <div className="flex-1 p-6 md:p-8 lg:p-10">
            <PartnerGuideContent ctaSize="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
