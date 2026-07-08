import BigFlower from "../../../../public/icons/bigFlower";
import FullFlower from "../../../../public/icons/fullFlower";
import WaveBackground from "../../../../public/icons/waveBg";

const visualElementBase =
  "w-24 h-40 sm:w-28 sm:h-44 md:w-32 md:h-48 lg:w-36 lg:h-44 shadow-lg drop-shadow-2xl rounded-full hover:scale-105 transition-transform duration-300 ease-in-out";
const imageContainerClasses = `${visualElementBase} overflow-hidden`;
const shapeClasses = visualElementBase;
const imageClasses = "w-full h-full object-cover";

export function HeroSection() {
  return (
    <div className="relative overflow-visible pb-12">
      <div className="pointer-events-none absolute top-1/2 left-0 z-0 hidden -translate-y-1/4 text-primary md:block">
        <div className="flex items-end -space-x-12">
          <div className="-translate-x-2 translate-y-1/4 transform">
            <BigFlower width={492} height={478} className="text-[#1c97d4]" />
          </div>
          <div className="-translate-x-1/12 -translate-y-11/12 transform">
            <FullFlower width={162} height={158} className="text-[#1c97d4]" />
          </div>
          <div className="-translate-x-1/12 -translate-y-1/12 transform">
            <FullFlower className="text-[#1c97d4]" />
          </div>
        </div>
      </div>

      <div className="dark:text-base-content/90 pointer-events-none absolute inset-y-0 right-0 z-0 hidden text-primary xl:block">
        <WaveBackground />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-0">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <div className="relative order-2 flex justify-center lg:order-1">
            <div className="max-w-lg p-4 text-left sm:p-8 md:p-12 lg:p-16 xl:p-18 xl:pr-0">
              <div className="mb-4 text-xl text-[#1c97d4] italic sm:mb-6 sm:text-2xl lg:text-3xl">
                True Khmer
              </div>
              <h1 className="mb-4 text-3xl text-[#243d95] sm:mb-6 sm:text-4xl lg:text-5xl">
                Khmer to Khmer initiative for the future of Cambodia
              </h1>
              <p className="sm:text-md text-sm text-gray-400">
                Our ambitious development goals require tight collaboration and
                unity between all the stakeholders of our economy. True Khmer is
                designed to achieve just that, unite, empower, and skill our
                people, lead to regained trust in our products and services, and
                engage across the board to support our youth in innovation and
                technology, thus leading to growth for the future of our
                Cambodia.
              </p>
            </div>
          </div>

          <div className="relative order-1 flex justify-center p-4 sm:p-6 lg:order-2 lg:p-8 xl:pl-0">
            <div className="grid max-w-lg grid-cols-3 gap-4 sm:max-w-2xl sm:gap-5 lg:max-w-4xl lg:gap-6 xl:items-start">
              <div className="mt-2 flex flex-col gap-4 sm:mt-3 sm:gap-5 md:mt-4 lg:mt-6 lg:gap-4 xl:mt-8">
                <div
                  className={`${shapeClasses} bg-linear-to-br from-blue-400 to-blue-600 xl:h-[264.1704px] xl:w-[153.8857px]`}
                ></div>
                <div
                  className={`${imageContainerClasses} xl:h-[331.4953px] xl:w-[154.5268px]`}
                >
                  <img
                    src="/images/about/bottomleft.jpg"
                    alt="Team Member 2"
                    className={imageClasses}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:gap-5 md:mt-8 lg:mt-12 lg:gap-4 xl:mt-16">
                <div
                  className={`${imageContainerClasses} xl:h-[367.402px] xl:w-[155.168px]`}
                >
                  <img
                    src="/images/about/mid1.jpg"
                    alt="Team Member 3"
                    className={imageClasses}
                    loading="lazy"
                  />
                </div>
                <div
                  className={`${imageContainerClasses} group xl:h-[264.1704px] xl:w-[155.168px]`}
                >
                  <img
                    src="/images/about/midbottom.jpg"
                    alt="Team Member 4"
                    className={imageClasses}
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="mt-0 flex flex-col gap-4 sm:gap-5 lg:gap-4">
                <div
                  className={`${imageContainerClasses} xl:h-[367.402px] xl:w-[154.5268px]`}
                >
                  <img
                    src="/images/about/right1.jpg"
                    alt="Team Member 5"
                    className={imageClasses}
                    loading="lazy"
                  />
                </div>

                <div
                  className={`${shapeClasses} bg-linear-to-tr from-[#1c97d4] to-[#1c97d4]/70 xl:h-[264.1704px] xl:w-[155.168px]`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
