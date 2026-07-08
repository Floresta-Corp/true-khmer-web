import clsx from "clsx";
import UserChange from "../../../../public/icons/userChange";
import RefugeeIcon from "../../../../public/icons/refugee";
import Certificate from "../../../../public/icons/certificate";
import TrophyStar from "../../../../public/icons/trophyStar";
import BigFlower from "../../../../public/icons/bigFlower";

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

export function EmpowermentSection() {
  return (
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
          Empowerment <br /> at the heart of our roadmap
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-white sm:mt-6 sm:text-base lg:max-w-2xl lg:text-lg">
          True Khmer is seeking to establish a virtuous cycle of positive action
          that will allow our members to find the energy and support to stand by
          the right side of history and take an active part in reshaping our
          nation.
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
                  {card.title}
                </h1>
                <h3 className="text-sm font-light sm:text-base md:text-lg xl:text-xl">
                  {card.subtitle}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
