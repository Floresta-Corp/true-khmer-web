import BigFlower from "~/components/icons/bigFlower";
import FullFlower from "~/components/icons/fullFlower";
import WaveBackground from "~/components/icons/waveBg";

export function PocBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-0 text-[#1c97d4]">
        <WaveBackground />
      </div>

      <div className="pointer-events-none absolute top-0 left-0 z-0 hidden text-[#1c97d4] lg:block">
        <div className="translate-y-1 space-y-5">
          <BigFlower width={492} height={478} />
          <FullFlower width={162} height={158} />
          <FullFlower />
        </div>
      </div>
    </>
  );
}
