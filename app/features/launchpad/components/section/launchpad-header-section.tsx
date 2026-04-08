import { Link } from "react-router";
import HeaderSearch from "~/components/header-search";
import { Button } from "~/components/ui/button";

export default function LaunchpadHeaderSection() {
  return (
    <section className="flex h-125 flex-col items-center justify-center px-6 md:px-12 lg:px-[131.5px] bg-linear-to-r from-sky-100 to-white">
      <div className="mb-8 text-center">
        <h1 className="text-[#174FB4] text-[42px] font-semibold leading-12 tracking-[-1.05px]">
          Where Idea Take Off
        </h1>
        <p className="mx-auto mt-2 max-w-146.75 text-sm font-medium leading-6 text-[#65758b]">
          Connect with founders, explore the next generation of Khmer impact,
          and find co-operation opportunities.
        </p>
      </div>

      <div className="flex w-full max-w-196 flex-col gap-5">
        <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-5.25">
          <HeaderSearch
            postButton="Post project"
            postUrl="/launchpad/post"
            inputPlaceholder="Search project by name..."
          />
        </div>
      </div>
    </section>
  );
}
