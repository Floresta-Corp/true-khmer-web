import { Card } from "~/components/ui/card";

export default function LaunchpadProjectCoverCard() {
  return (
    <Card
      className="h-80 w-full flex items-end p-8"
      // IMAGE THUMBNAIL
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="flex items-end gap-4">
        {/* IMAGE PROFILE */}
        <div className="size-30 bg-gray-200 rounded-lg border-5 border-white" />
        <div className="font-bold text-white text-[46px] leading-17.25">
          {/* TITLE */}
          Hello World
        </div>
      </div>
    </Card>
  );
}
