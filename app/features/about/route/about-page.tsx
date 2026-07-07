import clsx from "clsx";
import type { Route } from "../../../+types/root";
import UserChange from "../../../../public/icons/userChange";
import RefugeeIcon from "../../../../public/icons/refugee";
import Certificate from "../../../../public/icons/certificate";
import TrophyStar from "../../../../public/icons/trophyStar";
import BigFlower from "../../../../public/icons/bigFlower";
import FullFlower from "../../../../public/icons/fullFlower";
import WaveBackground from "../../../../public/icons/waveBg";
import { BoardMember, ExecutiveMember } from "../components/teamMembers";
import { ambassadors, boardMembers, executiveMembers } from "../types/members";
import PillarsCarousel from "../components/PillarsCarousel";
// import {
//   BoardMember,
//   CallToAction,
//   ExecutiveMember,
//   PillarsCarousel,
// } from "~/components";
// import { boardMembers, executiveMembers, ambassadors } from "~/helpers";
// import {
//   BigFlower,
//   Certificate,
//   FullFlower,
//   RefugeeIcon,
//   TrophyStar,
//   UserChange,
//   WaveBackground,
// } from "~/icons";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "About Us" },
    {
      name: "description",
      content: "Learn more about our mission and values.",
    },
  ];
}

export function headers(_: Route.HeadersArgs) {
  return {
    "Cache-Control": "s-maxage=1800, stale-while-revalidate=7200", // 30min fresh, 2hr stale
  };
}

export default function About() {
  const pillars = [
    {
      id: "1",
      title: "People of Cambodia",
      description:
        "As action originates in inspiration, and inspiration can only result from appropriation, we believe that the first element in our action plan shall be sharing the inspiring stories of Cambodia’s secret (and less secret) role models.",
      imageUrl:
        "https://diwdu0fi8ef70.cloudfront.net/FourPillars/Khmer+role+model.png",
      imageAlt: "Economic empowerment in Cambodia",
    },
    {
      id: "2",
      title: "Thematic Communication Campaigns",
      description:
        "National bi-monthly campaigns sparking public conversation around key themes such as Khmer identity, generational dialogue, and reimagining cultural legacy as a force for growth.",
      imageUrl:
        "https://diwdu0fi8ef70.cloudfront.net/FourPillars/ThematicCampaigns.png",
      imageAlt: "Education and skills development",
    },
    {
      id: "3",
      title: "Community Building",
      description:
        "A growing network of businesses and individuals aligned with True Khmer’s mission and vision and committed to supporting each other's growth. Our partners and members will receive physical and digital badges allowing them to be recognized.",
      imageUrl:
        "https://diwdu0fi8ef70.cloudfront.net/FourPillars/Community+Building.jpg",
      imageAlt: "Cambodian cultural preservation",
    },
    {
      id: "4",
      title: "True Khmer Awards",
      description:
        "A Cambodian award ceremony rewarding those who acted and contributed positively to the development of the country in its journey towards its ambitious goals.",
      imageUrl:
        "https://diwdu0fi8ef70.cloudfront.net/FourPillars/Award+Pillar.png",
      imageAlt: "Community building in Cambodia",
    },
  ];

  const empowermentCards = [
    {
      id: "inspiration",
      icon: UserChange,
      title: "Inspiration",
      subtitle: "Role Models",
    },
    {
      id: "support",
      icon: RefugeeIcon,
      title: "Support",
      subtitle: "Community",
    },
    {
      id: "action",
      icon: Certificate,
      title: "Action",
      subtitle: "Dialogues",
    },
    {
      id: "reward",
      icon: TrophyStar,
      title: "Reward",
      subtitle: "Awards Gala Night",
    },
  ];

  const cardContainerClasses = clsx(
    "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-[155.168px] xl:h-[155.168px]",
    "bg-[#1c97d4]/90 rounded-2xl sm:rounded-3xl lg:rounded-4xl",
    "shadow-lg drop-shadow-2xl icon-container-shadow",
    "flex items-center justify-center",
  );

  const iconClasses = clsx(
    "text-white",
    "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20",
  );

  // Shared classes for performance optimization
  const visualElementBase = clsx(
    "w-24 h-40 sm:w-28 sm:h-44 md:w-32 md:h-48 lg:w-36 lg:h-44",
    "shadow-lg drop-shadow-2xl rounded-full",
    "hover:scale-105 transition-transform duration-300 ease-in-out",
  );
  const imageContainerClasses = `${visualElementBase} overflow-hidden`;
  const shapeClasses = `${visualElementBase}`;
  const imageClasses = "w-full h-full object-cover";

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <div className="relative overflow-visible pb-12">
        {/* Background Flower Decoration */}
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

        {/* Wave Background */}
        <div className="dark:text-base-content/90 pointer-events-none absolute inset-y-0 right-0 z-0 hidden text-primary xl:block">
          <WaveBackground />
        </div>

        {/* Centered Content Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-0">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            {/* Left Section - Text Content */}
            <div className="relative order-2 flex justify-center lg:order-1">
              <div className="max-w-lg p-4 text-left sm:p-8 md:p-12 lg:p-16 xl:p-18 xl:pr-0">
                <div className="mb-4 text-xl text-[#1c97d4] italic sm:mb-6 sm:text-2xl lg:text-3xl">
                  <div>True Khmer</div>
                </div>
                <h1 className="mb-4 text-3xl text-[#243d95] sm:mb-6 sm:text-4xl lg:text-5xl">
                  <div>
                    Khmer to Khmer initiative for the future of Cambodia
                  </div>
                </h1>
                <p className="sm:text-md text-sm text-gray-400">
                  <p>
                    Our ambitious development goals require tight collaboration
                    and unity between all the stakeholders of our economy. True
                    Khmer is designed to achieve just that, unite, empower, and
                    skill our people, lead to regained trust in our products and
                    services, and engage across the board to support our youth
                    in innovation and technology, thus leading to growth for the
                    future of our Cambodia.
                  </p>
                </p>
              </div>
            </div>

            {/* Right Section - Visual Elements */}
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

                {/* Column 2 */}
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

                {/* Column 3 */}
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

      {/* Mission and Vision Section */}
      <div className="bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            {/* Mission */}
            <div className="flex flex-col space-y-4 text-left sm:space-y-6">
              <h3 className="text-sm font-semibold tracking-wide text-[#1c97d4] uppercase sm:text-base">
                <div>Our Mission</div>
              </h3>
              <h2 className="text-xl leading-tight font-bold text-[#243d95] sm:text-2xl">
                <p>
                  It&apos;s time for us to believe in our people&apos;s capacity
                  to shape a better tomorrow.
                </p>
              </h2>
              <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                <p>
                  The True Khmer Community aims to show the way and rebuild
                  public trust in the Cambodian capacity to excel and provide
                  quality products, services, and initiatives. It also aims to
                  allow us to embrace who we truly are, and empower every
                  Cambodian to take concrete action and play an active role in
                  shaping the future and sustainable development of our Kingdom.
                </p>
              </p>
            </div>

            {/* Vision */}
            <div className="flex flex-col space-y-4 text-left sm:space-y-6">
              <h3 className="text-sm font-semibold tracking-wide text-[#1c97d4] uppercase sm:text-base">
                <div>Our Vision</div>
              </h3>
              <h2 className="text-xl leading-tight font-bold text-[#243d95] sm:text-2xl">
                <div>
                  A united and strong community shining Cambodia&apos;s success
                  on a global stage
                </div>
              </h2>
              <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                <p>
                  Our vision is a united and empowered Cambodia where people
                  proudly support local excellence, celebrate their heritage and
                  drive innovation that reflects their creativity, their
                  resolve, and the beauty of their Khmer spirit. We envision a
                  nation standing proudly and confidently on the global stage,
                  able to offer solutions to global needs and pave the way to
                  prosperity and peace.
                </p>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empowerment at the heart Section */}
      <div className="relative bg-[#1c97d4] py-16 sm:py-20">
        <div className="text-base-100 pointer-events-none absolute -top-24 left-0">
          <div className="flex items-end -space-x-12">
            <div className="translate-y-10 transform">
              <BigFlower
                width={492}
                height={478}
                className="h-64 w-64 text-white sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-119 lg:w-123"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl tracking-tight text-balance text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            <div>
              Empowerment <br /> at the heart of our roadmap
            </div>
          </h2>
          <p className="sm:text-md mx-auto mt-4 max-w-xl text-xs leading-relaxed text-white sm:mt-6 lg:max-w-2xl lg:text-lg">
            <p>
              True Khmer is seeking to establish a virtuous cycle of positive
              action that will allow our members to find the energy and support
              to stand by the right side of history and take an active part in
              reshaping our nation.
            </p>
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-2 justify-items-center gap-8 px-4 sm:mt-12 sm:gap-12 sm:px-6 md:grid-cols-4 lg:gap-20 xl:gap-32">
          {empowermentCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="flex flex-col items-center gap-4 transition-transform duration-300 ease-in-out hover:scale-105 sm:gap-6"
              >
                <div className={cardContainerClasses}>
                  <IconComponent className={iconClasses} />
                </div>
                <div className="text-center text-white">
                  <h1 className="text-lg font-semibold sm:text-xl md:text-2xl xl:text-3xl/tight">
                    <span>{card.title}</span>
                  </h1>
                  <h3 className="text-sm font-light sm:text-base md:text-lg xl:text-xl">
                    <span>{card.subtitle}</span>
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Pillar Section */}
      <div className="bg-base-100 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-[#243d95] sm:text-5xl">
            <div>Four Pillars of Action</div>
          </h2>
          <p className="text-base-content/60 mt-6 text-lg">
            <p>
              To achieve that objective we have defined four pillars of action
              that will be conducted throughout the year:
            </p>
          </p>
        </div>
        {/* Pillars Carousel */}
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <PillarsCarousel pillars={pillars} />
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-base-100 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="text-md mb-3 font-semibold text-[#1c97d4] uppercase">
            <div>Our Team</div>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-[#243d95] sm:text-5xl">
            <span>The minds behind the initiative</span>
          </h2>
          <p className="mt-6 text-lg text-gray-500">
            <p>
              The True Khmer initiative is led by a board of dedicated and
              strong Khmer leaders who share the belief that "Khmer is enough"
              and that our future is in our hands. Our board is augmented by a
              committed and experienced executive team that wheels behind the
              scenes to drive the change envisioned by our community.
            </p>
          </p>

          {/* Board Members Section */}
          <div className="mt-20">
            <h3 className="mb-12 text-2xl font-semibold text-[#243d95] lg:text-4xl">
              <div>Board Members</div>
            </h3>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {boardMembers.map((member) => (
                <BoardMember
                  key={member.name}
                  name={member.name}
                  imageUrl={member.imageUrl}
                />
              ))}
            </div>
          </div>

          {/* Ambassador Section */}
          <div className="mx-auto mt-20 w-full max-w-6xl">
            <h3 className="mb-12 text-center text-2xl font-semibold text-[#243d95] lg:text-4xl">
              <div>Ambassadors Board</div>
            </h3>

            <div className="flex w-full flex-col items-center gap-y-12 sm:flex-row sm:items-start sm:justify-between">
              {ambassadors.map((member) => (
                <BoardMember
                  key={member.name}
                  name={member.name}
                  imageUrl={member.imageUrl}
                  imagePosition={member.imagePosition}
                  imageTransform={member.imageTransform}
                />
              ))}
            </div>
          </div>

          {/* Executive Board Members Section */}
          <div className="mt-20 lg:mt-32">
            <h3 className="mb-12 text-2xl font-semibold text-[#243d95] lg:text-4xl">
              <div>Executive Board Members</div>
            </h3>
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-4 lg:mx-0 lg:max-w-none">
              {executiveMembers.map((member) => (
                <ExecutiveMember
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
