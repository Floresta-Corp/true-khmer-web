import { ChevronDown, Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Header() {
  return (
    <section className="flex min-h-[500px] w-full items-center justify-center bg-quadrant-glow px-6 py-16">
      <div className="flex w-full max-w-[1440px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-center text-[38px] font-semibold capitalize leading-[42px] tracking-[-1.05px] text-[#174fb4] md:text-[42px]">
            Hearts &amp; Hands
          </h1>
          <p className="w-full max-w-[585px] px-1 text-center text-base font-medium leading-6 text-[#65758b]">
            We connect volunteers to causes that uplift Cambodian communities.
          </p>
        </div>

        <div className="flex w-full max-w-[784px] flex-col gap-5">
          <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-[21px]">
            <div className="flex h-[65px] flex-1 items-center gap-3.5 rounded-xl border border-[#f3f4f6] bg-white px-[11.5px] py-px">
              <div className="flex h-[42px] flex-1 items-center gap-[10.5px] px-[14px]">
                <Search className="size-[17.5px] shrink-0 text-[#99a1af]" />
                <Input
                  type="search"
                  placeholder="Search by name or  mission...."
                  className="h-[42px] border-0 bg-transparent px-0 py-0 text-sm font-semibold text-[#364153] placeholder:font-semibold placeholder:text-[#99a1af] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="h-[35px] w-px shrink-0 bg-[#f3f4f6]" />
              <div className="relative shrink-0 rounded-xl">
                <select
                  defaultValue="anywhere"
                  aria-label="Location"
                  className="h-[34px] appearance-none rounded-xl px-[14px] pr-8 text-[13px] font-semibold leading-[19.5px] text-[#364153] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="anywhere">Anywhere</option>
                  <option value="phnom-penh">Phnom Penh</option>
                  <option value="siem-reap">Siem Reap</option>
                  <option value="battambang">Battambang</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#364153]/65" />
              </div>
            </div>

            <Button
              size="lg"
              className="h-14 min-w-[191px] gap-1.5 rounded-lg bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]"
            >
              <Plus className="size-4" />
              Post opportunity
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
