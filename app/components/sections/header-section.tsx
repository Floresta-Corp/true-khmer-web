import { Play } from "lucide-react";

interface HeaderSectionProps {
  onWatchVideo?: () => void;
  onViewDetails?: () => void;
}

const imgMotionDiv =
  "http://localhost:3845/assets/2f660cb7461daff1ea5fedd3dd4a3da1dac82898.png";
const imgPlay =
  "http://localhost:3845/assets/d48ed6039f820ad3b084f711261289523548cf8b.svg";

export function HeaderSection({
  onWatchVideo,
  onViewDetails,
}: HeaderSectionProps) {
  return (
    <div
      className="animate-fade-in relative flex w-full items-center justify-center overflow-hidden bg-black"
      data-name="motion.div"
      data-node-id="14300:4026"
    >
      {/* Background image with gradient overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <img
          alt=""
          className="absolute h-full w-full object-cover"
          src={imgMotionDiv}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 via-50% to-transparent" />
      </div>

      {/* Content Container */}
      <div
        className="relative flex w-full shrink-0 items-center justify-center px-[250px] py-[56px]"
        style={{ height: "567px" }}
        data-name="div"
        data-node-id="14300:4027"
      >
        {/* Content Box */}
        <div
          className="animate-scale-in relative flex w-full max-w-[672px] flex-col items-center justify-center gap-[23px]"
          data-name="motion.div"
          data-node-id="14300:4028"
        >
          {/* Badge */}
          <div
            className="animate-slide-up flex w-full items-center justify-center"
            style={{ animationDelay: "0.2s" }}
            data-name="div"
            data-node-id="14300:4029"
          >
            <div
              className="rounded-full bg-blue-600 px-2 py-0.75"
              data-name="span"
              data-node-id="14300:4030"
            >
              <p
                className="text-[11px] font-bold tracking-wider whitespace-nowrap text-white uppercase"
                data-node-id="14300:4031"
              >
                People of cambodia
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <div
            className="animate-slide-up flex w-full items-center justify-center"
            style={{ animationDelay: "0.3s" }}
            data-name="h1"
            data-node-id="14300:4032"
          >
            <h1
              className="text-center leading-tight font-semibold tracking-tight whitespace-nowrap text-white"
              style={{
                fontSize: "52.5px",
                lineHeight: "65.625px",
                letterSpacing: "-0.9857px",
              }}
              data-node-id="14300:4033"
            >
              Stories that shape the nation
            </h1>
          </div>

          {/* Subtitle */}
          <div
            className="animate-slide-up flex w-full items-center justify-center"
            style={{ animationDelay: "0.4s" }}
            data-name="p"
            data-node-id="14300:4034"
          >
            <p
              className="text-center leading-[26px] font-medium tracking-tight whitespace-nowrap text-white/80"
              style={{
                fontSize: "20px",
                letterSpacing: "-0.3125px",
              }}
              data-node-id="14300:4035"
            >
              Khmer role models stories that inspire positive change.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className="animate-slide-up flex w-full items-center justify-center gap-[14px]"
            style={{ height: "42px", animationDelay: "0.5s" }}
            data-name="div"
            data-node-id="14300:4036"
          >
            {/* Watch Video Button */}
            <button
              onClick={onWatchVideo}
              className="flex items-center gap-[7px] rounded-full bg-white px-[18px] py-2 transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-lg"
              data-name="Link"
              data-node-id="14300:4037"
            >
              <img
                alt="play icon"
                className="h-[14px] w-[14px]"
                src={imgPlay}
              />
              <span
                className="text-[14px] leading-[21px] font-bold tracking-tight whitespace-nowrap text-blue-600"
                data-node-id="14300:4040"
              >
                Watch Video
              </span>
            </button>

            {/* View Details Button */}
            <button
              onClick={onViewDetails}
              className="flex h-[40px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-[29px] py-1 transition-all duration-300 hover:scale-105 hover:bg-white/20"
              data-name="Link"
              data-node-id="14300:4041"
            >
              <span
                className="text-[14px] leading-[21px] font-bold tracking-tight whitespace-nowrap text-white"
                data-node-id="14300:4042"
              >
                View details
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
