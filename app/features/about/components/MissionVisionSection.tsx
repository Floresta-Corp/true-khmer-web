export function MissionVisionSection() {
  return (
    <div className="bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Mission */}
          <div className="flex flex-col space-y-4 text-left sm:space-y-6">
            <h3 className="text-sm font-semibold tracking-wide text-[#1c97d4] uppercase sm:text-base">
              Our Mission
            </h3>
            <h2 className="text-xl leading-tight font-bold text-[#243d95] sm:text-2xl">
              It&apos;s time for us to believe in our people&apos;s capacity to
              shape a better tomorrow.
            </h2>
            <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
              The True Khmer Community aims to show the way and rebuild public
              trust in the Cambodian capacity to excel and provide quality
              products, services, and initiatives. It also aims to allow us to
              embrace who we truly are, and empower every Cambodian to take
              concrete action and play an active role in shaping the future and
              sustainable development of our Kingdom.
            </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col space-y-4 text-left sm:space-y-6">
            <h3 className="text-sm font-semibold tracking-wide text-[#1c97d4] uppercase sm:text-base">
              Our Vision
            </h3>
            <h2 className="text-xl leading-tight font-bold text-[#243d95] sm:text-2xl">
              A united and strong community shining Cambodia&apos;s success on a
              global stage
            </h2>
            <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
              Our vision is a united and empowered Cambodia where people proudly
              support local excellence, celebrate their heritage and drive
              innovation that reflects their creativity, their resolve, and the
              beauty of their Khmer spirit. We envision a nation standing
              proudly and confidently on the global stage, able to offer
              solutions to global needs and pave the way to prosperity and
              peace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
