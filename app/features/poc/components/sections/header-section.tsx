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
      className="relative flex items-center justify-center overflow-hidden bg-black w-full"
      data-name="motion.div"
      data-node-id="14300:4026"
    >
      {/* Background image with gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <img
          alt=""
          className="absolute w-full h-full object-cover"
          src={imgMotionDiv}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 via-50% to-transparent" />
      </div>

      {/* Content Container */}
      <div
        className="relative flex items-center justify-center w-full px-[250px] py-[56px] shrink-0"
        style={{ height: "567px" }}
        data-name="div"
        data-node-id="14300:4027"
      >
        {/* Content Box */}
        <div
          className="relative w-full max-w-[672px] flex flex-col items-center justify-center gap-[23px]"
          data-name="motion.div"
          data-node-id="14300:4028"
        >
          {/* Badge */}
          <div
            className="flex items-center justify-center w-full"
            data-name="div"
            data-node-id="14300:4029"
          >
            <div
              className="bg-blue-600 rounded-full px-2 py-0.75"
              data-name="span"
              data-node-id="14300:4030"
            >
              <p
                className="text-white font-bold text-[11px] uppercase tracking-wider whitespace-nowrap"
                data-node-id="14300:4031"
              >
                People of cambodia
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <div
            className="flex items-center justify-center w-full"
            data-name="h1"
            data-node-id="14300:4032"
          >
            <h1
              className="text-white font-semibold text-center leading-tight tracking-tight whitespace-nowrap"
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
            className="flex items-center justify-center w-full"
            data-name="p"
            data-node-id="14300:4034"
          >
            <p
              className="text-white/80 font-medium text-center leading-[26px] tracking-tight whitespace-nowrap"
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
            className="flex gap-[14px] items-center justify-center w-full"
            style={{ height: "42px" }}
            data-name="div"
            data-node-id="14300:4036"
          >
            {/* Watch Video Button */}
            <button
              onClick={onWatchVideo}
              className="bg-white rounded-full px-[18px] py-2 flex items-center gap-[7px] hover:bg-gray-100 transition-colors"
              data-name="Link"
              data-node-id="14300:4037"
            >
              <img
                alt="play icon"
                className="w-[14px] h-[14px]"
                src={imgPlay}
              />
              <span
                className="font-bold text-blue-600 text-[14px] leading-[21px] tracking-tight whitespace-nowrap"
                data-node-id="14300:4040"
              >
                Watch Video
              </span>
            </button>

            {/* View Details Button */}
            <button
              onClick={onViewDetails}
              className="bg-white/10 border border-white/20 rounded-full px-[29px] py-1 h-[40px] flex items-center justify-center hover:bg-white/20 transition-colors"
              data-name="Link"
              data-node-id="14300:4041"
            >
              <span
                className="text-white font-bold text-[14px] leading-[21px] tracking-tight whitespace-nowrap"
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
