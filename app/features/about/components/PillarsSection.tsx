import { pillars } from "../lib/pillars";
import PillarsCarousel from "./PillarsCarousel";

export function PillarsSection() {
  return (
    <div className="bg-base-100 py-20">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-[#243d95] sm:text-5xl">
          Four Pillars of Action
        </h2>
        <p className="text-base-content/60 mt-6 text-lg">
          To achieve that objective we have defined four pillars of action that
          will be conducted throughout the year:
        </p>
      </div>
      {/* Pillars Carousel */}
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <PillarsCarousel pillars={pillars} />
      </div>
    </div>
  );
}
