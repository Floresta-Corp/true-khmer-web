import { CheckList } from "./icons/check-list";
import { TeamIcon } from "./icons/team-icon";
import { VerifiedBadge } from "./icons/verified-badge";
import BigFlower from "~/components/icons/bigFlower";
import FullFlower from "~/components/icons/fullFlower";

export function CommunityInfoSection() {
  return (
    <div className="relative">
      {/* Background Flower Decoration */}
      <div className="pointer-events-none absolute top-full left-0 -z-10 hidden -translate-y-full text-blue-600 lg:block">
        <div className="flex items-end -space-x-12">
          <div className="translate-y-35 transform">
            <BigFlower width={492} height={478} />
          </div>
          <div className="-translate-y-20 transform">
            <FullFlower width={162} height={158} />
          </div>
          <div className="-translate-y-2 translate-x-20 transform">
            <FullFlower />
          </div>
        </div>
      </div>

      {/* 3 Grid Card */}
      <div className="mx-auto mt-10 mb-20 max-w-7xl px-4 sm:mb-10 sm:px-6">
        <div className="relative mx-auto grid grid-cols-1 items-stretch gap-4 rounded-2xl bg-slate-100 px-4 py-4 shadow-2xl backdrop-blur-md sm:px-6 sm:py-6 md:gap-3 md:px-10 xl:grid-cols-3 dark:bg-slate-800/60">
          {/* First Card */}
          <div className="flex h-full flex-col p-4 sm:flex-row sm:p-6">
            <div className="mx-auto mb-3 block w-16 shrink-0 sm:mx-0 sm:mr-4 sm:mb-0 sm:w-20">
              <div className="icon-container-shadow flex size-16 items-center justify-center rounded-full bg-blue-600/90 sm:size-20">
                <TeamIcon size={35} className="text-white sm:hidden" />
                <TeamIcon size={45} className="hidden text-white sm:block" />
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-start text-left">
              <h2 className="mb-2 text-lg font-bold text-[#243d95] sm:text-xl dark:text-white">
                What?
              </h2>
              <p className="text-xs leading-relaxed text-[#243d95] sm:text-sm dark:text-slate-300">
                A community that believes in the capacity of the Cambodian
                people to excel, that understands that &quot;we are
                enough&quot;, and that the time for Cambodia is now. A
                community of leaders who share the vision and are committed to
                the mission, ready to act today for a better tomorrow.
              </p>
            </div>
          </div>

          {/* First Vertical Divider */}
          <div className="absolute top-1/2 left-1/3 hidden h-3/4 -translate-y-1/2 transform xl:block">
            <div className="h-full w-px bg-gradient-to-t from-transparent via-blue-600 to-transparent opacity-60" />
          </div>

          {/* Second Card */}
          <div className="flex h-full flex-col p-4 sm:flex-row sm:p-6">
            <div className="mx-auto mb-3 block w-16 shrink-0 sm:mx-0 sm:mr-4 sm:mb-0 sm:w-20">
              <div className="icon-container-shadow flex size-16 items-center justify-center rounded-full bg-blue-600/90 sm:size-20">
                <CheckList size={35} className="text-white sm:hidden" />
                <CheckList size={45} className="hidden text-white sm:block" />
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-start text-left">
              <h2 className="mb-2 text-lg font-bold text-[#243d95] sm:text-xl dark:text-white">
                Why?
              </h2>
              <p className="text-xs leading-relaxed text-[#243d95] sm:text-sm dark:text-slate-300">
                Because our nation&apos;s future is in our hands, and it is
                time we restore our trust in our products and services,
                embrace who we truly are, and empower every Cambodian to take
                responsibility and act to shape the future and sustainable
                development of our Kingdom.
              </p>
            </div>
          </div>

          {/* Second Vertical Divider */}
          <div className="absolute top-1/2 left-2/3 hidden h-3/4 -translate-y-1/2 transform xl:block">
            <div className="h-full w-px bg-gradient-to-t from-transparent via-blue-600 to-transparent opacity-60" />
          </div>

          {/* Third Card */}
          <div className="flex h-full flex-col p-4 sm:flex-row sm:p-6">
            <div className="mx-auto mb-3 block w-16 shrink-0 sm:mx-0 sm:mr-4 sm:mb-0 sm:w-20">
              <div className="icon-container-shadow flex size-16 items-center justify-center rounded-full bg-blue-600/90 sm:size-20">
                <VerifiedBadge size={35} className="text-white sm:hidden" />
                <VerifiedBadge
                  size={45}
                  className="hidden text-white sm:block"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-start text-left">
              <h2 className="mb-2 text-lg font-bold text-[#243d95] sm:text-xl dark:text-white">
                How?
              </h2>
              <p className="text-xs leading-relaxed text-[#243d95] sm:text-sm dark:text-slate-300">
                By providing a network of mutual support, a community
                committed to the same goal, willing to actively support one
                another and enhance Cambodia&apos;s economy, build trust in
                our products and services, and lead by example to empower our
                fellow Cambodians to join our movement and act for the better
                of our nation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
